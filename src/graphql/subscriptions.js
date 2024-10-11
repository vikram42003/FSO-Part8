import { gql } from "@apollo/client";

export const bookAdded = gql`
  subscription bookAdded {
    bookAdded {
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
