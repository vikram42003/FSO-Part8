import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

import Book from "../models/bookSchema.js";
import Author from "../models/authorSchema.js";
import User from "../models/userSchema.js";

const resolvers = {
  Query: {
    me: (_parent, args, context) => {
      return context.currentUser;
    },

    bookCount: async () => await Book.countDocuments(),
    allBooks: async (_parent, args) => {
      const filter = {};

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          filter.author = author._id;
        }
      }
      if (args.genre) {
        filter.genres = { $all: args.genre };
      }

      return await Book.find(filter).populate("author");
    },

    authorCount: async () => await Author.countDocuments(),
    allAuthors: async () => await Author.find({}).populate("books"),
  },

  Mutation: {
    createUser: async (_parent, args) => {
      const newUser = new User({ ...args });
      try {
        const savedUser = await newUser.save();
        return savedUser;
      } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
          throw new GraphQLError("The username should be at least 4 or more charactors long", {
            extensions: {
              code: "GRAPHQL_VALIDATION_FAILED",
              invalidArgs: args.username,
              error,
            },
          });
        } else if (error.code === 11000) {
          throw new GraphQLError("User with the same title already exists on the server", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.title,
              error,
            },
          });
        }
      }
    },
    login: async (_parent, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("Invalid credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      return { value: jwt.sign({ username: user.username, id: user.id }, process.env.JWT_SECRET) };
    },

    addBook: async (_parent, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("This operation can only be performed by a logged in user", {
          extensions: {
            code: "NOT_AUTHORIZED",
          },
        });
      }

      let savedAuthor = await Author.findOne({ name: args.author });

      // Create an Author if they're not in the database
      if (!savedAuthor) {
        try {
          const newAuthor = new Author({ name: args.author });
          savedAuthor = await newAuthor.save();
        } catch (error) {
          console.log("Error occured while saving a new author\n", error);
          if (error instanceof mongoose.Error.ValidationError) {
            throw new GraphQLError(error.errors.name.message, {
              extensions: {
                code: "GRAPHQL_VALIDATION_FAILED",
                invalidArgs: error.errors.name.path,
                error,
              },
            });
          }
        }
      }

      try {
        const newBook = new Book({ ...args, author: savedAuthor.id });
        const savedBook = await newBook.save();
        savedAuthor.books = [...savedAuthor.books, savedBook.id];
        await savedAuthor.save();

        pubsub.publish("BOOK_ADDED", { bookAdded: await savedBook.populate("author") });

        return await savedBook.populate("author");
      } catch (error) {
        console.log("Error occured while saving a new book\n\n\n", error);

        if (error.code === 11000) {
          throw new GraphQLError("Book with the same title already exists on the server", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.title,
              error,
            },
          });
        } else if (error instanceof mongoose.Error.ValidationError) {
          throw new GraphQLError(error.errors.title.message, {
            extensions: {
              code: "GRAPHQL_VALIDATION_FAILED",
              invalidArgs: error.errors.title.path,
              error,
            },
          });
        }
      }
    },

    editAuthor: async (_parent, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("This operation can only be performed by a logged in user", {
          extensions: {
            code: "NOT_AUTHORIZED",
          },
        });
      }
      if (args.setBornTo) {
        try {
          const author = await Author.findOne({ name: args.name });

          // move this error to catch block maybe
          if (!author) {
            throw new GraphQLError("Author not found on the server", {
              extensions: {
                code: "NOT_FOUND",
                invalidArgs: args.name,
              },
            });
          }

          author.born = args.setBornTo;
          await author.save();
          return author;
        } catch (error) {
          console.log("Error occured while editing author\n", error);
          if (error instanceof GraphQLError) {
            throw error;
          }
        }
      }
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

export default resolvers;
