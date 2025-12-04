import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const history = [
  { timestamp: "28-11-2025 15:23:50", user_response: "Albert Request: hello", bmo_response: "BMO response: Yes Sir." },
  { timestamp: "27-11-2025 15:23:00", user_response: "Albert Request: hello", bmo_response: "BMO response: Yes Sir." },
  { timestamp: "26-11-2025 15:24:10", user_response: "Albert Request: open youtube", bmo_response: "BMO response: Opening YouTube." },
  { timestamp: "26-11-2025 15:24:35", user_response: "Albert Request: what's the time", bmo_response: "BMO response: It's 3:24 PM." },
  { timestamp: "27-11-2025 15:25:00", user_response: "Albert Request: play some music", bmo_response: "BMO response: Playing your playlist." },
  { timestamp: "28-11-2025 15:25:20", user_response: "Albert Request: shutdown system", bmo_response: "BMO response: Cannot do that without permission." },
  { timestamp: "29-11-2025 15:25:40", user_response: "Albert Request: shutdown system", bmo_response: "BMO response: Cannot do that without permission." }
];

const parseDate = (ts) => {
  const [d, t] = ts.split(" ");
  const [day, month, year] = d.split("-").map(Number);
  const [h, m, s] = t.split(":").map(Number);
  return new Date(year, month - 1, day, h, m, s);
};

const typeDefs = `
  type Query {
    getHistory: [History]
    getHistoryByTimestamp(timestamp: String!): History
    getLatestEntry: History
  }

  type Mutation {
    editEntry(timestamp: String!, user_response: String, bmo_response: String): History
    deleteEntry(timestamp: String!): Boolean
    sendEmail(email: String!): Boolean
  }

  type History {
    timestamp: String
    user_response: String
    bmo_response: String
  }
`;

const resolvers = {
  Query: {
    getHistory: () =>
      history.map((h) => ({
        timestamp: h.timestamp,
        user_response: null,
        bmo_response: null
      })),

    getHistoryByTimestamp: (_, args) =>
      history.find((entry) => entry.timestamp === args.timestamp),

    getLatestEntry: () => {
      if (history.length === 0) return null;
      return history
        .slice()
        .sort((a, b) => parseDate(b.timestamp) - parseDate(a.timestamp))[0];
    }
  },

  Mutation: {
    editEntry: (_, args) => {
      const { timestamp, user_response, bmo_response } = args;
      const entry = history.find((h) => h.timestamp === timestamp);
      if (!entry) return null;

      if (user_response !== undefined) entry.user_response = user_response;
      if (bmo_response !== undefined) entry.bmo_response = bmo_response;

      return entry;
    },

    deleteEntry: (_, args) => {
      const index = history.findIndex((entry) => entry.timestamp === args.timestamp);
      if (index === -1) return false;

      history.splice(index, 1);
      return true;
    },

    sendEmail: async (_, args) => {
      try {
        const msg = {
          to: args.email,
          from: { email: process.env.FROM_EMAIL, name: process.env.FROM_NAME },
          subject: "Password Reset",
          text: "This is your hardcoded message.",
          html: "<p>This is your <strong>hardcoded</strong> message.</p>"
        };

        await sgMail.send(msg);
        return true;
      } catch {
        return false;
      }
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

console.log(`Server running at: ${url}`);
