import { useQuery } from "@apollo/client";

import Books from "./Books";

import { me } from "../graphql/queries";

const Recommended = () => {
  const { data, loading, error } = useQuery(me);

  if (loading) return <div>Loading data...</div>;

  if (error) return <div>An error occured...</div>;

  return <Books favoriteGenre={data.me.favoriteGenre} />;
};

export default Recommended;
