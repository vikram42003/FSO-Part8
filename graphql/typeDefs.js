const typeDefs = `#graphql
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

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
    me: User

    bookCount: Int
    allBooks(author: String, genre: [String!]): [Book!]!

    authorCount: Int
    allAuthors: [Author!]!
  }

  type Mutation {
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token

    addBook(title: String!, author: String!, published: Int, genres: [String!]!): Book!
    
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

export default typeDefs;
