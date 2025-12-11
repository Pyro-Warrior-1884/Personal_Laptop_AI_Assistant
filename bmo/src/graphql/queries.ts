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

export const GET_HISTORY_BY_TIMESTAMP = gql`
  query GetHistoryByTimestamp($timestamp: String!) {
    getHistoryByTimestamp(timestamp: $timestamp) {
      timestamp
      user_response
      bmo_response
    }
  }
`;

export const GET_LATEST_ENTRY = gql`
  query {
    getLatestEntry {
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

export const GET_COMMANDS = gql`
  query {
    getCommands {
      timestamp
      user_response
      bmo_response
    }
  }
`;

export const GET_COMMAND_BY_TIMESTAMP = gql`
  query GetCommandByTimestamp($timestamp: String!) {
    getCommandByTimestamp(timestamp: $timestamp) {
      timestamp
      user_response
      bmo_response
    }
  }
`;

export const ADD_COMMAND = gql`
  mutation AddCommand(
    $timestamp: String!
    $user_response: String
    $bmo_response: String
  ) {
    addCommand(
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

export const EDIT_COMMAND = gql`
  mutation EditCommand(
    $timestamp: String!
    $user_response: String
    $bmo_response: String
  ) {
    editCommand(
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

export const DELETE_COMMAND = gql`
  mutation DeleteCommand($timestamp: String!) {
    deleteCommand(timestamp: $timestamp)
  }
`;

