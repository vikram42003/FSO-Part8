import { gql } from "@apollo/client";

export const getAllAuthors = gql`
  query getAllAuthors {
    allAuthors {
      name
      id
      born
      bookCount
    }
  }
`;

export const getAllBooks = gql`
  query getAllBooks {
    allBooks {
      title
      published
      author {
        name
        id
        born
        bookCount
      }
      id
      genres
    }
  }
`;

export const me = gql`
  query Me {
    me {
      username
      favoriteGenre
      id
    }
  }
`;
