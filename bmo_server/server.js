import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const history = [
  {
    timestamp: "29-11-2025 15:23:50",
    user_response: "Albert Request: hello",
    bmo_response: "BMO response: Yes Sir.",
  },
  {
    timestamp: "29-11-2025 15:24:10",
    user_response: "Albert Request: open youtube",
    bmo_response: "BMO response: Opening YouTube.",
  },
  {
    timestamp: "29-11-2025 15:24:35",
    user_response: "Albert Request: what's the time",
    bmo_response: "BMO response: It's 3:24 PM.",
  },
  {
    timestamp: "29-11-2025 15:25:00",
    user_response: "Albert Request: play some music",
    bmo_response: "BMO response: Playing your playlist.",
  },
  {
    timestamp: "29-11-2025 15:25:20",
    user_response: "Albert Request: shutdown system",
    bmo_response: "BMO response: Cannot do that without permission.",
  },
];


const typeDefs = `
    type Query {
        getHistory: [History]
        getHistoryByTimestamp(timestamp: String!): History
    }

    type Mutation {
        editEntry(
            timestamp: String!,
            user_response: String,
            bmo_response: String
        ): History

        deleteEntry(
            timestamp: String!
        ): Boolean
    }

    type History {
        timestamp: String
        user_response: String
        bmo_response: String
    }
`;

const resolvers = {
  Query: {
    getHistory: () => history,

    getHistoryByTimestamp: (parent, args) => {
      return history.find((entry) => entry.timestamp === args.timestamp);
    },
  },

  Mutation: {
    editEntry: (parent, args) => {
      const { timestamp, user_response, bmo_response } = args;

      const entry = history.find((h) => h.timestamp === timestamp);
      if (!entry) return null;

      if (user_response !== undefined) entry.user_response = user_response;
      if (bmo_response !== undefined) entry.bmo_response = bmo_response;

      return entry;
    },

    deleteEntry: (parent, args) => {
      const index = history.findIndex(
        (entry) => entry.timestamp === args.timestamp
      );

      if (index === -1) return false;

      history.splice(index, 1);
      return true;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server running at: ${url}`);
