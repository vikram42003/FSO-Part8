import { useQuery } from "@apollo/client";

import { getAllBooks } from "../graphql/queries";

const BookTable = ({ genre }) => {
  const { data, loading, error } = useQuery(getAllBooks, {
    variables: { genre },
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
