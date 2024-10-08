import { useQuery } from "@apollo/client";
import { getGenres } from "../graphql/queries";

const GenreSelector = ({ genre, setGenre }) => {
  const { data, loading, error } = useQuery(getGenres);

  if (loading) return <div>loading genres</div>;
  if (error) return <div>An error occured...</div>;

  const genreSet = new Set();
  data.allBooks.forEach((book) => book.genres.forEach((g) => genreSet.add(g)));
  const genreList = [...genreSet];

  return (
    <div>
      <div>
        <button type="button" onClick={() => setGenre(null)} style={!genre ? { borderColor: "blue" } : {}}>
          All
        </button>
        {genreList.map((g) => (
          <button key={g} type="button" onClick={() => setGenre(g)} style={genre === g ? { borderColor: "blue" } : {}}>
            {g}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreSelector;
