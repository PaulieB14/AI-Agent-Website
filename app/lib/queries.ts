import { gql } from '@apollo/client';

const DNXS_AGENT_KEY = "0x4aaba1b66a9a3e3053343ec11beeec2d205904df";

export const HOLDERS_QUERY = gql`
  query GetHolders($agentKey: String!) {
    agentKey(id: $agentKey) {
      users(first: 1000, orderBy: balance, orderDirection: desc) {
        id
        balance
      }
    }
  }
`;

export const SUBSCRIBERS_QUERY = gql`


  query GetSubscribers($agentKey: String!) {
    agentKey(id: $agentKey) {
      totalSubscribed
      totalSubscribers
      users(first: 1000, orderBy: totalSubscribed, orderDirection: desc, where: { totalSubscribed_gt: "0" }) {
        id
        totalSubscribed
      }
    }
  }
`;

export const CHECK_SUBSCRIPTION_QUERY = gql`
  query UserLocked($user: String!) {
    agentKeyUsers(where: { user: $user, agentKey: "${DNXS_AGENT_KEY}" }) {
      totalSubscribed
    }
  }
`;

export const FETCH_AGENT_INFO_QUERY = gql`
  query FetchAgentInfo($agentKey: String!) {
    agentKey(id: $agentKey) {
      name
      totalSubscribed
      totalSubscribers
      ans {
        symbol
      }
    }
  }
`;

export const FETCH_AGENT_SUBSCRIBERS_QUERY = gql`
  query FetchAgentSubscribers($agentKey: String!) {
    agentKey(id: $agentKey) {
      users(
        first: 1000
        orderBy: totalSubscribed
        orderDirection: desc
        where: { totalSubscribed_gt: "0" }
      ) {
        id
        totalSubscribed
        agentKey {
          ans {
            symbol
          }
        }
      }
    }
  }
`;
