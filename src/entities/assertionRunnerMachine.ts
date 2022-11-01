import { createMachine, assign } from "xstate";
import {
  AssertionRunnerContext,
  AssertionRunnerEvent,
  AssertionRunnerServices,
} from "../types.js";
import { invokeCheckAssertions } from "../utils/assertionRunnerHelpers.js";
import {
  invokeSaveAssertionResults,
} from "../services/queries.js";

//
export const assertionRunnerMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QENazAJwC4EsD2AdgLQYCuBBmAdDhADZgDEAygCoCCASqwNoAMAXUSgADnlg5chYSAAeiIgGYAbAE4qARgAsfZQCYArABoQATwWKqBvgHY9Gmzrt7lB-QYC+Hk6nTZ8xGQU1ACOpJimOARQjBCEYDQEAG54ANYJMFhEvphSBLD8QkggYhJ5MvIIRBp8lgAcqlo2NgaKqrqGJuYIGop6VhouGu0adQYGTV4+aLkBJOSUGFQAxgAWYMupUTFxlIkp6Svrm9kz-oQFgjKlkgEy3YoaygNDI2MTNiaVeuqqdXxaVSqFwtGx1QaeKYgAh4CBwGQ5c6BBbUWgMa7iW7SYqVJQGfrWLQaaxtDrGMwKGzqZQ0lSuZraOpaLRQxF5ebBJZhCLbDFlO44ixqKj2OotLqIbTqRSPVQTOXKPgfVlndlBRZHDZbaJ8rEECpCmxUPjDZqtdruCUIR7PAyDZTDE3vSbeEBsubq6jLPAAWxEDCwYF15UFVRU6lF4opCC0dWe-0BwOUoPBhhVfjVKIwwYFoFxRKNkfJ3WqyjqVBpyhUYyegJldS8XiAA */
  createMachine(
    {
      context: {
        collectionRunId: null,
        responses: null,
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
          },
        },
        saving: {
          invoke: {
            src: "saveAssertionResults",
            id: "save-assertion-results",
            onDone: [
              {
                target: "complete",
                actions: "assignAssertionResults",
              },
            ],
          },
        },
        complete: {
          type: "final",
        },
      },
    },
    {
      actions: {
        // assignCollectionRunId: assign({
        //   collectionRunId: (context, event) => event["collectionRunId"],
        // }),
        // assignResponses: assign({
        //   responses: (context, event) => event["data"],
        // }),
        assignAssertionResults: assign({
          assertionResults: (context, event) => event["data"],
        }),
      },
      services: {
        checkAssertions: (context, event) =>
          invokeCheckAssertions(context.responses),
        saveAssertionResults: (context, event) =>
          invokeSaveAssertionResults(context.assertionResults),
      },
    }
  );
