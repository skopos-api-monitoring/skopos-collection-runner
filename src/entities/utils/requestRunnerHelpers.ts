import { GraphQLClient, gql } from 'graphql-request'
import fetch from 'node-fetch';
const endpoint = 'http://localhost:3001/graphql'
const graphQLClient = new GraphQLClient(endpoint)

interface Configuration {
  method: string;
  headers: any;
  body?: string;
}

export async function invokeFetchAPICall(request, collectionRunId) {
  let { id: requestId, url, method, headers, body, assertions } = request
  let config: Configuration = { method, headers };
  if (method.toUpperCase() !== "GET") {
    config = { ...config, body };
  }

  const timestampStart = Date.now()
  let fetchResponse = await fetch(url, config)
  const timeForRequest = Date.now() - timestampStart

  let json = await fetchResponse.json()
  const responseVariables = {
    data: {
      status: fetchResponse.status,
      headers: fetchResponse.headers,
      latency: timeForRequest,
      body: json,
      CollectionRun: {
        connect: {
          id: collectionRunId
        }
      },
      request: {
        connect: {
          id: Number(requestId)
        }
      }
    }
  }

  return responseVariables
}

export async function invokeSaveResponse(responseData) {
  const responseMutation = gql`
    mutation CreateOneResponse($data: ResponseCreateInput!) {
      createOneResponse(data: $data) {
        id
      }
    }`

  const databaseResponse = await graphQLClient.request(responseMutation, responseData)
  return databaseResponse.createOneResponse.id
}