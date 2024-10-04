import { gql } from "@apollo/client";

export const addBook = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      published
      author
      id
      genres
    }
  }
`;
