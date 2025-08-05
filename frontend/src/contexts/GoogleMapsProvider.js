import React, { createContext, useContext } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

// Create context
const GoogleMapsContext = createContext();

// Custom hook to use the context
export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};

// Provider component
export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAgtx6yT4yO1KxGO1qRIDAbi2saRZYjwJ8",
    libraries: ['places', 'geometry'] // Include ALL libraries you need
  });

  if (loadError) {
    console.error('Google Maps failed to load:', loadError);
  }

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};