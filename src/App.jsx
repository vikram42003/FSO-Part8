import { Routes, Route, NavLink, Navigate } from "react-router-dom";

import Authors from "./views/Authors";
import Books from "./views/Books";
import NewBook from "./views/NewBook";

const App = () => {
  const navStyle = {
    display: "flex",
    backgroundColor: "lightGray",
    margin: "1rem 0 3rem",
  };
  const navLinkStyle = {
    padding: "0.75rem 0.5rem",
  };

  return (
    <div>
      <nav style={navStyle}>
        <NavLink style={navLinkStyle} to={"/authors"}>
          authors
        </NavLink>
        <NavLink style={navLinkStyle} to={"/books"}>
          books
        </NavLink>
        <NavLink style={navLinkStyle} to={"/add"}>
          add
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/authors" />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<NewBook />} />
      </Routes>
    </div>
  );
};

export default App;
