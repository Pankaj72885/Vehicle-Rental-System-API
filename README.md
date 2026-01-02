# Vehicle Rental System API

A backend API for a detailed Vehicle Rental Management System, built with Express.js, PostgreSQL (Raw Queries), and TypeScript.

## 🚀 Features

- **Authentication**: Secure User Signup & Signin (JWT, Bcrypt).
- **User Management**: CRUD operations, Role-based access (Admin/Customer).
- **Vehicle Management**: Manage vehicle inventory (CRUD).
- **Booking System**: Create bookings with auto-price calculation, manage booking status (Active/Returned/Cancelled).
- **Validation**: Robust input validation using Zod.
- **Error Handling**: Centralized error handling with consistent response formats.

## 🛠 Tech Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Driver**: `pg` (node-postgres)
- **ODM/ORM**: None (Raw SQL)
- **Validation**: Zod
- **Linting/Formatting**: ESLint, Prettier

## ⚙️ Prerequisites

- Node.js (v18+)
- PostgreSQL installed and running
- npm or yarn

## 📦 Installation

1.  **Clone the repository**:

    ```bash
    git clone <repository_url>
    cd VRS
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Setup Environment Variables**:
    Create a `.env` file in the root directory and configure it (see `.env.example`).

    ```env
    NODE_ENV=development
    PORT=5000
    DATABASE_URL=postgresql://user:password@localhost:5432/vrs_db
    BCRYPT_SALT_ROUNDS=12
    JWT_SECRET=supersecret
    ```

4.  **Setup Database**:
    This command runs migrations to create tables and seeds the database with an Admin user.
    ```bash
    npm run db:setup
    ```
    _Note: Ensure your PostgreSQL server is running and the database specified in `DATABASE_URL` exists before running this._

## 🏃‍♂️ Running the Project

- **Development Mode**:

  ```bash
  npm run dev
  ```

- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

## 📜 API Endpoints

### Auth

- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/signin` - Login user

### Users

- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user details
- `PUT /api/v1/users/:id` - Update profile (Admin or Owner)
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Vehicles

- `POST /api/v1/vehicles` - Add a vehicle (Admin only)
- `GET /api/v1/vehicles` - List all vehicles
- `GET /api/v1/vehicles/:id` - Get vehicle details
- `PUT /api/v1/vehicles/:id` - Update vehicle (Admin only)
- `DELETE /api/v1/vehicles/:id` - Delete vehicle (Admin only)

### Bookings

- `POST /api/v1/bookings` - Create a booking (Values calculated automatically)
- `GET /api/v1/bookings` - Get all bookings (Admin: all, Customer: own)
- `PUT /api/v1/bookings/:bookingId` - Cancel (Customer) or Return (Admin) booking

## 🧪 Error Handling

Standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errorMessages": [
    {
      "path": "",
      "message": "Detailed error"
    }
  ],
  "stack": "..." // Only in development
}
```
