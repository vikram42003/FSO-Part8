import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";

import User from "./models/userSchema.js";

import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Could not connect to MongoDB\n", error);
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    if (req?.headers?.authorization?.startsWith("Bearer ")) {
      const token = req.headers.authorization.split(" ")[1];
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        throw new GraphQLError("The token could not be verified, try logging in again", {
          extensions: {
            code: "AUTHENTICATION_FAILED",
          },
        });
      }
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
