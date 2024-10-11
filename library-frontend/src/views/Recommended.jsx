import { useQuery } from "@apollo/client";

import { me } from "../graphql/queries";

import BookTable from "../components/BookTable";

const Recommended = () => {
  const { data, loading, error } = useQuery(me);

  if (loading) return <div>Loading data...</div>;

  if (error) return <div>An error occured...</div>;

  return (
    <div>
      <p>
        Books in your favourite genre - <b>{data.me.favoriteGenre}</b>
      </p>
      <BookTable genre={data.me.favoriteGenre} />
    </div>
  );
};

export default Recommended;
