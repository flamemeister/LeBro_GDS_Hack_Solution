import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

import { GOOGLE_API_KEY } from '../../services/config';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

export default function Map() {
  const [center, setCenter] = useState({ lat: 7.2905715, lng: 80.6337262 }); // Default center
  const [zoom, setZoom] = useState(10); // Default zoom level

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
          setZoom(15); // Increase zoom level when getting user location
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={zoom} // Use the zoom state variable
        center={center}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};
