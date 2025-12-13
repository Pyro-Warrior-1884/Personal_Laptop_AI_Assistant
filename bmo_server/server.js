import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dayjs from "dayjs";

import History from "./History.js";
import CustomCommand from "./Commands.js";
import Email from "./Email.js";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const parseDate = (ts) => {
  const [d, t] = ts.split(" ");
  const [day, month, year] = d.split("-").map(Number);
  const [h, m, s] = t.split(":").map(Number);
  return new Date(year, month - 1, day, h, m, s);
};

const typeDefs = `
  type History {
    timestamp: String
    user_response: String
    bmo_response: String
  }

  type CustomCommand {
    timestamp: String
    user_response: String
    bmo_response: String
  }

  type Email {
    timestamp: String
    email_address: String
  }

  type Query {
    getHistory: [History]
    getHistoryByTimestamp(timestamp: String!): History
    getLatestEntry: History

    getCommands: [CustomCommand]
    getCommandByTimestamp(timestamp: String!): CustomCommand

    getEmails: [Email]
  }

  type Mutation {
    editEntry(timestamp: String!, user_response: String, bmo_response: String): History
    deleteEntry(timestamp: String!): Boolean

    addCommand(timestamp: String!, user_response: String, bmo_response: String): CustomCommand
    editCommand(timestamp: String!, user_response: String, bmo_response: String): CustomCommand
    deleteCommand(timestamp: String!): Boolean

    sendEmail(email: String!): Boolean
  }
`;

const resolvers = {
  Query: {
    getHistory: async () => {
      const docs = await History.find().lean();
      docs.sort((a, b) => parseDate(b.timestamp) - parseDate(a.timestamp));
      return docs;
    },
    getHistoryByTimestamp: async (_, args) => {
      return History.findOne({ timestamp: args.timestamp }).lean();
    },
    getLatestEntry: async () => {
      const docs = await History.find().lean();
      if (!docs.length) return null;
      docs.sort((a, b) => parseDate(b.timestamp) - parseDate(a.timestamp));
      return docs[0];
    },

    getCommands: async () => {
      const docs = await CustomCommand.find().lean();
      docs.sort((a, b) => parseDate(b.timestamp) - parseDate(a.timestamp));
      return docs;
    },
    getCommandByTimestamp: async (_, args) => {
      return CustomCommand.findOne({ timestamp: args.timestamp }).lean();
    },

    getEmails: async () => {
      const docs = await Email.find().lean();
      docs.sort((a, b) => parseDate(b.timestamp) - parseDate(a.timestamp));
      return docs;
    }
  },

  Mutation: {
    editEntry: async (_, args) => {
      const { timestamp, user_response, bmo_response } = args;

      return History.findOneAndUpdate(
        { timestamp },
        {
          $set: {
            ...(user_response !== undefined ? { user_response } : {}),
            ...(bmo_response !== undefined ? { bmo_response } : {})
          }
        },
        { new: true }
      ).lean();
    },

    deleteEntry: async (_, args) => {
      const res = await History.deleteOne({ timestamp: args.timestamp });
      return res.deletedCount > 0;
    },

    addCommand: async (_, args) => {
      return CustomCommand.create(args);
    },

    editCommand: async (_, args) => {
      const { timestamp, user_response, bmo_response } = args;

      return CustomCommand.findOneAndUpdate(
        { timestamp },
        {
          $set: {
            ...(user_response !== undefined ? { user_response } : {}),
            ...(bmo_response !== undefined ? { bmo_response } : {})
          }
        },
        { new: true }
      ).lean();
    },

    deleteCommand: async (_, args) => {
      const res = await CustomCommand.deleteOne({ timestamp: args.timestamp });
      return res.deletedCount > 0;
    },

    sendEmail: async (_, args) => {
      try {
        const password = process.env.PASSWORD;

        const msg = {
          to: args.email,
          from: {
            email: process.env.FROM_EMAIL,
            name: process.env.FROM_NAME
          },
          subject: "Password Request",
          text: `Here is the password: ${password}`,
          html: `<p>Here is the password: <strong>${password}</strong></p>`
        };

        await sgMail.send(msg);

        const timestamp = dayjs().format("DD-MM-YYYY HH:mm:ss");
        await Email.create({ timestamp, email_address: args.email });

        return true;
      } catch (err) {
        console.error("Error sending email:", err);
        return false;
      }
    }
  }
};

const PORT = process.env.PORT || 4000;

await mongoose.connect(process.env.MONGO_URI);

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  cors: { origin: "*" }
});

console.log(`Server running at: ${url}`);
