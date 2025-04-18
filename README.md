# Roman Numeral Converter

A full-stack application for converting numbers to Roman numerals, built with React and Express.js.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#Prerequisites)
- [Project-Structure](#Project-Structure)
- [Getting-Started](#Getting-Started)
- [API-Documentation](#API-Documentation)
- [Development-mode](#Development-mode)
- [Testing](#Testing)
- [Documentation](#Documentation)
- [Technologies-Used](#Technologies-Used)


## Overview

This project consists of two main components:
- Frontend: A modern React application with React Spectrum UI
- Backend: A RESTful API built with Express.js and TypeScript

## Features

### Frontend
- Convert numbers to Roman numerals
- Responsive design
- Light and dark mode support
- System theme detection
- Error handling and input validation
- Clean and modern UI using React Spectrum

### Backend
- RESTful API endpoints
- Input validation and error handling
- Prometheus metrics integration
- TypeScript support
- Comprehensive test coverage
- Docker support

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Docker (optional, for containerized deployment)

## Project Structure

```
roman-numeral-converter/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.tsx       # Main application component
│   │   └── main.tsx      # Application entry point
│   ├── index.html        # HTML template
│   └── package.json      # Frontend dependencies
│
├── backend/              # Express.js backend API
│   ├── src/
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # Business logic
│   │   └── app.ts       # Express application setup
│   └── package.json     # Backend dependencies
│
├── docs/
|   ├── index.html        # Generated documentation for project
|   └── modules.html      # Documentation
|
├── typedoc.json
|
└── README.md            # This file
```


## Getting Started - (With Docker)

### 1. Make sure Docker & Docker Compose are installed

### 2. Clone the Repository
```bash
      git clone https://github.com/sakshi6557/roman-numeral-converter.git
      cd roman-numeral-converter
```

### 3. Create a .env.production file in the backend folder and .env file in the frontend folder

### 4. Run the project
```bash
      docker-compose up --build
```
### 5. Access the app in your browser
  
   The frontend will be available at `http://localhost:8081` and the backend API will be available at `http://localhost:8080`


## Getting Started - (Without Docker)

### Clone the Repository
```bash
git clone https://github.com/sakshi6557/roman-numeral-converter.git
cd roman-numeral-converter
```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:8081`

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
   
2. Install dependencies:
   ```bash
   npm install
   ```
   
3. Start the production server:
   ```bash
   npm run start
   ```
   
   The API will be available at `http://localhost:8080`


## API Documentation

### API Information
```
/
```
Returns information about the endpoints

### Convert Number to Roman Numeral
```
GET /romannumeral?query={number}
```

**Parameters:**
- `query` (required): The number to convert (1-3999)

**Success Response:**
```json
{
"input": "10",
"output": "X",
"statusCode":200,
"statusText": "OK",
"requestId": "kdu7pq",
"duration": "1ms"
}
```

**Error Responses:**
- 400 Bad Request
  - Missing query parameter
  - Invalid input (non-numeric)
  - Out of range number
  - Decimal number
- 500 InternalServerError

### Metrics
```
GET /metrics
```
Returns Prometheus metrics including request count, duration, and error rates.

## Development mode

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

### Documentation
1. To create a basic documentation:
      ```bash
      cd backend
      npm run docs
      ```
      or
      ```bash
      cd backend
      npm run docs:build
      ```
2. To clean and build again:
      ```bash
      cd backend
      npm run docs:clean
      npm run docs:build
      ```
   Generates `index.html` file in the /docs folder

## Technologies Used

### Frontend
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [React Spectrum](https://react-spectrum.adobe.com/) - UI components
- [Vite](https://vitejs.dev/) - Build tool and development server

### Backend
- [Express.js](https://expressjs.com/) - Web framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Jest](https://jestjs.io/) - Testing framework
- [Prometheus](https://prometheus.io/) - Metrics collection
- [OpenTelemetry](https://opentelemetry.io/) - Traces collection
- [Docker](https://www.docker.com/) - Containerization
