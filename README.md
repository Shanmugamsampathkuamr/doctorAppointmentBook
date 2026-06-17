# Doctor Appointment System

A full-stack doctor appointment booking application built with Spring Boot and React.

## Tech Stack

**Backend:** Spring Boot 4.0.3, Java 17, Spring Security, JPA/Hibernate, PostgreSQL  
**Frontend:** React 19, Vite 8, Tailwind CSS 4, React Router 7  
**Other:** JWT Authentication, Swagger/OpenAPI, Lombok, ModelMapper

## Setup

### Prerequisites
- Java 17+
- Node.js 20+
- PostgreSQL

### Backend
1. Copy `src/main/resources/application.properties.example` to `src/main/resources/application.properties` and fill in your DB credentials, JWT secret, and email credentials.
2. Run: `./mvnw spring-boot:run`

### Frontend
```bash
cd doctor-app-ui
npm install
npm run dev
```

### API Docs
Swagger UI available at `http://localhost:8080/swagger-ui.html` when the backend is running.

## Features
- User registration & login with JWT
- Role-based access (Patient, Doctor, Admin)
- Appointment booking & management
- Doctor availability management
- Real-time chat between patients and doctors
- Email notifications
- Reviews & ratings
- Search & filter doctors
