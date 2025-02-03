import { gql } from '@apollo/client';

export const HOLDERS_QUERY = gql`
  query GetHolders {
    agentKey(id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df") {
      totalSubscribed
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
      totalSubscribed
      users(first: 100, orderBy: totalSubscribed, orderDirection: desc) {
        totalSubscribed
        id
      }
    }
  }
`;

export const USER_LOCKED_QUERY = gql`
  query UserLocked($user: String = "0xa6f8509c623e23019f52f8e5d7776ca05641c359") {
    agentKeyUsers(
      where: {
        user: $user,
        agentKey: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df"
      }
    ) {
      totalSubscribed
    }
  }
`;

// Helper function to format amounts with commas
export const formatAmount = (amount: string) => {
  const amountInGwei = parseFloat(amount) / 1e9;
  return amountInGwei.toLocaleString('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  });
};

// Helper function to check if user has required tokens
export const hasRequiredTokens = (totalSubscribed: string | undefined) => {
  if (!totalSubscribed) return false;
  const amount = parseFloat(totalSubscribed) / 1e9;
  return amount >= 25000;
};
