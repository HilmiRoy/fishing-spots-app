# Fishing Spots App

## Overview
The Fishing Spots App is a web application that allows users to search and share fishing spots. It integrates with Google Maps API to provide a visual representation of the fishing locations. The application features user and admin login, a welcome page, a sign-up page, a shared fishing spot page with filtering options, and an admin dashboard for approving shared spots.

## Technologies Used
- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **Database**: Firebase
- **API**: Google Maps API

## Features
- User authentication (login and signup)
- Admin dashboard for managing fishing spots
- Search and filter fishing spots by species or technique
- Interactive map view displaying fishing spots
- User-friendly interface for sharing fishing spots

## Project Structure
```
fishing-spots-app
├── backend
│   ├── src
│   ├── package.json
│   └── README.md
├── frontend
│   ├── public
│   ├── src
│   ├── package.json
│   └── README.md
├── README.md
```

## Getting Started

### Prerequisites
- Node.js
- npm
- Firebase account for database setup

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

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the frontend application:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and go to `http://localhost:3000` to access the application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.