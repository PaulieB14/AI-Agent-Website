// app/lib/apolloClient.ts
import { ApolloClient, InMemoryCache, from, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

// Get Graph API key from environment variable
const GRAPH_API_KEY = process.env.NEXT_PUBLIC_GRAPH_API_KEY;

// Create HTTP link with proper subgraph URL
const httpLink = new HttpLink({
  uri: `https://gateway.thegraph.com/api/${GRAPH_API_KEY}/subgraphs/id/8f1XAvLcseuxGvme1EYCSCoRnpfDPa6D5jHB914gEM3L`
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error in ${operation.operationName}]: ${message}`, 
        { locations, path }
      )
    );
  }
  if (networkError) {
    console.error('[Network error]:', networkError);
  }
});

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
});

const client = new ApolloClient({
  link: from([errorLink, retryLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

export default client;