import { useEffect } from 'react';

const loadGoogleMapsScript = (callback) => {
  const existingScript = document.getElementById('googleMaps');

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_MAP_MARKER_API_KEY
    }&libraries=&v=weekly`;
    script.id = 'googleMaps';
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  }

  if (existingScript && callback) callback();
};

const MapComponent = ({ lat, lng }) => {
  useEffect(() => {
    const initMap = async () => {
      const { Map } = await window.google.maps.importLibrary('maps');
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
        'marker'
      );

      const map = new Map(document.getElementById('map'), {
        center: { lat: parseFloat(lat), lng: parseFloat(lng) },
        zoom: 14,
        mapId: 'db1fb83f4def9c5b',
      });

      new AdvancedMarkerElement({
        map,
        position: { lat: parseFloat(lat), lng: parseFloat(lng) },
      });
    };

    // Load Google Maps script and initialize the map
    loadGoogleMapsScript(() => {
      if (window.google) {
        initMap();
      }
    });
  }, [lat, lng]);

  return (
    <div
      id='map'
      className=' h-[300px] md:h-[500px] w-full' // Tailwind CSS classes for full height and width
    ></div>
  );
};

export default MapComponent;
