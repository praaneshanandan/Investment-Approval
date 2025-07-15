# Investment Request Management System

A comprehensive role-based investment request management system that allows users to submit investment requests, managers to review and process them, and administrators to oversee the entire workflow.

## Features

- **Role-based authentication** with three distinct roles: Regular, Manager, and Admin
- **Investment request** creation, tracking, and management
- **Workflow management**: Managers can approve, reject, or escalate requests to admins
- **User management**: Admins can manage user roles and assign managers to regular users
- **Responsive UI** with light/dark theme support

## Tech Stack

### Backend

- **Java Spring Boot** - Core framework
- **Spring Security** with JWT authentication
- **Spring Data JPA** - Data access layer
- **MySQL** - Database
- **Lombok** - Reducing boilerplate code
- **Maven** - Dependency management

### Frontend

- **React** with TypeScript
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - API client
- **Shadcn UI** - Component library
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Sonner** - Toast notifications

## Setup Instructions

### Backend Setup

1. **Prerequisites**:

   - Java 17 or higher
   - Maven
   - MySQL

2. **Database Configuration**:

   - Create a MySQL database named `investment_db` or update the configuration in `application.properties`
   - Default credentials are in `application.properties`

3. **Run the Application**:

   ```bash
   cd c:\Users\hp\Downloads\project
   mvn spring-boot:run
   ```

4. **Default Admin Access**:
   - Username: `admin`
   - Password: `admin123`

### Frontend Setup

1. **Prerequisites**:

   - Node.js (version 16 or later)
   - npm or yarn

2. **Install Dependencies**:

   ```bash
   cd c:\Users\hp\Downloads\project\ui
   npm install
   ```

3. **Run the Development Server**:

   ```bash
   npm run dev
   ```

4. **Access the Application**:
   - The application will be available at `http://localhost:5173`

## Deployment

### Building for Production

1. **Build the Frontend**:

   ```bash
   cd c:\Users\hp\Downloads\project\ui
   npm run build
   ```

   This will create production-ready assets in `src/main/resources/static`

2. **Package the Application**:

   ```bash
   cd c:\Users\hp\Downloads\project
   mvn clean package
   ```

   This will create a standalone JAR file with both backend and frontend

3. **Run the Packaged Application**:

   ```bash
   java -jar target/investment-system-0.0.1-SNAPSHOT.jar
   ```

4. **Access the Application**:
   - The application will be available at `http://localhost:8080`

## System Flow

1. Regular users can create investment requests
2. Managers review requests from their subordinates and can:
   - Approve the request
   - Reject the request
   - Escalate to admin for review
3. Admins manage the system and can:
   - Manage users and roles
   - Review escalated requests
   - Approve or reject escalated requests


