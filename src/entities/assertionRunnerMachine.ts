import { createMachine, assign } from "xstate";
import {
  AssertionRunnerContext,
  AssertionRunnerEvent,
  AssertionRunnerServices,
} from "../types";
import { invokeCheckAssertions, assertionFailed } from "../utils/assertionRunnerHelpers";
import { invokeSaveAssertionResults } from "../utils/assertionRunnerHelpers";
import { escalate } from "xstate/lib/actions";

//
export const assertionRunnerMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QENazAJwC4EsD2AdgLQYCuBBmAdDhADZgDEAygCoCCASqwNoAMAXUSgADnlg5chYSAAeiIgGYAbAE4qARgAsfZQCYArABoQATwWKqBvgHY9Gmzrt7lB-QYC+Hk6nTZ8xGQU1ACOpJimOARQjBCEYDQEAG54ANYJMFhEvphSBLD8QkggYhJ5MvIIRBp8lgAcqlo2NgaKqrqGJuYIGop6VhouGu0adQYGTV4+aLkBJOSUGFQAxgAWYMupUTFxlIkp6Svrm9kz-oQFgjKlkgEy3YoaygNDI2MTNiaVeuqqdXxaVSqFwtGx1QaeKYgAh4CBwGQ5c6BBbUWgMa7iW7SYqVJQGfrWLQaaxtDrGMwKGzqZQ0lSuZraOpaLRQxF5ebBJZhCLbDFlO44ixqKj2OotLqIbTqRSPVQTOXKPgfVlndlBRZHDZbaJ8rEECpCmxUPjDZqtdruCUIR7PAyDZTDE3vSbeEBsubq6jLPAAWxEDCwYF15UFVRU6lF4opCC0dWe-0BwOUoPBhhVfjVKIwwYFoFxRKNkfJ3WqyjqVBpyhUYyegJldS8XiAA */
  createMachine(
    {
      context: {
        requestTitle: null,
        response: null,
        assertionResults: null,
      },
      predictableActionArguments: true,
      tsTypes: {} as import("./assertionRunnerMachine.typegen.js").Typegen0,
      schema: {
        context: {} as AssertionRunnerContext,
        events: {} as AssertionRunnerEvent,
        services: {} as AssertionRunnerServices,
      },
      id: "assertion-runner",
      initial: "checking",
      states: {
        checking: {
          invoke: {
            src: "checkAssertions",
            id: "check-assertions",
            onDone: [
              {
                target: "saving",
                actions: "assignAssertionResults",
              },
            ],
            onError: {
              target: 'failedGeneric'
            }
          },
        },
        saving: {
          invoke: {
            src: "saveAssertionResults",
            id: "save-assertion-results",
            onDone:
              [{
                target: 'failedCheck',
                cond: { type: 'assertionFailed' },
              },
              {
                target: 'complete',
                actions: "assignAssertionResults",
              }],
            onError: {
              target: 'failedGeneric'
            }
          },
        },
        complete: {
          type: "final",
        },
        failedCheck: {
          type: "final",
          entry: 'escalateErrorMessage'
        },
        failedSave: {
          type: "final",
          entry: escalate({ message: 'An error occurred saving assertion results to the database' })
        },
        failedGeneric: {
          type: "final",
          entry: escalate({ message: 'An error occurred in the assertion runner' })
        }
      },
    },
    {
      actions: {
        assignAssertionResults: assign({
          assertionResults: (context, event) => event["data"],
        }),
        escalateErrorMessage: escalate((context, _event) => {
          const failedAssertionId = context.assertionResults.find((result) => result.pass === false).assertionId
          const failedAssertion = context['response'].request.assertions.find((assertion) => assertion.id === failedAssertionId)
          const requestTitle = context['requestTitle']
          console.log("failed assertion", failedAssertion)
          return { message: `Following assertion has failed for request titled "${requestTitle}": ${JSON.stringify(failedAssertion, null, 2)}`}
        })
      },
      guards: {
        assertionFailed
      },
      services: {
        checkAssertions: (context) =>
          invokeCheckAssertions(context.response),
        saveAssertionResults: (context) =>
          invokeSaveAssertionResults(context.assertionResults),
      },
    }
  );
