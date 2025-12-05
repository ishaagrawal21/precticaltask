# Event Booking System API

A comprehensive backend API for an Event Booking System built with Node.js, Express.js, and MongoDB.

## Features

### Core Features
- ✅ User registration and authentication with JWT
- ✅ Event creation, listing, and management
- ✅ Event filtering by date range
- ✅ Pagination support
- ✅ Booking system with real-time seat availability
- ✅ Protected endpoints with authentication middleware

### Bonus Features
- ✅ Role-based access control (Admin/User)
- ✅ Rate limiting on sensitive endpoints
- ✅ CSV export for bookings
- ✅ Swagger/OpenAPI documentation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **API Documentation**: Swagger/OpenAPI
- **Rate Limiting**: express-rate-limit
- **Validation**: express-validator

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-booking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/event-booking
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

   For MongoDB Atlas, use:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-booking
   ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

6. **Access the API**
   - API Base URL: `http://localhost:3000`
   - API Documentation: `http://localhost:3000/api-docs`
   - Health Check: `http://localhost:3000/health`

## API Endpoints

### Authentication

#### Register User
```
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

#### Login
```
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Events

#### Create Event (Protected - Admin only)
```
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Summer Music Festival",
  "date": "2023-12-25",
  "capacity": 100
}
```

#### Get All Events
```
GET /events
GET /events?start=2023-12-01&end=2023-12-31
GET /events?page=1&limit=10
GET /events?start=2023-12-01&end=2023-12-31&page=1&limit=10
```

#### Get Single Event
```
GET /events/:id
```

#### Update Event (Protected - Admin or Event Creator)
```
PUT /events/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Event Name",
  "date": "2023-12-26",
  "capacity": 150
}
```

#### Delete Event (Protected - Admin or Event Creator)
```
DELETE /events/:id
Authorization: Bearer <token>
```

### Bookings

#### Create Booking (Protected)
```
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "eventId": "507f1f77bcf86cd799439011",
  "numberOfTickets": 2
}
```

#### Get All Bookings (Protected)
```
GET /bookings
GET /bookings?page=1&limit=10
```
- Regular users see only their own bookings
- Admins see all bookings

#### Get Single Booking (Protected)
```
GET /bookings/:id
Authorization: Bearer <token>
```

#### Cancel Booking (Protected)
```
DELETE /bookings/:id
Authorization: Bearer <token>
```

#### Export Bookings as CSV (Protected - Admin only)
```
GET /bookings/export
Authorization: Bearer <token>
```

## Database Schema

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  timestamps: true
}
```

### Event
```javascript
{
  name: String (required),
  date: Date (required),
  capacity: Number (required),
  availableSeats: Number (required, auto-set to capacity),
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

### Booking
```javascript
{
  user: ObjectId (ref: User),
  event: ObjectId (ref: Event),
  numberOfTickets: Number (required),
  bookingDate: Date (default: Date.now),
  timestamps: true
}
```

## Project Structure

```
event-booking/
├── controller/
│   ├── auth.controller.js
│   ├── event.controller.js
│   └── booking.controller.js
├── middleware/
│   ├── auth.js
│   └── rateLimiter.js
├── model/
│   ├── UserModel.js
│   ├── EventModel.js
│   └── BookingModel.js
├── router/
│   ├── AuthRoutes.js
│   ├── EventRoutes.js
│   └── BookingRoutes.js
├── exports/
│   └── bookings.csv (generated)
├── server.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcryptjs before storage
2. **JWT Authentication**: Secure token-based authentication
3. **Rate Limiting**: 
   - Login: 5 attempts per 15 minutes
   - Registration: 3 attempts per hour
   - Booking: 10 requests per 15 minutes
4. **Input Validation**: All inputs are validated using express-validator
5. **Role-Based Access Control**: Admin and user roles with appropriate permissions

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## API Documentation

Interactive API documentation is available at `/api-docs` when the server is running. The documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests and responses

## Testing the API

### Using cURL

1. **Register a user:**
   ```bash
   curl -X POST http://localhost:3000/register \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:3000/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"password123"}'
   ```

3. **Create an event (as admin):**
   ```bash
   curl -X POST http://localhost:3000/events \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"name":"Summer Festival","date":"2023-12-25","capacity":100}'
   ```

### Using Postman

Import the API endpoints into Postman and use the Swagger documentation as a reference.

## Rate Limiting

- **Login**: Maximum 5 attempts per IP per 15 minutes
- **Registration**: Maximum 3 attempts per IP per hour
- **Booking**: Maximum 10 requests per IP per 15 minutes

## Notes

- Event dates must be in the future
- Users can only book each event once
- Available seats are tracked in real-time
- When an event is deleted, all associated bookings are also deleted
- CSV exports are saved in the `exports/` directory

## License

ISC

## Author

Event Booking System API

