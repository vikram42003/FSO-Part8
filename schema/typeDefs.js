const typeDefs = `#graphql
  type Books {
    title: String!
    published: Int!
    author: String!
    id: String!
    genres: [String!]!
  }

  type Authors {
    name: String!
    id: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int
    allBooks(author: String, genre: String): [Books!]!

    authorCount: Int
    allAuthors: [Authors!]!
  }
`;

export default typeDefs;
