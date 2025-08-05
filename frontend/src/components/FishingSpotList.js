import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, updateDoc, doc, arrayUnion, getDoc } from "firebase/firestore"; // Added back rating imports
import './FishingSpotList.css';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useHistory } from 'react-router-dom';
import FilterBar from './FilterBar';
import { useGoogleMaps } from '../contexts/GoogleMapsProvider'; // Add this

const WEATHER_API_KEY = "42cd1a5dbfa2441fbb155740250408";

const FishingSpotList = () => {
  const history = useHistory();
  const [spots, setSpots] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSpot, setSelectedSpot] = useState(null);
  
  // RESTORED: Rating state variables
  const [hasRated, setHasRated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(0);
  
  const [weather, setWeather] = useState(null);
  const [filters, setFilters] = useState({});
  const [filteredCount, setFilteredCount] = useState(0);

  // Enhanced filtering function WITH rating restored
  const getFilteredSpots = useCallback(() => {
    return spots.filter(spot => {
      // Search filter
      const matchesSearch = search === '' || 
        spot.name?.toLowerCase().includes(search.toLowerCase()) ||        // Add this line
        spot.title?.toLowerCase().includes(search.toLowerCase()) ||
        spot.species?.toLowerCase().includes(search.toLowerCase()) ||
        spot.bait?.toLowerCase().includes(search.toLowerCase()) ||
        spot.technique?.toLowerCase().includes(search.toLowerCase()) ||
        spot.state?.toLowerCase().includes(search.toLowerCase());

      // Species filter
      const matchesSpecies = !filters.species || 
        spot.species?.toLowerCase().includes(filters.species.toLowerCase());

      // Technique filter
      const matchesTechnique = !filters.technique || 
        spot.technique?.toLowerCase().includes(filters.technique.toLowerCase());

      // Bait filter
      const matchesBait = !filters.bait || 
        spot.bait?.toLowerCase().includes(filters.bait.toLowerCase());

      // State filter
      const matchesState = !filters.state || 
        spot.state?.toLowerCase().includes(filters.state.toLowerCase());

      // RESTORED: Rating filter
      const avgRating = spot.ratings?.length ? 
        spot.ratings.reduce((a, b) => a + b, 0) / spot.ratings.length : 0;
      const matchesRating = avgRating >= (filters.minRating || 0);

      return matchesSearch && matchesSpecies && matchesTechnique && 
             matchesBait && matchesState && matchesRating; // Added back rating filter
    });
  }, [spots, search, filters]);

  useEffect(() => {
    const fetchSpots = async () => {
      const q = query(
        collection(db, "fishingSpots"),
        where("approved", "==", true)
      );
      const querySnapshot = await getDocs(q);
      const spotsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSpots(spotsData);
      setFilteredCount(spotsData.length);
    };
    fetchSpots();
  }, []);

  useEffect(() => {
    if (selectedSpot && selectedSpot.location) {
      const fetchWeather = async () => {
        const { lat, lng } = selectedSpot.location;
        const res = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lng}`
        );
        const data = await res.json();
        setWeather(data);
      };
      fetchWeather();
    }
  }, [selectedSpot]);

  useEffect(() => {
    // RESTORED: Reset rating state when spot changes
    setHasRated(false);
    setUserRating(0);
    setWeather(null);
  }, [selectedSpot]);

  // Update filtered count when filters change
  useEffect(() => {
    const filtered = getFilteredSpots();
    setFilteredCount(filtered.length);
  }, [getFilteredSpots]);

  // RESTORED: Calculate average rating for selectedSpot
  const avgRating = selectedSpot?.ratings && selectedSpot.ratings.length
    ? (selectedSpot.ratings.reduce((a, b) => a + b, 0) / selectedSpot.ratings.length).toFixed(1)
    : "No ratings yet";

  // RESTORED: Rating submission function
  const handleRatingSubmit = async () => {
    if (!userRating || hasRated) return;
    setSubmitting(true);
    try {
      await updateDoc(doc(db, "fishingSpots", selectedSpot.id), {
        ratings: arrayUnion(userRating)
      });
      setHasRated(true);
      setUserRating(0);
      
      await fetchSelectedSpot(selectedSpot.id);
      
      setSpots(prevSpots => 
        prevSpots.map(spot => 
          spot.id === selectedSpot.id 
            ? { ...spot, ratings: [...(spot.ratings || []), userRating] }
            : spot
        )
      );
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
    setSubmitting(false);
  };

  // RESTORED: Fetch selected spot function
  const fetchSelectedSpot = async (spotId) => {
    const spotRef = doc(db, "fishingSpots", spotId);
    const spotSnap = await getDoc(spotRef);
    if (spotSnap.exists()) {
      setSelectedSpot({ id: spotId, ...spotSnap.data() });
    }
  };

  const filteredSpots = getFilteredSpots();

  return (
    <div className="fishing-spot-list">
      <h2 style={{ fontSize: '2.4em', color: '#fff', fontWeight: 800, letterSpacing: '1px', textShadow: '0 2px 12px #2176d244', marginBottom: '1.2em' }}>
        Browse Your Dream Fishing Spots
      </h2>
      
      <input
        type="text"
        className="fishing-spot-search"
        placeholder="🔍 Search by location, species, technique, bait..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ margin: '0 auto 32px auto', display: 'block', width: '440px', maxWidth: '90vw', padding: '14px 24px', borderRadius: '22px', border: '2px solid #2176d2', fontSize: '1.18em', boxShadow: '0 4px 18px #2176d233', background: '#f7fbff', color: '#174a8c', outline: 'none', transition: 'border 0.2s, box-shadow 0.2s' }}
      />

      <FilterBar onFilter={setFilters} spots={spots} />

      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        padding: '12px 24px',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '20px',
        display: 'block',
        margin: '0 auto 40px auto',
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#1f2937',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: 'fit-content'
      }}>
        {filteredCount === spots.length 
          ? `🎣 Showing all ${spots.length} fishing spots`
          : `🔍 Found ${filteredCount} of ${spots.length} fishing spots`
        }
      </div>

      <div className="share-spot-btn-wrap">
        <button className="share-spot-btn" onClick={() => history.push('/share')}>
          <span role="img" aria-label="share">➕</span> Share Spot
        </button>
      </div>

      <div className="fishing-spot-grid">
        {filteredSpots.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            color: '#6b7280',
            fontSize: '1.2rem'
          }}>
            <span style={{ fontSize: '3rem', marginBottom: '16px', display: 'block' }}>🎣</span>
            No fishing spots match your criteria.<br />
            Try adjusting your filters or search terms.
          </div>
        ) : (
          filteredSpots.map(spot => {
            // RESTORED: Calculate rating for each spot
            const avgRating = spot.ratings && spot.ratings.length
              ? (spot.ratings.reduce((a, b) => a + b, 0) / spot.ratings.length).toFixed(1)
              : "No ratings yet";

            return (
              <div
                key={spot.id}
                className="fishing-spot-card"
                onClick={() => setSelectedSpot(spot)}
                style={{ cursor: 'pointer' }}
              >
                {spot.location && (
                  <div className="fishing-spot-map">
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
                      center={{ lat: spot.location.lat, lng: spot.location.lng }}
                      zoom={13}
                      options={{
                        disableDefaultUI: false,
                        draggable: true,
                        zoomControl: true,
                        scrollwheel: true
                      }}
                    >
                      <Marker position={{ lat: spot.location.lat, lng: spot.location.lng }} />
                    </GoogleMap>
                  </div>
                )}
                <div className="fishing-spot-info">
                  <div className="fishing-spot-title">
                    <span role="img" aria-label="location">📍</span>
                    <strong>
                      {spot.name || spot.title || spot.locationName || `${spot.location?.lat.toFixed(5)}, ${spot.location?.lng.toFixed(5)}`}
                    </strong>
                  </div>
                  <div className="fishing-spot-details">
                    <div><strong>Species:</strong> {spot.species || 'N/A'}</div>
                    <div><strong>Bait:</strong> {spot.bait || 'N/A'}</div>
                    <div><strong>Technique:</strong> {spot.technique || 'N/A'}</div>
                    <div style={{fontSize: '0.95em', color: '#888', marginTop: '6px'}}>
                      <span>Lat: {spot.location?.lat.toFixed(5)}, Lng: {spot.location?.lng.toFixed(5)}</span>
                    </div>
                  </div>
                  <div className="fishing-spot-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        history.push(`/directions?lat=${spot.location.lat}&lng=${spot.location.lng}`);
                      }}
                    >
                      Navigate
                    </button>
                  </div>
                  {/* RESTORED: Rating display in card */}
                  <div className="spot-rating">
                    <span>Rating: {avgRating} ⭐</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedSpot && (
        <div className="spot-modal-overlay" onClick={() => setSelectedSpot(null)}>
          <div className="spot-modal-card" onClick={e => e.stopPropagation()}>
            <button className="spot-modal-close" onClick={() => setSelectedSpot(null)}>
              ✕
            </button>
            <div className="modal-content">
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', paddingBottom: '12px' }}>
                <button className="spot-modal-close" onClick={() => setSelectedSpot(null)}>
                  ✕
                </button>
              </div>
              <div className="fishing-spot-map" style={{ height: 300 }}>
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '16px' }}
                  center={{ lat: selectedSpot.location.lat, lng: selectedSpot.location.lng }}
                  zoom={15}
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
                  <Marker position={{ lat: selectedSpot.location.lat, lng: selectedSpot.location.lng }} />
                </GoogleMap>
              </div>
              <div className="fishing-spot-info" style={{ fontSize: '1.15em' }}>
                <div className="fishing-spot-title">
                  <span role="img" aria-label="location">📍</span>
                  <strong>
                    {selectedSpot.name || selectedSpot.title || selectedSpot.locationName || `${selectedSpot.location?.lat.toFixed(5)}, ${selectedSpot.location?.lng.toFixed(5)}`}
                  </strong>
                </div>
                <div className="fishing-spot-details">
                  <div><strong>Species:</strong> {selectedSpot.species || 'N/A'}</div>
                  <div><strong>Bait:</strong> {selectedSpot.bait || 'N/A'}</div>
                  <div><strong>Technique:</strong> {selectedSpot.technique || 'N/A'}</div>
                  <div style={{fontSize: '0.95em', color: '#888', marginTop: '6px'}}>
                    <span>Lat: {selectedSpot.location?.lat.toFixed(5)}, Lng: {selectedSpot.location?.lng.toFixed(5)}</span>
                  </div>
                </div>
                {weather && weather.current && (
                  <div className="spot-weather">
                    <img src={weather.current.condition.icon} alt={weather.current.condition.text} />
                    <span><strong>Temp:</strong> {weather.current.temp_c}°C</span>
                    <span><strong>Weather:</strong> {weather.current.condition.text}</span>
                    <span><strong>Wind:</strong> {weather.current.wind_kph} kph</span>
                  </div>
                )}
                <div className="fishing-spot-actions">
                  <button
                    onClick={() =>
                      history.push(`/directions?lat=${selectedSpot.location.lat}&lng=${selectedSpot.location.lng}`)
                    }
                  >
                    Navigate
                  </button>
                </div>
                
                {/* RESTORED: Rating display and input in modal */}
                <div className="spot-rating modern-rating">
                  <span className="modern-rating-label">Rating: {avgRating}</span>
                  <span className="modern-rating-star">★</span>
                </div>
                <div className="user-rating modern-rating-input">
                  <label htmlFor="modal-rating" className="modern-rating-input-label">
                    Your Rating:
                  </label>
                  <select
                    id="modal-rating"
                    value={userRating}
                    onChange={e => setUserRating(Number(e.target.value))}
                    disabled={submitting}
                    className="modern-rating-select"
                  >
                    <option value={0}>Select</option>
                    <option value={1}>1 ★</option>
                    <option value={2}>2 ★★</option>
                    <option value={3}>3 ★★★</option>
                    <option value={4}>4 ★★★★</option>
                    <option value={5}>5 ★★★★★</option>
                  </select>
                  <button
                    onClick={handleRatingSubmit}
                    disabled={submitting || !userRating || hasRated}
                    className="modern-rating-btn"
                  >
                    {hasRated ? 'Rated' : submitting ? 'Submitting...' : 'Submit Rating'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FishingSpotList;