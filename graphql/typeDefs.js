const typeDefs = `#graphql
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: String!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: String!
    born: Int
    books: [Book!]!
    bookCount: Int!
  }

  type Query {
    bookCount: Int
    allBooks(author: String, genre: [String!]): [Book!]!

    authorCount: Int
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(title: String!, author: String!, published: Int, genres: [String!]!): Book!
    
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

export default typeDefs;
