import { books as import_books, authors as import_authors } from "../dummyData.js";

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

authors = calculateBookCount(authors, books);

const resolvers = {
  Query: {
    bookCount: () => books.length,
    allBooks: (_parent, args) => {
      if (args.author) {
        return books.filter((b) => b.author.includes(args.author));
      }

      return books;
    },

    authorCount: () => authors.length,
    allAuthors: () => authors,
  },
};

export default resolvers;
