// export interface Configuration {
//   method: string;
//   headers: any;
//   body?: string;
// }

// // REQUEST RUNNER MACHINE TYPES
// export type RequestRunnerEvent =
//   | { type: 'done.invoke.fetch-api-call'; data: object[] }
//   | { type: 'done.invoke.save-response'; data: object[] }
//   | { type: 'done.invoke.check-assertions'; data: object[] }
export type BasicValue = string | number | undefined;

export type AssertionResult = {
  responseId: number;
  pass: boolean;
  actual: BasicValue;
  assertionId: number;
};

export type Assertion = {
  property: BasicValue;
  comparison: string;
  expected: BasicValue;
  id: number;
};

export type Response = {
  request: {
    assertions: Assertion[];
  };
  status: number;
  latency: number;
  body: any;
  headers: any;
  id: number;
};

export interface AssertionRunnerContext {
  requestTitle: string;
  response: Response;
  assertionResults: Array<any> | null;
}

export type AssertionRunnerEvent =
  | { type: "done.invoke.save-assertion-results"; data: any }
  | { type: "done.invoke.check-assertions"; data: any[] };

export type AssertionRunnerServices = {
  saveAssertionResults: {
    data: { response: any };
  };
  checkAssertions: {
    data: AssertionResult[];
  };
  getResponses: {
    data: any;
  };
};
// export type RequestRunnerTypestate =
//   | {
//     value: "fetching"
//     context: RequestRunnerContext & {
//       responseData: undefined
//       responseId: undefined
//     }
//   }
//   | {
//     value: "loaded"
//     context: RequestRunnerContext & {
//       responseData: undefined
//       responseId: undefined
//     }
//   }
//   | {
//     value: "responseSaved"
//     context: RequestRunnerContext & {
//       responseId: undefined
//     }
//   }
//   | {
//     value: "done"
//     context: RequestRunnerContext
//   }

// // REQUEST PROCESSOR MACHINE TYPES
// export type RequestProcessorEvent =
//   | { type: 'done.invoke.parse-request'; data: any[] }
//   | { type: 'done.invoke.search-references'; data: any[] }
//   | { type: 'done.invoke.interpolate-variables'; data: object }
//   | { type: 'QUERY'; collectionId: number }

// export interface RequestProcessorContext {
//   request?: object
//   responses?: object[]
//   variablesAndPaths?: any[]
// }

// export type RequestProcessorTypestate =
//   | {
//     value: "parsing"
//     context: RequestProcessorContext & {
//       variablesAndPaths: undefined
//     }
//   }
//   | {
//     value: "searching"
//     context: RequestProcessorContext
//   }
//   | {
//     value: "interpolating"
//     context: RequestProcessorContext
//   }
//   | {
//     value: "done"
//     context: RequestProcessorContext
//   }

// // COLLECTION RUNNER MACHINE TYPES
// export type CollectionRunnerEvent =
//   | { type: 'QUERY'; collectionId: number }
//   | { type: 'done.invoke.query-requests'; data: object[] }
//   | { type: 'done.invoke.run-request'; data: object[] }

// export interface CollectionRunnerContext {
//   collectionId?: number
//   requestList?: object[]
//   request?: object
//   responses?: object[]
// }

// export type AssertionRunnerTypestate =
//   | {
//     value: "idle"
//     context: CollectionRunnerContext & {
//       requestList: undefined
//       request: undefined
//     }
//   }
//   | {
//     value: "querying"
//     context: AssertionRunnerContext & {
//       requestList: undefined
//       request: undefined
//     }
//   }
//   | {
//     value: "running"
//     context: CollectionRunnerContext
//   }
//   | {
//     value: "complete"
//     context: CollectionRunnerContext
//   }
