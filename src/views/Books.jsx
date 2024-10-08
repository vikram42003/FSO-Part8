import { useState } from "react";

import BookTable from "../components/BookTable";
import GenreSelector from "../components/GenreSelector";

const Books = () => {
  const [genre, setGenre] = useState(null);

  return (
    <div>
      <h2>books</h2>
      <p>
        selected genre - <b>{genre || "all"}</b>
      </p>
      <BookTable genre={genre} />
      <GenreSelector genre={genre} setGenre={setGenre} />
    </div>
  );
};

export default Books;
