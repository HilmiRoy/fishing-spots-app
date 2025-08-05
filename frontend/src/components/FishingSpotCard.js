import React, { useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from '../contexts/GoogleMapsProvider'; // Add this import

import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const miniMapStyle = {
  width: '100%',
  height: '200px',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px'
};

const FishingSpotCard = ({ spot }) => {
  const { isLoaded, loadError } = useGoogleMaps();

  // Calculate average rating
  const avgRating = spot.ratings && spot.ratings.length
    ? (spot.ratings.reduce((a, b) => a + b, 0) / spot.ratings.length).toFixed(1)
    : "No ratings yet";

  const [userRating, setUserRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleRatingSubmit = async () => {
    if (!userRating) return;
    setSubmitting(true);
    try {
      const spotRef = doc(db, "fishingSpots", spot.id);
      await updateDoc(spotRef, {
        ratings: arrayUnion(userRating)
      });
      alert('Rating submitted successfully!');
      setUserRating(0);
    } catch (error) {
      alert('Error submitting rating: ' + error.message);
    }
    setSubmitting(false);
  };

  // Add error handling
  if (loadError) {
    return (
      <div className="fishing-spot-card">
        <div className="error-message">
          <p>Error loading map for this spot</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fishing-spot-card">
      <div className="spot-card-map">
        {isLoaded && spot.location && (
          <GoogleMap
            mapContainerStyle={miniMapStyle}
            center={{ lat: spot.location.lat, lng: spot.location.lng }}
            zoom={13}
            options={{
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true,
              zoomControl: true,
              draggable: true,
              scrollwheel: true,
              disableDefaultUI: false
            }}
          >
            <Marker position={spot.location} />
          </GoogleMap>
        )}
      </div>
      <div className="spot-card-info">
        <div className="spot-card-row">
          <span className="spot-card-icon">ℹ️</span>
          <span>Info</span>
        </div>
        <div className="spot-card-row">
          <span className="spot-card-icon">📍</span>
          <span>Navigate</span>
        </div>
        <div className="spot-rating">
          <span>Rating: {avgRating} ⭐</span>
        </div>
        <div className="spot-rating-input">
          <label htmlFor="rating">Your Rating:</label>
          <select
            id="rating"
            value={userRating}
            onChange={e => setUserRating(Number(e.target.value))}
            disabled={submitting}
          >
            <option value={0}>Select</option>
            <option value={1}>1 ⭐</option>
            <option value={2}>2 ⭐⭐</option>
            <option value={3}>3 ⭐⭐⭐</option>
            <option value={4}>4 ⭐⭐⭐⭐</option>
            <option value={5}>5 ⭐⭐⭐⭐⭐</option>
          </select>
          <button onClick={handleRatingSubmit} disabled={submitting || !userRating}>
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
};

export default FishingSpotCard;