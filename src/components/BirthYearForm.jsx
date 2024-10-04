import { useMutation } from "@apollo/client";
import { useState } from "react";
import { setBirthYear } from "../graphql/mutations";
import { getAllAuthors } from "../graphql/queries";

const BirthYearForm = () => {
  const [setBirthYearMutation] = useMutation(setBirthYear, {
    refetchQueries: [{ query: getAllAuthors }],
  });

  const [name, setName] = useState("");
  const [year, setYear] = useState("");

  const handleSetBirthYear = async (e) => {
    e.preventDefault();

    await setBirthYearMutation({ variables: { name, setBornTo: +year } });

    setName("");
    setYear("");
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={handleSetBirthYear}>
        <label htmlFor="birthyearform_name">
          name
          <input type="text" id="birthyearform_name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label htmlFor="birthyearform_year">
          born
          <input type="text" id="birthyearform_year" value={year} onChange={(e) => setYear(e.target.value)} />
        </label>
        <br />
        <button type="submit">update birthyear</button>
      </form>
    </div>
  );
};

export default BirthYearForm;
