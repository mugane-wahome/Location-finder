import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import Fly from "./Components/Fly";
import { ImLocation } from "react-icons/im";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const API_KEY = "pk.eyJ1IjoibXVnYW5lIiwiYSI6ImNseDk4OHN0YzFxN2UyaXNjaDlhYXdwNnUifQ.qfGBlrJj2he8bA-53dJz_g";

// Set the API token
mapboxgl.accessToken = API_KEY;

function App() {
  const [lat, setLat] = useState(22.5726);
  const [lon, setLon] = useState(88.3639);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize the map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lon, lat],
      zoom: 12,
    });

    mapRef.current = map;

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Initialize the geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: API_KEY,
      mapboxgl: mapboxgl,
    });

    geocoder.on("result", (e) => {
      const coords = e.result.geometry.coordinates;
      setLon(coords[0]);
      setLat(coords[1]);
    });

    map.addControl(geocoder);

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lon, lat],
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      });
    }
  }, [lat, lon]);

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
      {mapRef.current && (
        <div>
          <Fly setLat={setLat} setLon={setLon} />
          <div
            style={{
              position: "absolute",
              left: `${mapRef.current.project([lon, lat]).x - 15}px`,
              top: `${mapRef.current.project([lon, lat]).y - 30}px`,
            }}
          >
            <ImLocation size="30px" color="red" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
