import React, { useState } from "react";

export function useGeolocation(defaultPostion = null) {
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);
  const [geolocationPosition, setgeolocationPosition] =
    useState(defaultPostion);
  const [error, setError] = useState(null);
  /*
- navigator.geolocation -> built in tools . is a object includes built in function and 
                         make the browser  get the user's location and return location lat,lng

- navigator.geolocation.getCurrentPosition -> is built in function from web api , return your current location
-  (pos) -> current position if browser can location your location. return object 
            includes coords is also object
*/
  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");
    setIsLoadingPosition(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setgeolocationPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoadingPosition(false);
      },
      (error) => {
        setError(error.message);
        setIsLoadingPosition(false);
      }
    );
  }

  return { isLoadingPosition, geolocationPosition, error, getPosition };
}
