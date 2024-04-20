import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import './Map.css'; 

import { GOOGLE_API_KEY } from '../../services/config';
import { baseURL } from '../../services/api';

const libraries = ['places'];

export default function Map() {
  const [center, setCenter] = useState(null); // Center initially set to null
  const [zoom, setZoom] = useState(10); // Default zoom level
  const [markersData, setMarkersData] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null); // Selected marker for info window
  const [userLocationMarker, setUserLocationMarker] = useState(null); // Marker for user's location

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries,
  });

  useEffect(() => {
    const fetchMarkersData = async () => {
      try {
        const response = await fetch(`${baseURL}locations/`);
        const data = await response.json();
        setMarkersData(data);
      } catch (error) {
        console.error('Error fetching markers data:', error);
      }
    };

    fetchMarkersData();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
          setZoom(15); // Increase zoom level when getting user location
          setUserLocationMarker({ lat: latitude, lng: longitude }); // Set user's location marker
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(null);
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div className="map-container"> {/* Apply CSS class */}
      {center && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }} 
          zoom={zoom}
          center={center}
        >
          {/* Render markers from markersData */}
          {markersData.map((marker) => (
            <Marker
              key={marker.id}
              position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
              title={marker.name}
              onClick={() => handleMarkerClick(marker)}
            />
          ))}

          {/* Render selectedMarker info window */}
          {selectedMarker && (
            <InfoWindow
              position={{ lat: parseFloat(selectedMarker.lat), lng: parseFloat(selectedMarker.lng) }}
              onCloseClick={handleCloseInfoWindow}
            >
              <div>
                <h3>{selectedMarker.name}</h3>
                <p>Club: {selectedMarker.club}</p>
                <p>Address: {selectedMarker.address}</p>
                <p>City: {selectedMarker.city}</p>
                <p>Country: {selectedMarker.country}</p>
                <p>Zipcode: {selectedMarker.zipcode}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedMarker.lat},${selectedMarker.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Show in Google Maps
                </a>
              </div>
            </InfoWindow>
          )}

          {/* Render user's location marker */}
          {userLocationMarker && (
            <Marker
              position={{ lat: userLocationMarker.lat, lng: userLocationMarker.lng }}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              }}
            />
          )}
        </GoogleMap>
      )}
    </div>
  );
}
