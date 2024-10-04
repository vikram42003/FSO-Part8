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
