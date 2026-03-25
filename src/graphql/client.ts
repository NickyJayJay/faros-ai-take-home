import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client/core'
import { RetryLink } from '@apollo/client/link/retry'
import { onError } from '@apollo/client/link/error'
import { CombinedGraphQLErrors } from '@apollo/client/errors'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
})

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error) => !!error,
  },
})

const errorLink = onError(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const gqlError of error.errors) {
      console.error(
        `[GraphQL error]: Message: ${gqlError.message}, Path: ${gqlError.path}, Operation: ${operation.operationName}`
      )
    }
  } else {
    console.error(`[Network error]: ${error.message}`)
  }
})

export const apolloClient = new ApolloClient({
  link: from([retryLink, errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          employees: {
            keyArgs: ['search', 'filter'],
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
  },
})
