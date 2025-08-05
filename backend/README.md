# Fishing Spots App - Backend Documentation

## Overview
The Fishing Spots App is a web application that allows users to search and share fishing spots. The backend is built using Node.js and Express, and it integrates with Firebase for database management. This document provides an overview of the backend structure, setup instructions, and API endpoints.

## Project Structure
```
backend
├── src
│   ├── controllers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   └── spotController.js
│   ├── middleware
│   │   └── authMiddleware.js
│   ├── models
│   │   └── userModel.js
│   ├── routes
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   └── spotRoutes.js
│   └── app.js
├── package.json
```

## Setup Instructions
1. **Clone the repository**
   ```
   git clone <repository-url>
   cd fishing-spots-app/backend
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project and configure the database.
   - Update the Firebase configuration in the `userModel.js` file.

4. **Run the server**
   ```
   npm start
   ```

## API Endpoints
### Authentication
- **POST /api/auth/signup**: Register a new user.
- **POST /api/auth/login**: Authenticate a user.

### Admin Routes
- **GET /api/admin/spots**: Retrieve all shared fishing spots.
- **POST /api/admin/approve/:id**: Approve a shared fishing spot.
- **POST /api/admin/reject/:id**: Reject a shared fishing spot.

### Fishing Spots
- **POST /api/spots**: Share a new fishing spot.
- **GET /api/spots**: Retrieve all fishing spots with optional filtering.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.