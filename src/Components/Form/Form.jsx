// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=20&longitude=0
import React, { useEffect } from "react";
import { useState } from "react";
import styles from "./Form.module.css";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import BackButton from "../BackButton/BackButton";
import { useUrlPosition } from "../../Hooks/useUrlPosition";
import Message from "../Message/Message";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../../Contexts/CitiesContext";
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [lat, lng] = useUrlPosition();
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  const [geoCodingError, setgeoCodingError] = useState("");
  const [isLoadingGeolocationCode, setisLoadingGeolocationCode] =
    useState(false);
  const { createCity, isLoading } = useCities();
  useEffect(() => {
    if (!lat && !lng) return;
    async function fetchedCityData() {
      try {
        setgeoCodingError("");
        setisLoadingGeolocationCode(true);
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        console.log(data);
        if (!data.countryCode)
          throw new Error("that does not seem city. click somewhere else");
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        // setCityName(data);
      } catch (error) {
        setgeoCodingError(error.message);
      } finally {
        setisLoadingGeolocationCode(false);
      }
    }
    fetchedCityData();
  }, [lat, lng]);
 async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      date,
      notes,
      position: { lat, lng },
    };
    console.log(newCity);
    // why ->
   await createCity(newCity);
    navigate("/app/cities")
  }
  if (!lat && !lng)
    return <Message message="start by clicking somewhere on the map" />;
  if (geoCodingError) return <Message message={geoCodingError} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {/* <span className={styles.flag}>{emoji}</span> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/YYYY"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
