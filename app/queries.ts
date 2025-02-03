import { gql } from '@apollo/client';

export const HOLDERS_QUERY = gql`
  query GetHolders {
    agentKey(id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df") {
      users(first: 100, orderBy: balance, orderDirection: desc) {
        balance
        id
      }
    }
  }
`;

export const SUBSCRIBERS_QUERY = gql`
  query GetSubscribers {
    agentKey(id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df") {
      users(first: 100, orderBy: totalSubscribed, orderDirection: desc) {
        totalSubscribed
        id
      }
    }
  }
`;
