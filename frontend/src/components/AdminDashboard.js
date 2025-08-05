import React, { useEffect, useState } from 'react';
import { getPendingSpots, approveSpot, rejectSpot, getApprovedSpots, deleteSpot } from '../firebase';
import { signOut } from "firebase/auth";
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from '../contexts/GoogleMapsProvider';
import './AdminDashboard.css';
import { auth } from '../firebase';
import { useHistory } from 'react-router-dom';

const mapContainerStyle = {
  width: '100%',
  height: '200px',
  borderRadius: '12px'
};

const AdminDashboard = () => {
  const { isLoaded, loadError } = useGoogleMaps();
  const [spots, setSpots] = useState([]);
  const [approvedSpots, setApprovedSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const history = useHistory();

  useEffect(() => {
    const fetchSpots = async () => {
      setLoading(true);
      try {
        const fetchedSpots = await getPendingSpots();
        setSpots(fetchedSpots);
        const fetchedApproved = await getApprovedSpots();
        setApprovedSpots(fetchedApproved);
      } catch (error) {
        console.error('Error fetching spots:', error);
      }
      setLoading(false);
    };
    fetchSpots();
  }, []);

  if (loadError) {
    return (
      <div className="admin-dashboard">
        <div className="error-container">
          <div className="error-icon">🗺️</div>
          <h2>Map Loading Error</h2>
          <p>Sorry, we couldn't load the map. Please refresh the page and try again.</p>
          <button className="refresh-btn" onClick={() => window.location.reload()}>
            <span>🔄</span> Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const handleApprove = async (spotId) => {
    try {
      await approveSpot(spotId);
      setSpots(spots.filter(spot => spot.id !== spotId));
      // Show success notification
    } catch (error) {
      console.error('Error approving spot:', error);
    }
  };

  const handleReject = async (spotId) => {
    try {
      await rejectSpot(spotId);
      setSpots(spots.filter(spot => spot.id !== spotId));
    } catch (error) {
      console.error('Error rejecting spot:', error);
    }
  };

  const handleDelete = async (spotId) => {
    if (window.confirm('Are you sure you want to delete this spot? This action cannot be undone.')) {
      try {
        await deleteSpot(spotId);
        setApprovedSpots(approvedSpots.filter(spot => spot.id !== spotId));
      } catch (error) {
        console.error('Error deleting spot:', error);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    history.push('/login');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const SpotCard = ({ spot, isPending = false }) => (
    <div className="spot-card">
      <div className="spot-card-header">
        <div className="spot-status">
          <span className={`status-badge ${isPending ? 'pending' : 'approved'}`}>
            {isPending ? '⏳ Pending' : '✅ Approved'}
          </span>
        </div>
        <div className="spot-location-coords">
          {spot.location?.lat.toFixed(4)}, {spot.location?.lng.toFixed(4)}
        </div>
      </div>

      {isLoaded && spot.location && (
        <div className="spot-map-container">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: spot.location.lat, lng: spot.location.lng }}
            zoom={14}
            options={{
              disableDefaultUI: false,
              mapTypeControl: true,
              streetViewControl: false,
              fullscreenControl: true,
              zoomControl: true,
              mapTypeControlOptions: {
                style: window.google?.maps?.MapTypeControlStyle?.HORIZONTAL_BAR,
                position: window.google?.maps?.ControlPosition?.TOP_LEFT,
                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
              },
              zoomControlOptions: {
                position: window.google?.maps?.ControlPosition?.RIGHT_CENTER
              },
              fullscreenControlOptions: {
                position: window.google?.maps?.ControlPosition?.TOP_RIGHT
              },
              styles: [
                {
                  featureType: "water",
                  elementType: "geometry",
                  stylers: [{ color: "#a2daf2" }]
                },
                {
                  featureType: "landscape.natural",
                  elementType: "geometry.fill", 
                  stylers: [{ color: "#f5f5f2" }, { lightness: 20 }]
                }
              ]
            }}
          >
            <Marker 
              position={{ lat: spot.location.lat, lng: spot.location.lng }}
              icon={{
                url: 'data:image/svg+xml,' + encodeURIComponent(`
                  <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="14" fill="#2176d2" stroke="white" stroke-width="2"/>
                    <text x="16" y="21" text-anchor="middle" fill="white" font-size="12">🎣</text>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(32, 32)
              }}
            />
          </GoogleMap>
        </div>
      )}

      <div className="spot-content">
        <div className="spot-title">
          <h3>{spot.title || spot.locationName || spot.name || 'Unnamed Spot'}</h3>
        </div>

        <div className="spot-details-grid">
          <div className="detail-item">
            <span className="detail-icon">🐟</span>
            <div>
              <span className="detail-label">Species</span>
              <span className="detail-value">{spot.species || 'Not specified'}</span>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">🎣</span>
            <div>
              <span className="detail-label">Bait</span>
              <span className="detail-value">{spot.bait || 'Not specified'}</span>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">⚡</span>
            <div>
              <span className="detail-label">Technique</span>
              <span className="detail-value">{spot.technique || 'Not specified'}</span>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">👤</span>
            <div>
              <span className="detail-label">Created By</span>
              <span className="detail-value">{spot.createdBy || 'Anonymous'}</span>
            </div>
          </div>

          <div className="detail-item full-width">
            <span className="detail-icon">📅</span>
            <div>
              <span className="detail-label">Created</span>
              <span className="detail-value">{formatDate(spot.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="spot-actions">
          {isPending ? (
            <>
              <button 
                className="action-btn approve-btn"
                onClick={() => handleApprove(spot.id)}
              >
                <span>✅</span> Approve
              </button>
              <button 
                className="action-btn reject-btn"
                onClick={() => handleReject(spot.id)}
              >
                <span>❌</span> Reject
              </button>
            </>
          ) : (
            <button 
              className="action-btn delete-btn"
              onClick={() => handleDelete(spot.id)}
            >
              <span>🗑️</span> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">🎣</div>
            <div>
              <h1>Admin Dashboard</h1>
              <p>Manage fishing spots and user submissions</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{spots.length}</h3>
            <p>Pending Reviews</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{approvedSpots.length}</h3>
            <p>Approved Spots</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{spots.length + approvedSpots.length}</h3>
            <p>Total Spots</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <span>⏳</span> Pending ({spots.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          <span>✅</span> Approved ({approvedSpots.length})
        </button>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading fishing spots...</p>
          </div>
        ) : (
          <>
            {activeTab === 'pending' && (
              <div className="spots-grid">
                {spots.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No pending spots</h3>
                    <p>All submissions have been reviewed!</p>
                  </div>
                ) : (
                  spots.map(spot => (
                    <SpotCard key={spot.id} spot={spot} isPending={true} />
                  ))
                )}
              </div>
            )}

            {activeTab === 'approved' && (
              <div className="spots-grid">
                {approvedSpots.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🎣</div>
                    <h3>No approved spots</h3>
                    <p>Start by approving some pending submissions!</p>
                  </div>
                ) : (
                  approvedSpots.map(spot => (
                    <SpotCard key={spot.id} spot={spot} isPending={false} />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;