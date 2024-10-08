import { useQuery } from "@apollo/client";
import { getAllBooks } from "../graphql/queries";
import { useState } from "react";

const Books = ({ favoriteGenre }) => {
  const [genre, setGenre] = useState("all");
  const { loading, error, data } = useQuery(getAllBooks);

  if (loading) return <div>Loading books data...</div>;

  if (error) return <div>Some error occured...</div>;

  const tableStyle = {
    width: "100%",
    textAlign: "left",
  };

  const books = data.allBooks;

  let genreList;
  let filteredBooks;
  if (favoriteGenre) {
    filteredBooks = books.filter((book) => book.genres.includes(favoriteGenre));
  } else {
    const genreSet = new Set();
    books.forEach((book) => book.genres.forEach((g) => genreSet.add(g)));
    genreList = [...genreSet];
    filteredBooks = genre === "all" ? books : books.filter((book) => book.genres.includes(genre));
  }

  return (
    <div>
      <h2>books</h2>

      {favoriteGenre ? (
        <p>
          Books in your favourite genre - <b>{favoriteGenre}</b>
        </p>
      ) : (
        <p>
          selected genre - <b>{genre}</b>
        </p>
      )}

      <table style={tableStyle}>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!favoriteGenre && (
        <div>
          <button type="button" onClick={() => setGenre("all")} style={genre === "all" ? { borderColor: "blue" } : {}}>
            All
          </button>
          {genreList.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenre(g)}
              style={genre === g ? { borderColor: "blue" } : {}}
            >
              {g}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
