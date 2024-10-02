import { books as import_books, authors as import_authors } from "../dummyData.js";

let books = import_books;
let authors = import_authors;

const resolvers = {
  Query: {
    bookCount: () => books.length,
    allBooks: () => books,
    authorCount: () => authors.length,
  },
};

export default resolvers;
