import { useMutation } from "@apollo/client";
import { useState } from "react";

import { getAllAuthors, getAllBooks } from "../graphql/queries";
import { addBook } from "../graphql/mutations";

const NewBook = () => {
  const [addBookMutation] = useMutation(addBook, {
    refetchQueries: [{ query: getAllBooks }, { query: getAllAuthors }],
    update: (cache, { data: { addBook } }) => {
      const newBook = addBook;
      const newBookGenres = newBook.genres;

      newBookGenres.forEach((genre) => {
        const oldData = cache.readQuery({
          query: getAllBooks,
          variables: { genre },
        });
        const oldAllBooks = oldData?.allBooks;

        if (oldAllBooks) {
          cache.writeQuery({
            query: getAllBooks,
            variables: { genre },
            data: {
              allBooks: [...oldAllBooks, newBook],
            },
          });
        }
      });
    },
  });

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const submit = async (event) => {
    event.preventDefault();

    await addBookMutation({ variables: { title, author, published: +published, genres } });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author
          <input value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          published
          <input type="number" value={published} onChange={({ target }) => setPublished(target.value)} />
        </div>
        <div>
          <input value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
