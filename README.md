# Fishing Spots App

## Overview
The Fishing Spots App is a web application that allows users to search and share fishing spots. It integrates with the Google Maps API to provide an interactive map experience. Users can log in, sign up, and share their favorite fishing locations, while admins can manage and approve shared spots.

## Features
- User authentication (login and signup)
- Search and filter fishing spots
- Interactive map view using Google Maps API
- Admin dashboard for managing shared spots
- Responsive design with user-friendly interface

## Technologies Used
- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **Database**: Firebase
- **API**: Google Maps API

## Project Structure
```
fishing-spots-app
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   └── app.js
│   ├── package.json
│   └── README.md
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── styles
│   │   ├── App.js
│   │   ├── index.js
│   │   └── firebase.js
│   ├── package.json
│   └── README.md
├── README.md
```

## Getting Started

### Prerequisites
- Node.js
- npm
- Firebase account
- Google Maps API key

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the backend directory and install dependencies:
   ```
   cd fishing-spots-app/backend
   npm install
   ```
3. Navigate to the frontend directory and install dependencies:
   ```
   cd ../frontend
   npm install
   ```

### Configuration
- Set up Firebase and update the `firebase.js` file in the frontend with your Firebase configuration.
- Obtain a Google Maps API key and integrate it into the `MapView.js` component.

### Running the Application
1. Start the backend server:
   ```
   cd fishing-spots-app/backend
   npm start
   ```
2. Start the frontend application:
   ```
   cd ../frontend
   npm start
   ```

### Usage
- Access the application in your web browser at `http://localhost:3000`.
- Users can sign up or log in to share and view fishing spots.
- Admins can manage shared spots through the admin dashboard.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.