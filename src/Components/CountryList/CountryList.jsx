import React from "react";
import Message from "../Message/Message";
import Spinner from "../Spinner/Spinner";
import styles from "./CountryList.module.css";
import CountryItem from "../CountryItem/CountryItem";
import { useCities } from "../../Contexts/CitiesContext";
const CountryList = () => {
  const { isLoading, cities } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities?.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );
  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries?.map((countryItem, idx) => (
        <CountryItem countryItem={countryItem} key={idx} />
      ))}
    </ul>
  );
};
export default CountryList;
