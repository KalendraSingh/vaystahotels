import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

export default function HotelMap({ sendData, mapData }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAP_MARKER_API_KEY,
    libraries,
  });

  const [selected, setSelected] = useState(null);
  const [locationInfo, setLocationInfo] = useState({
    city: '',
    state: '',
    country: '',
    latitude: '',
    longitude: '',
    location: '',
  });

  // Ensure sendData isn't conditionally wrapped, and it's passed only after locationInfo is set
  useEffect(() => {
    sendData(locationInfo);
  }, [locationInfo, sendData]);

  const handleDragEnd = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelected({ lat, lng });

    try {
      const results = await getGeocode({ location: { lat, lng } });
      const address = results[0].formatted_address;
      const addressComponents = results[0].address_components;
      const city =
        addressComponents.find((component) =>
          component.types.includes('locality')
        )?.long_name || '';
      const state =
        addressComponents.find((component) =>
          component.types.includes('administrative_area_level_1')
        )?.long_name || '';
      const country =
        addressComponents.find((component) =>
          component.types.includes('country')
        )?.long_name || '';

      setLocationInfo({
        city,
        state,
        country,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
        location: address,
      });
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  };

  if (loadError) return <div className='text-red-500'>Error loading maps</div>;
  if (!isLoaded) return <div className='text-blue-500'>Loading Maps...</div>;

  return (
    <div className='p-4'>
      <Search
        setSelected={setSelected}
        setLocationInfo={setLocationInfo}
        mapData={mapData}
      />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={selected ? 10 : 2}
        center={selected || { lat: 0, lng: 0 }}
        options={options}
      >
        {selected && (
          <Marker
            draggable={true}
            position={selected}
            onDragEnd={handleDragEnd} // Drag event
          />
        )}
      </GoogleMap>
    </div>
  );
}

function Search({ setSelected, setLocationInfo, mapData }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  useEffect(() => {
    // Set initial input value to mapData.location if it exists
    if (mapData && mapData.location) {
      setValue(mapData.location);
    }
  }, [mapData, setValue]);

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setSelected({ lat, lng });

      const addressComponents = results[0].address_components;
      const city =
        addressComponents.find((component) =>
          component.types.includes('locality')
        )?.long_name || '';
      const state =
        addressComponents.find((component) =>
          component.types.includes('administrative_area_level_1')
        )?.long_name || '';
      const country =
        addressComponents.find((component) =>
          component.types.includes('country')
        )?.long_name || '';

      setLocationInfo({
        city,
        state,
        country,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
        location: address,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='mb-4'>
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder='Search an address'
        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
      />
      {status === 'OK' && (
        <ul className='mt-2 border border-gray-300 rounded-lg max-h-48 overflow-auto bg-white'>
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              className='p-2 hover:bg-gray-100 cursor-pointer'
              onClick={() => handleSelect(description)}
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
