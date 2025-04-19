# Roman Numeral Converter

A full-stack application for converting numbers to Roman numerals, built with React and Express.js.

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
│   ├── tests/           # Test files
│   └── package.json     # Backend dependencies
│
└── README.md            # This file
```


## Getting Started 

### 1. Make sure Docker & Docker Compose are installed

### 2. Clone the Repository
```bash
      git clone <repository-url>
      cd roman-numeral-converter
```

### 3. Create a .env.production file in the backend folder

### 4. Run the project
```bash
      docker-compose up --build
```
### 5. Access the app in your browser
  
   The frontend will be available at `http://localhost` and the backend API will be available at `http://localhost:3000`


## Getting Started - (Without Docker)

### Clone the Repository
```bash
git clone <repository-url>
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
   The frontend will be available at `http://localhost:5173`

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

### Convert Number to Roman Numeral
```
GET /romannumeral?query={number}
```

**Parameters:**
- `query` (required): The number to convert (1-3999)

**Success Response:**
```json
{
  "input": "42",
  "output": "XLII"
}
```

**Error Responses:**
- 400 Bad Request:
  - Missing query parameter
  - Invalid input (non-numeric)
  - Out of range number
  - Decimal number

### Metrics
```
GET /metrics
```
Returns Prometheus metrics including request count, duration, and error rates.

## Development

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
- [Docker](https://www.docker.com/) - Containerization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
