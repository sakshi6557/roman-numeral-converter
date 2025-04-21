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
- [Observability-Features](#Observability-Features)
- [Documentation](#Documentation)
- [Technologies-Used](#Technologies-Used)
- [Dependency-Selection-Reasoning](#Dependency-Selection-Reasoning)
- [Accessibility](#Accessibility)
- [FAQs](#FAQs)


## Overview

This project consists of two main components:
- Frontend: A modern React application with React Spectrum UI
- Backend: A RESTful API built with Express.js and TypeScript

## Features

### Backend
- RESTful API endpoints
- Input validation and error handling
- Prometheus metrics integration
- TypeScript support
- Comprehensive test coverage
- Docker support

### Frontend
- Convert numbers to Roman numerals
- Responsive design
- Light and dark mode support
- System theme detection
- Error handling and input validation
- Clean and modern UI using React Spectrum


## Prerequisites

- Node.js (v18 or higher)
- Git
- Docker (optional)

## Project Structure

```
roman-numeral-converter/
│
├── backend/                     # Backend service (Node.js + Express + TypeScript)
|   ├── coverage/
│   ├── src/
│   │   ├── routes/              # API route handlers
│   │   ├── services/            # Core logic, e.g., Roman numeral conversion
│   │   ├── app.ts               # App entry point (Express setup)
│   │   └── traces.ts            # Tracing setup
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.production          # Environment variables
│   └── Dockerfile
│
├── frontend/                    # React frontend (Vite + TypeScript)
|   ├── coverage/
│   ├── public/                  # Static files
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   ├── App.tsx              # Main app component
│   │   └── main.tsx             # App entry point (Vite)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env                     # Frontend environment variables
│   └── Dockerfile
│
├── docs/                        # Project documentation
│   ├── index.html
│   └── modules.html
|
│── docker-compose.yml           # Orchestrates frontend + backend containers
|
└── README.md
```


## Getting Started - (Production Deployment)

### 1. Make sure Docker & Docker Compose are installed

### 2. Clone the Repository
```bash
      git clone https://github.com/sakshi6557/roman-numeral-converter.git
      cd roman-numeral-converter
```

### 3. In the backend folder, rename .env.production.example to .env.production, and in the frontend folder, rename .env.example to .env.

### 4. Run the project
```bash
      docker-compose up --build
```
### 5. Access the app in your browser
  
   The frontend will be available at `http://localhost:8081` and the backend API will be available at `http://localhost:8080`

### 6. To stop the containers
```bash
      docker-compose down
```

## Getting Started - (Development Setup)

### Clone the Repository
```bash
git clone https://github.com/sakshi6557/roman-numeral-converter.git
cd roman-numeral-converter
```

### Backend Setup
1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
   
2. Start the server:
   ```bash
   npm run dev
   ```
   
   The Roman converter services will be available at `http://localhost:8080`

### Frontend Setup
1. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the server:
   ```bash
   npm run dev
   ```
   The user interface will be available at `http://localhost:8081`

## API Documentation

### API Information
```
/
```
Returns information about the endpoints

![image](https://github.com/user-attachments/assets/e6d58282-6696-4f81-8ee4-5285ab6641f4)


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

![image](https://github.com/user-attachments/assets/797dcc60-e235-4802-a304-beea483e622d)


**Error Responses:**
- 400 Bad Request
  - Missing query parameter
    
    <img src="assets/5f7925da-2e30-481d-b8e1-89cbef3c324a" style="display: inline-block;" />

  
    ![image](https://github.com/user-attachments/assets/5f7925da-2e30-481d-b8e1-89cbef3c324a)

    
  - Invalid input (non-numeric)
    
    ![image](https://github.com/user-attachments/assets/d525c935-cc51-4d1c-8e83-13eacfebcb52)

  - Out of range number
    
    ![image](https://github.com/user-attachments/assets/31fa4c80-c50e-4885-9cff-ea5c14d01deb)

  - Decimal number
    
    ![image](https://github.com/user-attachments/assets/bddab0c1-8299-4617-a69f-58689df24731)

- 500 InternalServerError

### Metrics
```
GET /metrics
```
Returns Prometheus metrics including request count, duration, and error rates.

![image](https://github.com/user-attachments/assets/b674e473-e8f6-4256-81d4-7c2a1783c59c)


## Testing

### Backend Tests
```bash
cd backend
npm test
npm test:coverage
```

![image](https://github.com/user-attachments/assets/5c980730-3c0f-4068-be06-181bca00cda2)

The index.html file in the coverage folder

![image](https://github.com/user-attachments/assets/1b9b97c2-b702-42e0-9214-5e44f4f69965)


### Frontend Tests
```bash
cd frontend
npm test
```

![image](https://github.com/user-attachments/assets/52b8371d-e01f-4a9d-b02d-3710fabdb736)

The index.html file in the coverage folder

![image](https://github.com/user-attachments/assets/82bd5aca-a25d-4901-8a81-727e00606c5c)


## Observability Features

The project implements the three pillars of observability:

1. **Logs**:
   - Structured logging using Winston
   - Log levels (info, error, debug)
   - Request/response logging
   - Error tracking
  
   ![image](https://github.com/user-attachments/assets/f4145658-bce0-4f68-809b-97cf9b3d46e8)


2. **Metrics**:
   - Conversion duration tracking
   - Error rate monitoring
   - Request count metrics

   ![image](https://github.com/user-attachments/assets/b674e473-e8f6-4256-81d4-7c2a1783c59c)


3. **Traces**:
   - Request tracing
   - Performance monitoring
   - Error correlation
  
   ![image](https://github.com/user-attachments/assets/2abe8ed4-b7e7-4368-97e6-2c3f65ca0ed4)


## Documentation

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

For more information about the code structure, refer [roman-numeral-conversion](./roman-numeral-conversion)

## Technologies Used

### Backend
- [Roman numerals](https://en.wikipedia.org/wiki/Roman_numerals) - Roman numerals
- [Express.js](https://expressjs.com/) - Web framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Jest](https://jestjs.io/) - Testing framework
- [Prometheus](https://prometheus.io/) - Metrics collection
- [OpenTelemetry](https://opentelemetry.io/) - Traces collection
- [Docker](https://www.docker.com/) - Containerization
  
### Frontend
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [React Spectrum](https://react-spectrum.adobe.com/) - UI components
- [Vite](https://vitejs.dev/) - Build tool and development server

## Dependency Selection Reasoning

1. **Express.js**:
   - Lightweight and fast
   - Excellent TypeScript support
   - Large ecosystem of middleware
   - Easy to containerize

2. **Adobe React Spectrum**:
   - Built-in accessibility features
   - Comprehensive component library
   - Built-in theming support
   - Professional design system
   - Active maintenance and support

3. **Winston**:
   - Structured logging capabilities
   - Multiple transport options
   - Easy integration with monitoring tools
   - Production-ready features

4. **Vite**:
   - Fast development server
   - Optimized production builds
   - Excellent TypeScript support
   - Modern build tooling

## Accessibility

The UI is built with accessibility in mind:
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast support through light/dark mode

## FAQs

