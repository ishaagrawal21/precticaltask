# Quick Setup Guide

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Configure Environment Variables
Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/event-booking
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## Step 3: Start MongoDB
Make sure MongoDB is running on your system:
- Local: `mongod`
- Or use MongoDB Atlas connection string in `.env`

## Step 4: Start the Server
```bash
npm run dev
```

## Step 5: Access the API
- API Base: http://localhost:3000
- API Docs: http://localhost:3000/api-docs
- Health Check: http://localhost:3000/health

## Quick Test

1. **Register a user:**
   ```bash
   curl -X POST http://localhost:3000/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Admin User","email":"admin@test.com","password":"password123","role":"admin"}'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:3000/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@test.com","password":"password123"}'
   ```

3. **Create an event (use token from login):**
   ```bash
   curl -X POST http://localhost:3000/events \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -d '{"name":"Test Event","date":"2024-12-25","capacity":100}'
   ```

## Project Structure
```
event-booking/
├── controller/      # Business logic
├── middleware/      # Auth & rate limiting
├── model/           # MongoDB schemas
├── router/          # API routes
├── exports/         # CSV exports (auto-created)
├── server.js        # Main entry point
└── package.json     # Dependencies
```

For detailed documentation, see [README.md](./README.md)

