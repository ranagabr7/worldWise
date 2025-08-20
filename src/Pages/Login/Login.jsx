import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../../Components/PageNav/PageNav";
import { useAuth } from "../../Contexts/FakeAuthContext";
import Button from "../../Components/Button/Button";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  const { login, isAuthenticated, logout, user } = useAuth();
  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) login(email, password);
    console.log("log");
  }

  useEffect(() => {
    /* when we use navigate in react-router-dom ->can manage the history in our browser
     meaning : replace: true ->
    */
    if (isAuthenticated) navigate("/app", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">login</Button>
        </div>
      </form>
    </main>
  );
};

export default Login;
