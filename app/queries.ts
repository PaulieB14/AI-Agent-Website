import { gql } from '@apollo/client';

export const USER_QUERY = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      agentKeys(orderBy: id) {
        id
        balance
        agentKey {
          ans {
            symbol
          }
          price
          marketCap
        }
      }
    }
  }
`;
