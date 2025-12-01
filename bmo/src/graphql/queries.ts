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

export const EDIT_ENTRY = gql`
  mutation EditEntry(
    $timestamp: String!
    $user_response: String
    $bmo_response: String
  ) {
    editEntry(
      timestamp: $timestamp
      user_response: $user_response
      bmo_response: $bmo_response
    ) {
      timestamp
      user_response
      bmo_response
    }
  }
`;

export const DELETE_ENTRY = gql`
  mutation DeleteEntry($timestamp: String!) {
    deleteEntry(timestamp: $timestamp)
  }
`;
