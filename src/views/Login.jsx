import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { login } from "../graphql/mutations";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [loginMutation, { data }] = useMutation(login);

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation({ variables: { username, password } });
    setUsername("");
    setPassword("");
  };

  useEffect(() => {
    if (data?.login?.value) {
      localStorage.setItem("token", data.login.value);
      setToken(data.login.value);
      navigate("/");
    }
  }, [data?.login?.value]);

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="login_username">username </label>
        <input id="login_username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <br />

        <label htmlFor="login_password">password </label>
        <input id="login_password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />

        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
