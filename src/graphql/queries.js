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
  query getAllBooks($genre: [String!]) {
    allBooks(genre: $genre) {
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

export const getGenres = gql`
  query getGenres {
    allBooks {
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
