import React, { useEffect, useState } from "react";
import styles from "./Map.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useCities } from "../../Contexts/CitiesContext";
import { useGeolocation } from "../../Hooks/useGeolocation";
import Button from "../Button/Button";
import { useUrlPosition } from "../../Hooks/useUrlPosition";

const Map = () => {
  const { cities } = useCities();
  const [lat, lng] = useUrlPosition();
  const [mapPosition, setmapPosition] = useState([40, 0]);
  const { getPosition, isLoadingPosition, geolocationPosition } =
    useGeolocation();
  useEffect(() => {
    if (lat && lng) setmapPosition([lat, lng]);
  }, [lat, lng]);
  useEffect(() => {
    if (geolocationPosition)
      return setmapPosition([geolocationPosition.lat, geolocationPosition.lng]);
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "loading..." : "use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities?.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
};
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}
function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
  // useMapEvents({
  //   click: (e) => {
  //     // console.log(e.latlng);
  //     navigate(`form?lat=${e.latlng.lat}lng=${e.latlng.lng}`);
  //   },
  // });
}
export default Map;
