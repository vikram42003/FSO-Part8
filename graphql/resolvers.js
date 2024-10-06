import Book from "../models/bookSchema.js";
import Author from "../models/authorSchema.js";

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
        filter.genres = args.genre;
      }
      
      return await Book.find(filter).populate();
    },

    authorCount: async () => await Author.countDocuments(),
    allAuthors: async () => await Author.find({}).populate(),
  },

  Mutation: {
    addBook: (_parent, args) => {
      const newBook = new Book({ ...args });
    },

    editAuthor: (_parent, args) => {
      let changedAuthor;

      authors = authors.map((a) => {
        if (a.name == args.name) {
          changedAuthor = { ...a, born: args.setBornTo };
          return changedAuthor;
        } else {
          return a;
        }
      });

      return changedAuthor;
    },
  },
};

export default resolvers;
