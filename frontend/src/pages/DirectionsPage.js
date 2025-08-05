import React, { useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import { useLocation, useHistory } from 'react-router-dom';
import { useGoogleMaps } from '../contexts/GoogleMapsProvider';
import './DirectionsPage.css';

const DirectionsPage = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const destLat = parseFloat(params.get('lat'));
  const destLng = parseFloat(params.get('lng'));

  const [origin, setOrigin] = useState('');
  const [directions, setDirections] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [routeInfo, setRouteInfo] = useState({ distance: '', duration: '' });
  const [isLoading, setIsLoading] = useState(false);

  const { isLoaded, loadError } = useGoogleMaps();

  const history = useHistory();

  const handleGetDirections = () => {
    if (!origin) return;
    setIsLoading(true);
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination: { lat: destLat, lng: destLng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setIsLoading(false);
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          const leg = result.routes[0]?.legs[0];
          if (leg) {
            setRouteInfo({
              distance: leg.distance.text,
              duration: leg.duration.text
            });
          }
        }
      }
    );
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setOrigin(`${pos.coords.latitude},${pos.coords.longitude}`);
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
          alert('Unable to get your location. Please enter address manually.');
        }
      );
    }
  };

  // Add error handling
  if (loadError) {
    return (
      <div className="directions-page">
        <div className="directions-container">
          <div className="error-message">
            <h2>🗺️ Map Loading Error</h2>
            <p>Sorry, we couldn't load the map. Please refresh the page and try again.</p>
            <button onClick={() => window.location.reload()}>Refresh Page</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="directions-page">
      {/* Animated Background */}
      <div className="directions-bg">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-circle circle-4"></div>
      </div>

      <div className="directions-container">
        {/* Header Section */}
        <div className="directions-header">
          <div className="directions-icon">🧭</div>
          <h1 className="directions-title">Get Directions</h1>
          <p className="directions-subtitle">Navigate to your fishing spot with ease</p>
        </div>

        {/* Controls Section */}
        <div className="directions-controls">
          <div className="input-section">
            <div className="input-wrapper">
              <div className="input-icon">📍</div>
              {isLoaded && (
                <Autocomplete
                  onLoad={ac => setAutocomplete(ac)}
                  onPlaceChanged={() => {
                    if (autocomplete) {
                      setOrigin(autocomplete.getPlace().formatted_address);
                    }
                  }}
                >
                  <input
                    type="text"
                    placeholder="Enter your starting location..."
                    value={origin}
                    onChange={e => setOrigin(e.target.value)}
                    className="modern-input"
                  />
                </Autocomplete>
              )}
            </div>
          </div>

          <div className="button-group">
            <button
              onClick={handleCurrentLocation}
              className="modern-btn location-btn"
              disabled={isLoading}
            >
              <span className="btn-icon">📱</span>
              <span className="btn-text">Use Current Location</span>
              {isLoading && <div className="loading-spinner"></div>}
            </button>

            <button
              onClick={handleGetDirections}
              className="modern-btn primary-btn"
              disabled={!origin || isLoading}
            >
              <span className="btn-icon">🚗</span>
              <span className="btn-text">Show Route</span>
              {isLoading && <div className="loading-spinner"></div>}
            </button>
          </div>
        </div>

        {/* Route Info Section */}
        {routeInfo.distance && routeInfo.duration && (
          <div className="route-info">
            <div className="route-card distance-card">
              <div className="route-icon">📏</div>
              <div className="route-details">
                <span className="route-label">Distance</span>
                <span className="route-value">{routeInfo.distance}</span>
              </div>
            </div>
            <div className="route-card duration-card">
              <div className="route-icon">⏱️</div>
              <div className="route-details">
                <span className="route-label">Duration</span>
                <span className="route-value">{routeInfo.duration}</span>
              </div>
            </div>
          </div>
        )}

        {/* Map Section */}
        <div className="map-section">
          <div className="map-header">
            <h3 className="map-title">🗺️ Your Route</h3>
            <div className="map-coordinates">
              📍 {destLat.toFixed(5)}, {destLng.toFixed(5)}
            </div>
          </div>
          
          <div className="map-container">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat: destLat, lng: destLng }}
                zoom={13}
                options={{
                  styles: [
                    // Custom map styling for a modern look
                    {
                      "featureType": "water",
                      "elementType": "geometry",
                      "stylers": [{"color": "#e9e9e9"}, {"lightness": 17}]
                    },
                    {
                      "featureType": "landscape",
                      "elementType": "geometry",
                      "stylers": [{"color": "#f5f5f5"}, {"lightness": 20}]
                    }
                  ],
                  disableDefaultUI: false,
                  zoomControl: true,
                  streetViewControl: true,
                  fullscreenControl: true
                }}
              >
                <Marker 
                  position={{ lat: destLat, lng: destLng }}
                  icon={{
                    url: 'data:image/svg+xml,' + encodeURIComponent(`
                      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="#2176d2" stroke="white" stroke-width="3"/>
                        <text x="20" y="26" text-anchor="middle" fill="white" font-size="16">🎣</text>
                      </svg>
                    `),
                    scaledSize: new window.google.maps.Size(40, 40)
                  }}
                />
                {directions && (
                  <DirectionsRenderer 
                    directions={directions}
                    options={{
                      polylineOptions: {
                        strokeColor: '#2176d2',
                        strokeWeight: 6,
                        strokeOpacity: 0.8
                      }
                    }}
                  />
                )}
              </GoogleMap>
            ) : (
              <div className="map-loading">
                <div className="loading-spinner large"></div>
                <p>Loading interactive map...</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          {directions && (
            <button
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${destLat},${destLng}`, '_blank')}
              className="modern-btn open-maps-btn"
            >
              <span className="btn-icon">🌐</span>
              <span className="btn-text">Open in Google Maps</span>
            </button>
          )}
          
          <button
            onClick={() => history.push('/home')}
            className="modern-btn back-btn"
          >
            <span className="btn-icon">←</span>
            <span className="btn-text">Back to Spots</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectionsPage;