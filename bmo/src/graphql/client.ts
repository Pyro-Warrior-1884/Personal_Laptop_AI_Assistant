import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL,
  }),
  cache: new InMemoryCache(),
});
