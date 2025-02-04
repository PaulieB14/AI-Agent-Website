import { gql } from '@apollo/client';

export const HOLDERS_QUERY = gql`
  query GetHolders {
    agentKey(id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df") {
      users {
        id
        balance
      }
    }
  }
`;

export const SUBSCRIBERS_QUERY = gql`
  query GetSubscribers {
    agentKey(id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df") {
      users {
        id
        totalSubscribed
      }
    }
  }
`;

export const USER_LOCKED_QUERY = gql`
  query UserLocked($user: String!) {
    agentKeyUsers(
      where: { user: $user, agentKey: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df" }
    ) {
      totalSubscribed
    }
  }
`;
