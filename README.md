# Wedding Planner Platform

## Overview

The Wedding Planner Platform is a full-stack web and mobile application designed to simplify wedding planning by connecting couples with vendors through a single, user-friendly platform. The system provides dedicated portals for Couples, Vendors, and Administrators, enabling seamless booking, vendor management, and event planning.

This project was developed as part of our internship and demonstrates the implementation of scalable architecture, responsive user interfaces, and modern web technologies.

---

## Team Members

* Pearl Kayastha
* Yash Yadav
* Pranjali Shukla

---

## Technology Stack

### Frontend

* Next.js
* React.js
* TypeScript
* Tailwind CSS

### Mobile

* React Native
* Expo

### Backend

* NestJS
* Node.js
* Prisma ORM

### Database

* PostgreSQL

### Tools & Services

* Git & GitHub
* Swagger API Documentation
* Cloudinary
* JWT Authentication

---

## Key Features

### Couple Portal

* User Registration & Login
* Browse Vendors
* Vendor Details
* Package Booking
* Budget Planning
* Guest Management
* Booking History
* Profile Management

### Vendor Portal

* Vendor Registration
* Package Management
* Booking Requests
* Dashboard Analytics
* Profile Management

### Admin Portal

* User Management
* Vendor Management
* Booking Management
* Dashboard & Analytics
* Platform Monitoring

---

## Project Structure

```text
frontend/    -> Web Application
backend/     -> NestJS REST API
mobile/      -> React Native (Expo) Application
```

---

## Installation

### Clone the Repository

```bash
git clone <repository-url>
```

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

### Mobile

```bash
cd mobile
npm install
```

---

## Environment Variables

Create a `.env` file in the respective project folders and configure the required environment variables.

Example:

```env
DATABASE_URL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EXPO_PUBLIC_API_URL=
```

---

## Running the Project

### Backend

```bash
npm run start:dev
```

### Frontend

```bash
npm run dev
```

### Mobile

```bash
npx expo start
```

---

## Notes

* Install all dependencies before running the project.
* Configure the required environment variables.
* Ensure PostgreSQL is running before starting the backend.
* Prisma migrations should be applied before launching the application.

---

## Acknowledgement

We sincerely thank our internship mentors and the entire team for their continuous guidance, support, and valuable feedback throughout the development of this project. This experience helped us strengthen our technical skills, teamwork, and practical understanding of full-stack application development.

---

**Developed during Internship by**

* Pearl Kayastha
* Yash Yadav
* Pranjali Shukla
