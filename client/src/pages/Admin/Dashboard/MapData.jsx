import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';

const indiaCenter = { lat: 20.5937, lng: 78.9629 };

const MapData = ({ hotels }) => {
  const [selectedHotel, setSelectedHotel] = useState(null);

  // Map container style
  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  // Handling markers for hotels
  const markers =
    hotels &&
    hotels.map((hotel, index) => ({
      position: {
        lat: parseFloat(hotel.latitude),
        lng: parseFloat(hotel.longitude),
      },
      city: hotel.city,
      title: hotel.name,
    }));

  return (
    <LoadScript googleMapsApiKey='AIzaSyBgCs11F6CrpvPPvSgaUf39R6ddeqBBwlo'>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={indiaCenter}
        zoom={4}
      >
        {markers &&
          markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              title={marker.title}
              onClick={() => setSelectedHotel(marker)}
            />
          ))}

        {selectedHotel && (
          <InfoWindow
            position={selectedHotel.position}
            onCloseClick={() => setSelectedHotel(null)}
          >
            <div>
              <h3>{selectedHotel.title}</h3>
              <p>{selectedHotel.city}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapData;
