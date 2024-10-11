import { useQuery, useSubscription } from "@apollo/client";

import { getAllBooks } from "../graphql/queries";
import { bookAdded } from "../graphql/subscriptions";

const BookTable = ({ genre }) => {
  const { data, loading, error } = useQuery(
    getAllBooks,
    genre
      ? {
          variables: { genre },
        }
      : {}
  );

  useSubscription(bookAdded, {
    onData: ({ data, client }) => {
      const newBook = data.data.bookAdded;

      if (newBook) alert(`A new book titled ${newBook.title} by ${newBook.author.name} was added`);

      client.cache.updateQuery({ query: getAllBooks }, (existingData) => {
        if (existingData && !existingData.allBooks.some((book) => book.title === newBook.title)) {
          return {
            allBooks: [...existingData.allBooks, newBook],
          };
        }
        return existingData;
      });

      newBook.genres.forEach((genre) => {
        client.cache.updateQuery({ query: getAllBooks, variables: { genre } }, (existingData) => {
          if (existingData && !existingData.allBooks.some((book) => book.title === newBook.title)) {
            return {
              allBooks: [...existingData.allBooks, newBook],
            };
          }
          return existingData;
        });
      });
    },

    onError: (error) => {
      console.log("Subscription error\n", error);
    },
  });

  if (loading) return <div>Loading books data...</div>;

  if (error) return <div>Some error occured...</div>;

  const tableStyle = {
    width: "100%",
    textAlign: "left",
  };

  const books = data.allBooks;

  return (
    <div>
      <table style={tableStyle}>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
