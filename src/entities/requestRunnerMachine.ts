import { createMachine, assign } from 'xstate';
import { escalate, log } from 'xstate/lib/actions';
import { invokeFetchAPICall, invokeSaveResponse } from '../utils/requestRunnerHelpers'

export const requestRunnerMachine = createMachine({
  predictableActionArguments: true,
  tsTypes: {} as import('./requestRunnerMachine.typegen.js').Typegen0,
  schema: {
    context: {} as {
      request?: object
      collectionRunId?: number
      responseData?: object
      errorMessage?: string
    },
    events: {} as
      | { type: 'done.invoke.fetch-api-call'; data: object }
      | { type: 'done.invoke.save-response'; data: object },
    services: {} as {
      fetchAPICall: {
        data: object
      },
      saveResponse: {
        data: number
      }
    }
  },
  initial: 'fetching',
  context: {
    request: undefined,
    responseData: undefined,
    collectionRunId: undefined,
    errorMessage: undefined,
  },
  states: {
    fetching: {
      invoke: {
        id: 'fetch-api-call',
        src: 'fetchAPICall',
        onDone: {
          target: 'loaded',
          actions: 'assignResponseData'
        },
        onError: {
          target: 'failedFetch',
          actions: assign({
            errorMessage: (context, event) => event.data
          })
          // actions: log((context, event) => `Error: ${JSON.stringify(event.data, undefined, 2)}`)
        }
      }
    },
    loaded: {
      invoke: {
        id: 'save-response',
        src: 'saveResponse',
        onDone: {
          target: 'done',
          actions: 'assignResponseData'
        },
        onError: {
          target: 'failedSave',
          actions: assign({
            errorMessage: (context, event) => event.data
          })
          // actions: log((context, event) => `Error: ${JSON.stringify(event.data, undefined, 2)}`)
        }
      }
    },
    done: {
      type: 'final',
      data: (context) => context.responseData
    },
    failedFetch: {
      type: "final",
      // entry: escalate({ message: 'An error occurred fetching response for an API call' })
      entry: escalate((context, event) => context['errorMessage'])
    },
    failedSave: {
      type: "final",
      // entry: escalate({ message: 'An error occurred saving a response to the database' })
      entry: escalate((context, event) => context['errorMessage'])
    }
  }
},
  {
    actions: {
      // action implementation
      'assignResponseData': assign({
        responseData: (_, event) => event.data
      }),
    },
    delays: {
      // no delays here
    },
    guards: {
      // no guards here
    },
    services: {
      fetchAPICall: (context) => invokeFetchAPICall(context.request, context.collectionRunId),
      saveResponse: (context) => invokeSaveResponse(context.responseData)
    }
  })