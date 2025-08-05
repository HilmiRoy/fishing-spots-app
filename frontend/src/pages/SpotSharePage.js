import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from '../firebase';
import './SpotSharePage.css';
import { useHistory } from 'react-router-dom';
import { useGoogleMaps } from '../contexts/GoogleMapsProvider';

const containerStyle = {
  width: '100%',
  height: '280px'
};

const defaultCenter = {
  lat: 3.139,
  lng: 101.6869
};

async function getStateFromLatLng(lat, lng) {
  const apiKey = "AIzaSyAgtx6yT4yO1KxGO1qRIDAbi2saRZYjwJ8";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "OK") {
    console.error("Geocoding error:", data.status, data.error_message);
    return "";
  }

  const stateComponent = data.results
    .flatMap(result => result.address_components)
    .find(comp => comp.types.includes('administrative_area_level_1'));

  return stateComponent ? stateComponent.long_name : '';
}

const SpotSharePage = () => {
  // ✅ MOVE ALL HOOKS TO THE TOP - BEFORE ANY CONDITIONAL RETURNS
  const { isLoaded, loadError } = useGoogleMaps();
  const [species, setSpecies] = useState('');
  const [bait, setBait] = useState('');
  const [technique, setTechnique] = useState('');
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [center, setCenter] = useState(defaultCenter);
  const [spotName, setSpotName] = useState('');
  const history = useHistory();

  const onMapClick = useCallback((event) => {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  }, []);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(userLocation);
          setMarker(userLocation);
          setLoading(false);
        },
        () => {
          setLoading(false);
          alert('Unable to get your location. Please click on the map to select a location.');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!spotName.trim()) {
      alert("Please enter a spot name.");
      return;
    }
    if (!auth.currentUser) {
      alert("You must be logged in to share a spot.");
      return;
    }
    if (!marker) {
      alert("Please select a location on the map.");
      return;
    }
    if (!species.trim() || !bait.trim() || !technique.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const state = await getStateFromLatLng(marker.lat, marker.lng);

      await addDoc(collection(db, "fishingSpots"), {
        name: spotName.trim(),
        species: species.trim(),
        bait: bait.trim(),
        technique: technique.trim(),
        location: marker,
        state,
        approved: false,
        createdAt: new Date(),
        createdBy: auth.currentUser?.uid || 'anonymous'
      });
      
      setMessage('🎉 Fishing spot shared successfully! It will be reviewed before being published.');
      
      // Reset form
      setSpecies('');
      setBait('');
      setTechnique('');
      setMarker(null);
      setSpotName('');
      setCenter(defaultCenter);
      
    } catch (error) {
      setMessage('❌ Error sharing spot: ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(userLocation);
        },
        () => {
          setCenter(defaultCenter);
        }
      );
    }
  }, []);

  // ✅ NOW PUT CONDITIONAL RETURNS AFTER ALL HOOKS
  if (loadError) {
    return (
      <div className="share-spot-page">
        <div className="share-container">
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
    <div className="share-spot-page">
      {/* Animated Background */}
      <div className="share-bg-animation">
        <div className="floating-bubble bubble-1"></div>
        <div className="floating-bubble bubble-2"></div>
        <div className="floating-bubble bubble-3"></div>
        <div className="floating-bubble bubble-4"></div>
      </div>

      <div className="share-container">
        {/* Header Section */}
        <div className="share-header">
          <div className="share-icon">🎣</div>
          <h1 className="share-title">Share Your Fishing Spot</h1>
          <p className="share-subtitle">Help fellow anglers discover amazing fishing locations</p>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <div className="map-header">
            <h3 className="map-title">📍 Select Location</h3>
            <button
              onClick={handleGetCurrentLocation}
              className="location-btn"
              disabled={loading}
            >
              <span className="btn-icon">📱</span>
              <span>Use My Location</span>
              {loading && <div className="mini-spinner"></div>}
            </button>
          </div>
          
          <div className="map-container">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle} // ✅ Now using the containerStyle variable
                center={marker || center}
                zoom={13}
                onClick={onMapClick}
                options={{
                  styles: [
                    {
                      "featureType": "water",
                      "elementType": "geometry",
                      "stylers": [{"color": "#a2daf2"}]
                    },
                    {
                      "featureType": "landscape.natural",
                      "elementType": "geometry.fill",
                      "stylers": [{"color": "#f5f5f2"}, {"lightness": 20}]
                    }
                  ],
                  disableDefaultUI: false,
                  zoomControl: true,
                  mapTypeControl: true,
                  mapTypeControlOptions: {
                    style: window.google?.maps?.MapTypeControlStyle?.HORIZONTAL_BAR || 0,
                    position: window.google?.maps?.ControlPosition?.TOP_CENTER || 1,
                    mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
                  },
                  streetViewControl: false,
                  fullscreenControl: true
                }}
              >
                {marker && (
                  <Marker 
                    position={marker}
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
                )}
              </GoogleMap>
            ) : (
              <div className="map-loading">
                <div className="loading-spinner"></div>
                <p>Loading interactive map...</p>
              </div>
            )}
          </div>
          
          <div className="location-display">
            {marker ? (
              <div className="location-selected">
                <span className="location-icon">📍</span>
                <div className="location-info">
                  <span className="location-coords">
                    {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
                  </span>
                  <span className="location-status">✅ Location Selected</span>
                </div>
              </div>
            ) : (
              <div className="location-placeholder">
                <span className="location-icon">🗺️</span>
                <span>Click on the map to select your fishing spot location</span>
              </div>
            )}
          </div>
        </div>

        {/* Form Section */}
        <form className="share-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📍</span>
                <span className="label-text">Spot Name</span>
                <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Malacca Haruan Paradise, Sungai Petani Hot Spot"
                value={spotName}
                onChange={e => setSpotName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🐟</span>
                <span className="label-text">Fish Species</span>
                <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Haruan, Baung, Siakap, Peacock Bass"
                value={species}
                onChange={e => setSpecies(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🎣</span>
                <span className="label-text">Bait/Lure</span>
                <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Soft Frog, Cacing, Tape, Live Bait"
                value={bait}
                onChange={e => setBait(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">⚡</span>
                <span className="label-text">Technique</span>
                <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Casting, Bottom Fishing, Fly Fishing"
                value={technique}
                onChange={e => setTechnique(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !marker}
            >
              <span className="btn-icon">🚀</span>
              <span className="btn-text">
                {loading ? 'Sharing...' : 'Share Fishing Spot'}
              </span>
              {loading && <div className="loading-spinner small"></div>}
            </button>

            <button
              type="button"
              onClick={() => history.push('/home')}
              className="back-btn"
            >
              <span className="btn-icon">←</span>
              <span className="btn-text">Back to Spots</span>
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`message ${message.includes('Error') || message.includes('❌') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SpotSharePage;