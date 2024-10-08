import { useQuery } from "@apollo/client";

import { getAllAuthors } from "../graphql/queries";
import BirthYearForm from "../components/BirthYearForm";

const Authors = ({ token }) => {
  const { loading, error, data } = useQuery(getAllAuthors);

  if (loading) return <div>Loading author data...</div>;

  if (error) return <div>Some error occured...</div>;

  const authors = data.allAuthors;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {token && <BirthYearForm authorNames={authors.map((a) => a.name)} />}
    </div>
  );
};

export default Authors;
