/**
 * Main application entry point for the Roman Numeral Converter API.
 * This file sets up the Express server, configures middleware, and defines routes.
 * 
 * @module app
 * @category Core
 */
import './traces.js';

import express from 'express';
import cors from 'cors';
import { romanNumeralHandler } from './routes/romanNumeral.js';
import { requestCount, httpRequestDurationMicroseconds, register } from './services/metrics.js';
import dotenv from 'dotenv';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

/**
 * Express application instance
 * @type {express.Application}
 * @private
 */
const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost',
  methods: ['GET'],
}));

/**
 * Root route handler
 * @name GET /
 * @function
 * @route {GET} /
 * @returns {Object} JSON response with API information
 * @example
 * // Response
 * {
 *   name: "Roman Numeral Converter API",
 *   version: "1.0.0",
 *   endpoints: [...]
 * }
 */
app.get('/', (_req, res) => {
  res.json({
    name: 'Roman Numeral Converter API',
    version: '1.0.0',
    endpoints: [
      {
        path: '/romannumeral',
        method: 'GET',
        description: 'Converts a number to Roman numeral',
        parameters: {
          query: 'The number to convert (1-3999)'
        }
      },
      {
        path: '/metrics',
        method: 'GET',
        description: 'Get Prometheus metrics'
      }
    ]
  });
});

/**
 * Route handler for Roman numeral conversion
 * @name GET /romannumeral
 * @function
 * @route {GET} /romannumeral
 * @param {string} query - The number to convert to Roman numerals (1-3999)
 * @returns {Object} JSON response with input and converted Roman numeral
 * @throws {400} If input is invalid or out of range
 * @example
 * // Request
 * GET /romannumeral?query=42
 * 
 * // Response
 * {
 *   input: "42",
 *   output: "XLII"
 * }
 */
app.get('/romannumeral', romanNumeralHandler);

/**
 * Route handler for Prometheus metrics
 * @name GET /metrics
 * @function
 * @route {GET} /metrics
 * @returns {string} Prometheus metrics in text format
 * @example
 * // Response
 * # HELP roman_numeral_requests_total Total number of Roman numeral conversion requests
 * # TYPE roman_numeral_requests_total counter
 * roman_numeral_requests_total 42
 */
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});

/**
 * Error handling middleware
 * @function
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {void}
 * @example
 * // Response for unknown route
 * {
 *   error: "Not Found",
 *   message: "The requested resource was not found",
 *   availableEndpoints: ["/", "/romannumeral", "/metrics"]
 * }
 */
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    availableEndpoints: ['/', '/romannumeral', '/metrics']
  });
});

// Start server
const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
