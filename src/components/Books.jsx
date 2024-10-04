import { useQuery } from "@apollo/client";
import { getAllBooks } from "../graphql/queries";

const Books = () => {
  const { loading, error, data } = useQuery(getAllBooks);

  if (loading) return <div>Loading books data...</div>;

  if (error) return <div>Some error occured...</div>;

  const books = data.allBooks;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
