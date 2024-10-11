import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";

import Authors from "./views/Authors";
import Books from "./views/Books";
import NewBook from "./views/NewBook";
import Login from "./views/Login";
import Recommended from "./views/Recommended";

const App = () => {
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    // ADD ERROR HANDLING FOR WHEN LOGGING IN FAILS
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const navStyle = {
    display: "flex",
    backgroundColor: "lightGray",
    margin: "1rem 0 3rem",
  };
  const navLinkStyle = {
    padding: "0.75rem 0.5rem",
  };

  const navButtonStyle = {
    backgroundColor: "transparent",
    border: "none",
    textDecoration: "underline",
    color: "darkBlue",
    cursor: "pointer",
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
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
        {token && (
          <NavLink style={navLinkStyle} to={"/addBook"}>
            add book
          </NavLink>
        )}
        {token && (
          <NavLink style={navLinkStyle} to={"/recommended"}>
            recommended
          </NavLink>
        )}
        {!token && (
          <NavLink style={navLinkStyle} to={"/login"}>
            login
          </NavLink>
        )}
        {token && (
          <button onClick={handleLogout} style={navButtonStyle} type="button">
            log out
          </button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/authors" />} />
        <Route path="/authors" element={<Authors token={token} />} />
        <Route path="/books" element={<Books />} />
        <Route path="/addBook" element={<NewBook />} />
        <Route path="/recommended" element={<Recommended />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
      </Routes>
    </div>
  );
};

export default App;
