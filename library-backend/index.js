import { ApolloServer } from "@apollo/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";

import express from "express";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

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

const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    introspection: true,
  });

  await server.start();

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
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

        return { currentUser: null };
      },
    })
  );

  const PORT = 4000;

  httpServer.listen(PORT, () => {
    console.log(`Server ready at port ${PORT}`);
  });
};

startServer();
