import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage';
import SpotSharePage from './pages/SpotSharePage';
import WelcomePage from './components/WelcomePage';
import DirectionsPage from './pages/DirectionsPage';
import AboutPage from './pages/AboutPage';
import './styles/App.css';
import { GoogleMapsProvider } from './contexts/GoogleMapsProvider';

function App() {
  return (
    <GoogleMapsProvider>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" exact component={WelcomePage} />
            <Route path="/home" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/signup" component={SignupPage} />
            <Route path="/admin" component={AdminPage} />
            <Route path="/share" component={SpotSharePage} />
            <Route path="/directions" component={DirectionsPage} />
            <Route path="/about" component={AboutPage} />
          </Switch>
        </div>
      </Router>
    </GoogleMapsProvider>
  );
}

export default App;