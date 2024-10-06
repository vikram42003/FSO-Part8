import Book from "../models/bookSchema.js";
import Author from "../models/authorSchema.js";
import { GraphQLError } from "graphql";
import mongoose from "mongoose";

const resolvers = {
  Query: {
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
        console.log(args.genre);
        filter.genres = { $all: args.genre };
      }

      return await Book.find(filter).populate("author");
    },

    authorCount: async () => await Author.countDocuments(),
    allAuthors: async () => await Author.find({}).populate("books"),
  },

  Mutation: {
    addBook: async (_parent, args) => {
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

        return await savedBook.populate("author");
      } catch (error) {
        console.log("Error occured while saving a new book\n\n\n", error);

        if (error.code === 11000) {
          throw new GraphQLError("Book with the same title already exists on the server", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.title,
            },
          });
        } else if (error instanceof mongoose.Error.ValidationError) {
          throw new GraphQLError(error.errors.title.message, {
            extensions: {
              code: "GRAPHQL_VALIDATION_FAILED",
              invalidArgs: error.errors.title.path,
            },
          });
        }
      }
    },

    editAuthor: async (_parent, args) => {
      if (args.setBornTo) {
        try {
          const author = await Author.findOne({ name: args.name });

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
};

export default resolvers;
