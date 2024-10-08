import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from "@apollo/client";

import App from "./App.jsx";

const link = new HttpLink({
  uri: "http://localhost:4000",
  headers: {
    Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : undefined,
  },
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ApolloProvider client={apolloClient}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ApolloProvider>
  </BrowserRouter>
);
