import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from '../contexts/GoogleMapsProvider';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 3.139, // Kuala Lumpur
  lng: 101.6869
};

function getDistance(lat1, lng1, lat2, lng2) {
  // Haversine formula
  const toRad = x => x * Math.PI / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const MapView = () => {
  const [spots, setSpots] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const { isLoaded, loadError } = useGoogleMaps();

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => setUserLocation(defaultCenter) // fallback
      );
    } else {
      setUserLocation(defaultCenter);
    }
  }, []);

  useEffect(() => {
    const fetchSpots = async () => {
      const querySnapshot = await getDocs(collection(db, "fishingSpots"));
      const spotsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSpots(spotsData.filter(spot => spot.approved));
    };
    fetchSpots();
  }, []);

  // Filter spots within 20km (you can adjust this)
  const nearbySpots = userLocation
    ? spots.filter(spot =>
        getDistance(
          userLocation.lat,
          userLocation.lng,
          spot.location.lat,
          spot.location.lng
        ) <= 20
      )
    : spots;

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded || !userLocation) return <div>Loading Map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={userLocation} zoom={12}>
      {/* User marker */}
      <Marker position={userLocation} label="You" />
      {/* Nearby fishing spots */}
      {nearbySpots.map(spot => (
        <Marker
          key={spot.id}
          position={{ lat: spot.location.lat, lng: spot.location.lng }}
          title={spot.title || spot.name}
        />
      ))}
    </GoogleMap>
  );
};

export default MapView;