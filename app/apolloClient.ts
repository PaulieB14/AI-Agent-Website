import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/64322/dnxs-agent-key/version/latest',
  cache: new InMemoryCache(),
});

export default client;
