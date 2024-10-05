import Book from "../models/bookSchema.js";
import Author from "../models/authorSchema.js";

const resolvers = {
  Query: {
    bookCount: async () => await Book.countDocuments(),
    allBooks: async (_parent, args) => {
      const author = await Author.find({ name: args.author });
      return await Book.find({ author: author._id, genres: args.genre }).populate();
    },

    authorCount: async () => await Author.countDocuments(),
    allAuthors: async () => await Author.find({}),
  },

  // Mutation: {
  //   addBook: (_parent, args) => {
  //     const newBook = { ...args, id: uuid() };
  //     books.push(newBook);
  //     if (!authors.find((a) => a.name == newBook.author)) authors.push({ name: newBook.author, id: uuid() });
  //     authors = calculateBookCount(authors, books);
  //     return newBook;
  //   },

  //   editAuthor: (_parent, args) => {
  //     let changedAuthor;

  //     authors = authors.map((a) => {
  //       if (a.name == args.name) {
  //         changedAuthor = { ...a, born: args.setBornTo };
  //         return changedAuthor;
  //       } else {
  //         return a;
  //       }
  //     });

  //     return changedAuthor;
  //   },
  // },
};

export default resolvers;
