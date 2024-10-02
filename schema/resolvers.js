import { books as import_books, authors as import_authors } from "../dummyData.js";
import { v4 as uuid } from "uuid";

let books = import_books;
let authors = import_authors;

function calculateBookCount(authors, books) {
  const bookCount = {};

  books.forEach((b) => {
    bookCount[b.author] ??= 0;
    bookCount[b.author]++;
  });

  return authors.map((a) => {
    return { ...a, bookCount: bookCount[a.name] || 0 };
  });
}

const resolvers = {
  Query: {
    bookCount: () => books.length,
    allBooks: (_parent, args) => {
      let booksToReturn = books;

      if (args.author) {
        booksToReturn = booksToReturn.filter((b) => b.author.includes(args.author));
      }

      if (args.genre) {
        booksToReturn = booksToReturn.filter((b) => b.genres.some((genre) => genre.includes(args.genre)));
      }

      return booksToReturn;
    },

    authorCount: () => authors.length,
    allAuthors: () => calculateBookCount(authors, books),
  },

  Mutation: {
    addBook: (_parent, args) => {
      const newBook = { ...args, id: uuid() };
      books.push(newBook);
      if (!authors.find((a) => a.name == newBook.author)) authors.push({ name: newBook.author, id: uuid() });
      return newBook;
    },
  },
};

export default resolvers;
