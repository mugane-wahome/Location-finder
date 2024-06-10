import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const API_KEY = "pk.eyJ1IjoibXVnYW5lIiwiYSI6ImNseDk4OHN0YzFxN2UyaXNjaDlhYXdwNnUifQ.qfGBlrJj2he8bA-53dJz_g";

const Fly = ({ setLat, setLon }) => {
  const [city, setCity] = useState("Kolkata");
  const geocoderContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize the map
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-100, 40],
      zoom: 3.5,
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Initialize the geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: API_KEY,
      mapboxgl: mapboxgl,
      placeholder: "Search for places",
      proximity: {
        longitude: -100,
        latitude: 40,
      },
    });

    // Add geocoder to the map
    geocoder.on("result", (e) => {
      const coords = e.result.geometry.coordinates;
      setLon(coords[0]);
      setLat(coords[1]);
    });

    geocoderContainerRef.current.appendChild(geocoder.onAdd(map));

    return () => map.remove();
  }, [setLat, setLon]);

  return (
    <div>
      <div ref={geocoderContainerRef} style={{ marginBottom: "10px" }}></div>
      <div className="fly">
        <h2>Enter a city name</h2>
        <div className="inp-box">
          <input
            type="text"
            onChange={(e) => {
              setCity(e.target.value);
            }}
          />
          <button
            onClick={() => {
              const geocoder = new MapboxGeocoder({
                accessToken: API_KEY,
                mapboxgl: mapboxgl,
              });
              geocoder.query(city, (err, res) => {
                if (res && res.features && res.features.length > 0) {
                  const coords = res.features[0].geometry.coordinates;
                  setLon(coords[0]);
                  setLat(coords[1]);
                }
              });
            }}
          >
            Go
          </button>
        </div>
      </div>
      <div ref={mapRef} style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default Fly;
