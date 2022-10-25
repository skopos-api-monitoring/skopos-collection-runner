import { GraphQLClient, gql } from 'graphql-request'
const endpoint = 'http://localhost:3001/graphql'
const graphQLClient = new GraphQLClient(endpoint)

export async function invokeQueryRequests(collectionId) {
  const query = gql`
  query Requests($where: RequestWhereInput, $orderBy: [RequestOrderByWithRelationInput!]) {
  requests(where: $where, orderBy: $orderBy) {
    id
    stepNumber
    title
    body
    method
    headers
    url
    assertions {
      id
      property
      expected
    }
    collectionId
  }
}`

  const queryVariables = {
    "where": {
      "collectionId": {
        "equals": Number(collectionId)
      }
    },
    "orderBy": {
      "stepNumber": "asc"
    }
  }

  const data = await graphQLClient.request(query, queryVariables)
  return data
}

export async function invokeCreateCollectionRun(collectionId) {
  const mutation = gql`
    mutation CreateOneCollectionRun($data: CollectionRunCreateInput!) {
      createOneCollectionRun(data: $data) {
        id
      }
    }`

  const mutationVariables = {
    "data": {
      "success": true,
      "Collection": {
        "connect": {
          "id": collectionId
        }
      }
    }
  }

  const databaseResponse = await graphQLClient.request(mutation, mutationVariables)
  return databaseResponse.createOneCollectionRun
}

export const listNotEmpty = (context, event) => context.requestList.length > 1