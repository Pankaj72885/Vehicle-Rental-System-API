# Vehicle Rental System API 🚗

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://vehicle-rental-system-api-kappa.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/Pankaj72885/Vehicle-Rental-System-API)

A robust and scalable backend API for a **Vehicle Rental Management System**. This project demonstrates a professional-grade backend architecture built with **TypeScript**, **Express.js**, and **PostgreSQL**. It is designed to handle the core operations of a rental business, including inventory management, booking workflows, user roles, and automated price calculations.

## 🌟 Project Overview

This API serves as the backbone for a car rental platform. It features a complete booking lifecycle management system where customers can browse available vehicles, make bookings with automated cost calculation based on rental duration, and manage their reservations. Administrators have full control over the fleet, user base, and can oversee all booking activities.

The project highlights strict **input validation**, **error handling**, **authorization guards**, and **modular code structure**, making it a secure and maintainable solution.

## 🚀 Key Features

- **🔐 Secure Authentication**:
  - JWT-based stateless authentication.
  - Password hashing using Bcrypt.
  - Role-based Access Control (RBAC) for `Admin` and `Customer`.
- **👥 User Management**:
  - Profile management and role-based permissions.
  - Admins can view and manage all users; Customers manage their own profiles.
- **🚙 Fleet Management**:
  - Full CRUD operations for vehicles (Cars, Bikes, SUVs, Vans).
  - Real-time availability tracking (Available/Booked).
- **📅 Smart Booking System**:
  - **Automated Price Calculation**: Calculates total cost based on `daily_rate * duration`.
  - **Availability Checks**: Prevents double-booking of vehicles.
  - **Status Management**: Admins can mark cars as "Returned" (making them available again), and Customers can cancel upcoming bookings.
- **🛡️ Robust Architecture**:
  - **Zod Validation**: Strict schema validation for all inputs.
  - **Global Error Handling**: Standardized error responses involved Zod, Cast, and Duplicate errors.
  - **Modular Pattern**: Code organized by modules (`auth`, `users`, `vehicles`, `bookings`) for scalability.

## 🛠 Technology Stack

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Query Interface**: Raw SQL (via `pg` node-postgres driver)
- **Validation**: [Zod](https://zod.dev/)
- **Deployment**: Vercel

## 🔑 User Credentials (Demo)

You can use the following credentials to test the live API endpoints:

### **👤 Admin Account**

- **Email**: `admin@example.com`
- **Password**: `password123`
- **Access**: Full access to Vehicles, Users, and all Bookings.

### **👤 Customer Account**

- **Action**: You can register a new customer via the Signup endpoint.
- **Example Body**:
  ```json
  POST /api/v1/auth/signup
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "01711223344",
    "role": "customer",
    "address": "Dhaka, Bangladesh"
  }
  ```
- **Access**: Can book vehicles, view own bookings, and cancel own bookings.

## 📖 Usage Instructions & API Endpoints

**Base URL**: `https://vehicle-rental-system-api-kappa.vercel.app/api/v1`

### 1. Authentication

- **Signup**: `POST /auth/signup` - Register as a new user.
- **Signin**: `POST /auth/signin` - Login to get an `accessToken`.
  - _Note_: Include this token in the `Authorization` header (`Bearer <token>`) for protected routes.

### 2. Vehicles (Public & Admin)

- **List Vehicles**: `GET /vehicles` - View all vehicles (Public).
- **Get Vehicle**: `GET /vehicles/:id` - View details of a specific vehicle.
- **Add Vehicle**: `POST /vehicles` (Admin Only).
- **Update Vehicle**: `PUT /vehicles/:id` (Admin Only).
- **Delete Vehicle**: `DELETE /vehicles/:id` (Admin Only).

### 3. Bookings

- **Create Booking**: `POST /bookings` (Customer).
  - Provide `vehicleId`, `rent_start_date`, `rent_end_date`.
  - System validates availability and returns booking with calculated `total_price`.
- **My Bookings**: `GET /bookings` - Lists your own bookings (Customer) or all bookings (Admin).
- **Manage Booking**: `PUT /bookings/:id`
  - **Customer**: Can send `status: "cancelled"` to cancel.
  - **Admin**: Can send `status: "returned"` to close a rental and free up the vehicle.

### 4. User Profile

- **Update Profile**: `PUT /users/:id` - Update your own profile details.

## 💻 Local Setup Guide

Follow these steps to run the project locally on your machine.

**1. Prerequisites**

- Node.js (v18 or higher)
- PostgreSQL installed and running.

**2. Clone the Repository**

```bash
git clone https://github.com/Pankaj72885/Vehicle-Rental-System-API.git
cd Vehicle-Rental-System-API
```

**3. Install Dependencies**

```bash
npm install
```

**4. Configure Environment**
Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://<YOUR_USER>:<YOUR_PASSWORD>@localhost:5432/<YOUR_DB_NAME>
BCRYPT_SALT_ROUNDS=12
JWT_SECRET=your_super_secret_key
```

**5. Initialize Database**
Run the setup script to create tables and seed the initial Admin user.

```bash
npm run db:setup
```

**6. Start the Server**

```bash
npm run dev
```

The server will start at `http://localhost:5000`.

## 🧪 Error Handling

The API uses a standardized error response structure for easier debugging and frontend integration:

```json
{
  "success": false,
  "message": "Validation Error",
  "errorMessages": [
    {
      "path": "email",
      "message": "Invalid email address"
    }
  ]
}
```

---

**Developed by [Pankaj Bepari](https://github.com/Pankaj72885)**
