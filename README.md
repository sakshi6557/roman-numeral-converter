# Roman Numeral Converter

A full-stack application for converting numbers to Roman numerals, built with TypeScript, React, and Express.js.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#Prerequisites)
- [Project-Structure](#Project-Structure)
- [Getting-Started](#Getting-Started)
- [Production-Deployment](#Production-Deployment)
- [Development-Setup](#Development-Setup)
- [API-Documentation](#API-Documentation)
- [User-Interface](#User-Interface)
- [Testing](#Testing)
- [Observability-Features](#Observability-Features)
- [Documentation](#Documentation)
- [Tech-Stack-Insights](#Tech-Stack-Insights)
- [Accessibility](#Accessibility)
- [References](#References)
- [FAQs](#FAQs)


## Overview

This project consists of two main components:

- Backend: A RESTful API built with Express.js and TypeScript
- Frontend: A modern React application with React Spectrum UI

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


## Getting Started

### 1. Make sure Docker & Docker Compose are installed

### 2. Pull all the necessary docker container images
```bash
   docker pull jaegertracing/all-in-one:1.48
   docker pull sakshi6557/roman-numeral-service:latest
   docker pull sakshi6557/roman-numeral-frontend:latest
```
### 3. Create a network for application
```bash
   docker network create roman-network
```
### 4. Run the containers in the same order
```bash
   docker run -d --name jaeger --network roman-network -p 16686:16686 -p 4318:4318  jaegertracing/all-in-one:1.48
```

```bash
   docker run -d --name backend -p 8080:8080 -e OTEL_EXPORTER_OTLP_ENDPOINT=http://jaeger:4318 --network roman-network sakshi6557/roman-numeral-service:latest
```

```bash
   docker run -d --name frontend --network roman-network -p 8081:80 -e VITE_API_URL=http://backend:8080 sakshi6557/roman-numeral-frontend:latest
```

### 5. Access the app in your browser
  
   The frontend will be available at `http://localhost:8081` and the backend API will be available at `http://localhost:8080`


## Production Deployment

### 1. Make sure Docker & Docker Compose are installed

### 2. Clone the Repository
```bash
   git clone https://github.com/sakshi6557/roman-numeral-converter.git
   cd roman-numeral-converter
```
   You can also choose to [download the ZIP](#https://github.com/sakshi6557/roman-numeral-converter/archive/refs/heads/main.zip) if you prefer not to use Git.
   
### 3. In the backend folder, rename `.env.production.example` to `.env.production`, and in the frontend folder, rename `.env.example` to `.env.`

### 4. Run the project
```bash
      docker-compose up --build
```
### 5. Access the app in your browser
  
   The backend API will be available at `http://localhost:8080`, the frontend will be available at `http://localhost:8081`, and the Jaeger UI at http://localhost:16686

### 6. To stop the containers
```bash
      docker-compose down
```

## Development Setup

### Clone the Repository or Download the code
```bash
   git clone https://github.com/sakshi6557/roman-numeral-converter.git
   cd roman-numeral-converter
```
You can also choose to [download the ZIP](#https://github.com/sakshi6557/roman-numeral-converter/archive/refs/heads/main.zip) if you prefer not to use Git.

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
```bash
   /
```
Returns information about the endpoints

![image](https://github.com/user-attachments/assets/e6d58282-6696-4f81-8ee4-5285ab6641f4)


### Convert Number to Roman Numeral
```bash
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
  -   
    ![image](https://github.com/user-attachments/assets/5f7925da-2e30-481d-b8e1-89cbef3c324a)


  - Invalid input (non-numeric)
    
    ![image](https://github.com/user-attachments/assets/d525c935-cc51-4d1c-8e83-13eacfebcb52)


  - Out of range number
    
    ![image](https://github.com/user-attachments/assets/31fa4c80-c50e-4885-9cff-ea5c14d01deb)


  - Decimal number
    
    ![image](https://github.com/user-attachments/assets/bddab0c1-8299-4617-a69f-58689df24731)


- 500 InternalServerError


### Metrics
```bash
   GET /metrics
```
Returns Prometheus metrics including request count, duration, and error rates.

![image](https://github.com/user-attachments/assets/b674e473-e8f6-4256-81d4-7c2a1783c59c)


## User-Interface

The initial design on Figma: 

![image](https://github.com/user-attachments/assets/f28d99bb-b74d-420c-9295-8c106f0a9bab)

The UI after development:

   - The user interface design changes are implemented according to the React Spectrum guidelines and components.
   - The toggle button changes dark mode to light mode; by default, it is set to match the system's mode.
   - The Convert to Roman Numeral button is enabled when a user enters text in the text field.

![image](https://github.com/user-attachments/assets/f5f6a0d1-2896-46b3-85ec-be14d0cd03a4)

![image](https://github.com/user-attachments/assets/09be375e-271f-4a61-853b-06c17d82105a)

![image](https://github.com/user-attachments/assets/c26320a8-210f-4ead-89d5-e78891d62470)

The light mode of the user interface:

   - Toggle the mode button for changing the mode of the user interface.

![image](https://github.com/user-attachments/assets/8ac60ae0-bcae-4bb3-a9f7-859a80206ed0)

User Interface on Iphone 12 Pro -

![image](https://github.com/user-attachments/assets/4a624ddc-192a-4ccb-93a4-76819b797334)


## Testing

This application uses both Jest and Vitest testing frameworks to ensure reliability and maintainability.

Jest is used for unit and integration tests, offering powerful mocking capabilities and wide community support.

Vitest is a faster, Vite-native testing framework used for components and modern ES module-based code. It's lightweight and optimized for Vite-based projects.

Both frameworks help validate core functionality, catch regressions early, and support Test-Driven Development (TDD) practices. Tests cover:

   - Utility functions
   - API calls
   - Component behavior
   - Edge case handling

Additionally, test coverage is measured to ensure that critical parts of the code are well-tested. The coverage reports highlight areas that may need further testing, ensuring higher code quality and minimizing potential bugs in production.

### Backend Tests
```bash
   cd backend
   npm test
   npm test:coverage
```

![image](https://github.com/user-attachments/assets/5c980730-3c0f-4068-be06-181bca00cda2)

The index.html file in the coverage folder shows the total coverage of code in the testcases

![image](https://github.com/user-attachments/assets/1b9b97c2-b702-42e0-9214-5e44f4f69965)


### Frontend Tests
```bash
   cd frontend
   npm test
   npm test:coverage
```

![image](https://github.com/user-attachments/assets/52b8371d-e01f-4a9d-b02d-3710fabdb736)

The index.html file in the coverage folder shows the total coverage of code in the testcases

![image](https://github.com/user-attachments/assets/82bd5aca-a25d-4901-8a81-727e00606c5c)


## Observability Features

The project implements the three pillars of observability:

1. **Logs**:
   - Structured logging using Console
   - Log levels (info, error, debug)
   - Request/response logging
   - Error tracking
     
   For the current scope of this project, I've used simple console-based logging, as the code is relatively lightweight and basic logging is sufficient for development and debugging.

   In the future, if more advanced and customizable logging is needed (e.g., file transport, log rotation, or log level filtering), I plan to integrate Winston — a versatile and widely-used logging library in Node.js.
   
   Development: Shows detailed logs including debug, info, warn, and error levels for easier debugging and testing.

   Production: Restricts logs to only essential levels — info, warn, and error — to maintain cleaner output and better performance.
  
   ![image](https://github.com/user-attachments/assets/f4145658-bce0-4f68-809b-97cf9b3d46e8)


1. **Metrics**:
   - Conversion duration tracking
   - Error rate monitoring
   - Request count metrics


   All metrics are exposed via the /metrics endpoint and collected using the Prometheus client library to monitor API performance and reliability.
   
   The application measures how long it takes to process each Roman numeral conversion request to  help monitor performance and identify any bottlenecks in the backend.

   All errors encountered during request processing are properly logged along with the request duration. This makes it easier to trace issues and maintain system reliability.

   The requestCount counter tracks the total number of conversion requests received to provide insights into the API usage patterns and overall traffic.


   ![image](https://github.com/user-attachments/assets/b674e473-e8f6-4256-81d4-7c2a1783c59c)


2. **Traces**:
   - Request tracing
   - Performance monitoring
   - Error correlation

   
   Traces are collected using OpenTelemetry and visualized through Jaeger, which runs as a container. The Jaeger UI is accessible at `http://localhost:16686`, offering a clear view of spans, timelines, and performance metrics for each request.
  
   Each incoming request is traced end-to-end using OpenTelemetry, providing detailed insights into how requests are processed across different parts of the system.

   Traces include timing data for each operation, helping identify latency hotspots and optimize the performance of the API.

   Errors are automatically captured within trace data, making it easier to pinpoint where and why failures occur in a request's lifecycle.
     
   ![image](https://github.com/user-attachments/assets/2abe8ed4-b7e7-4368-97e6-2c3f65ca0ed4)


## Documentation

To demonstrate automated documentation generation using JSDoc comments, I integrated the TypeDoc library into the project. This setup ensures that up-to-date, type-safe documentation is generated directly from the source code.

Maintaining documentation manually can quickly become outdated and hard to scale, especially as the codebase grows. By using TypeDoc, documentation stays in sync with the code, reducing maintenance overhead and improving developer experience.

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


## Tech Stack Insights

### Backend Technologies

1. **Express.js**:
   - Lightweight and fast
   - Excellent TypeScript support
   - Large ecosystem of middleware
   - Easy to containerize

2. **TypeScript**:
   - Static type checking
   - Improved developer experience
   - Better code documentation
   - Enhanced IDE support

3. **Node.js Dependencies**:
   - **cors**: Cross-origin resource sharing enablement
   - **dotenv**: Environment variable management
   - **prom-client**: Prometheus metrics collection and exposition

4. **Observability Stack**:
   - **OpenTelemetry**: Distributed tracing implementation
     - `@opentelemetry/sdk-node`: Core SDK for Node.js
     - `@opentelemetry/auto-instrumentations-node`: Automatic instrumentation for common Node.js libraries
     - `@opentelemetry/exporter-trace-otlp-http`: Exports traces to Jaeger
   - **Jaeger**: Distributed tracing visualization and analysis
   - **Prometheus** (via prom-client): Metrics collection

5. **Development Tools**:
   - **Jest**: Testing framework with snapshot testing
   - **ESLint**: Code quality and style enforcement
   - **Nodemon**: Development server with hot reloading
   - **TypeDoc**: Documentation generation
   - **ts-node**: TypeScript execution environment
   - **rimraf**: Cross-platform directory cleanup utility
   - **cross-env**: Cross-platform environment variable setting

### Frontend Technologies

1. **Adobe React Spectrum**:
   - Built-in accessibility features
   - Comprehensive component library
   - Built-in theming support
   - Professional design system
   - Active maintenance and support

2. **React**:
   - Component-based architecture
   - Virtual DOM for optimized rendering
   - Extensive ecosystem
   - Declarative programming model

3. **Vite**:
   - Fast development server
   - Optimized production builds
   - Excellent TypeScript support
   - Modern build tooling

4. **TypeScript**:
   - Type safety
   - Enhanced developer experience
   - Better IDE integration
   - Improved code maintainability

5. **HTTP Client**:
   - **Axios**: Feature-rich HTTP client with promise support, request/response interception, and broad browser compatibility

6. **Testing Tools**:
   - **Vitest**: Fast, Vite-native testing framework
   - **Testing Library**: User-centric testing utilities
   - **Jest DOM**: DOM testing assertions

7. **Build and Quality Tools**:
   - **ESLint**: Static code analysis
   - **Terser**: JavaScript minification
   - **TypeScript**: Static type checking

### Infrastructure

1. **Docker**:
   - Containerization for consistent environments
   - Easy deployment and scaling
   - Isolation of services
   - Simplified dependency management

2. **Docker Compose**:
   - Multi-container orchestration
   - Environment configuration
   - Network management
   - Development-to-production consistency

3. **Nginx**:
   - High-performance web server
   - Static file serving for frontend
   - Proxy capabilities
   - Lightweight and efficient


## Accessibility

The UI is built with accessibility in mind:
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast support through light/dark mode


## References

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


## FAQs

1. Why is the `.env.example` file needed?
   - To simulate a production-ready setup, I've utilized environment variables in the implementation. Although the .env file contains no sensitive information, only example files (.env.example, .env.production.example) are included in the repository, as it's best practice to avoid committing actual .env files to GitHub or any public platforms.



