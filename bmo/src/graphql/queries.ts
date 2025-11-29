import { gql } from "@apollo/client/core";

export const GET_HISTORY = gql`
  query {
    getHistory {
      timestamp
      user_response
      bmo_response
    }
  }
`;
