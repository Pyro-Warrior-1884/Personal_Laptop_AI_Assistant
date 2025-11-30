import { gql } from "@apollo/client/core";

export const GET_HISTORY = gql`
  query {
    getHistory {
      timestamp
    }
  }
`;

export const GET_HISTORY_BY_TIMESTAMP = gql`
  query GetHistoryByTimestamp($timestamp: String!) {
    getHistoryByTimestamp(timestamp: $timestamp) {
      timestamp
      user_response
      bmo_response
    }
  }
`;
