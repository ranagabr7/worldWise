import React from "react";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";
import { useCities } from "../../Contexts/CitiesContext";
// handle formate data
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));
const CityItem = ({ city }) => {
  const { currentCity, deleteCity } = useCities();
  const { emoji, cityName, date, id, position } = city;
  function handleCilick(e) {
    e.preventDefault();
    deleteCity(id);
  }
  return (
    <li>
      {/* second step: use pramas with react-router */}
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={handleCilick}>
          &times;
        </button>
      </Link>
    </li>
  );
};

export default CityItem;
