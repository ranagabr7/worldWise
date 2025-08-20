import React from "react";
import styles from "./User.module.css";
import Button from "../Button/Button";
import { useAuth } from "../../Contexts/FakeAuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  function handleClick() {
    logout();
    navigate("/");
  }

  return (
    <div className={styles.user}>
      <img src={user.avatar} alt={user.name} />
      <span>Welcome, {user.name}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default User;
