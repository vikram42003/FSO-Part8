import { useMutation } from "@apollo/client";
import { setBirthYear } from "../graphql/mutations";
import { getAllAuthors } from "../graphql/queries";

const BirthYearForm = ({ authorNames }) => {
  const [setBirthYearMutation] = useMutation(setBirthYear, {
    refetchQueries: [{ query: getAllAuthors }],
  });

  const handleSetBirthYear = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const name = formData.get("selectedAuthor");
    const year = formData.get("year");

    await setBirthYearMutation({ variables: { name, setBornTo: +year } });
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={handleSetBirthYear}>
        <select name="selectedAuthor">
          {authorNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="birthyearform_year">
          born
          <input type="number" name="year" id="birthyearform_year" />
        </label>
        <br />

        <button type="submit">update birthyear</button>
      </form>
    </div>
  );
};

export default BirthYearForm;
