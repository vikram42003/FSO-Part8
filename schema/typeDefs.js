const typeDefs = `#graphql
  type Books {
    title: String!
    published: Int!
    author: String!
    id: String!
    genres: [String!]!
  }
  type Query {
    bookCount: Int
    authorCount: Int
    allBooks: [Books!]!
  }
`;

export default typeDefs;
