import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
const BASE_URL = "http://localhost:8000";
const CitiesContext = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    // donot understand
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload, // this line for border active
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return {
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error("unknown error");
  }
}
const CitiesContextProvider = ({ children }) => {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(() => {
    async function fetchedCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
        // setCities(data);
        // setisLoading(false);
        // console.log(data);
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities...",
        });
      }
    }
    fetchedCities();
  }, []);
  /*
  why use usecallback : 
  */
  const getCity = useCallback(
    async function getCity(id) {
      // if (!id) return;
      // why compare id ->
      // id from url is always string must convert to number
      if (Number(id) === currentCity.id) return;
      // why dispatch before try not after
      dispatch({ type: "loading" });
      try {
        // setisLoading(true);
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
        // console.log(data);
        // setcurrentCity(data);
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading city...",
        });
      }
    },
    [currentCity?.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      // setisLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "post",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
      console.log(data);
      // setCities((cities) => [...cities, data]);
      // setcurrentCity(data);
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error create city...",
      });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      // setisLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
      // setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting city...",
      });
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};
export function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("citiesContext outside citiesContextProvider");
  return context;
}
export default CitiesContextProvider;
