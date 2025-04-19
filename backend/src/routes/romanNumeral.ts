/**
 * Route handler for Roman numeral conversion endpoint.
 * Handles input validation and conversion requests.
 * 
 * @module romanNumeral
 * 
 * @response {200} Success - Number successfully converted to Roman numeral
 * @response {400} BadRequest - Invalid input parameters
 * @response {404} NotFound - Route not found
 * @response {500} InternalServerError - Server error
 */

import { RequestHandler } from 'express';
import { toRoman } from '../services/romanConverter.js';
import { requestCount, httpRequestDurationMicroseconds } from '../services/metrics.js';
import logger from '../services/logger.js';

/**
 * Handles requests to convert numbers to Roman numerals.
 * Validates input and returns appropriate responses.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {void}
 * 
 * @response {200} Success
 * @responseExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "input": "42",
 *       "output": "XLII"
 *     }
 * 
 * @response {400} BadRequest
 * @responseExample {json} BadRequest-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "MissingParameter",
 *       "message": "Please provide a number using the query parameter."
 *     }
 * 
 * @response {404} NotFound
 * @responseExample {json} NotFound-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "NotFound",
 *       "message": "The requested resource was not found."
 *     }
 * 
 * @response {500} InternalServerError
 * @responseExample {json} InternalServerError-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "InternalServerError",
 *       "message": "An unexpected error occurred while processing your request."
 *     }
 */
export const romanNumeralHandler: RequestHandler = async (req, res) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  logger.info(`[${requestId}] Starting Roman numeral conversion request`);
  logger.debug(`[${requestId}] Request query: ${JSON.stringify(req.query)}`);
  
  try {
    const query = req.query.query;

    // Validate query parameter exists
    if (!query) {
      logger.warn(`[${requestId}] Missing query parameter`);
      res.status(400).json({
        error: 'MissingParameter',
        message: 'Please provide a number using the query parameter.',
        statusCode: 400,
        statusText: 'Bad Request',
        requestId
      });
      return;
    }

    // Validate query parameter type
    if (typeof query !== 'string') {
      logger.warn(`[${requestId}] Invalid query parameter type: ${typeof query}`);
      res.status(400).json({
        error: 'InvalidParameterType',
        message: 'Query parameter must be a string.',
        statusCode: 400,
        statusText: 'Bad Request',
        requestId
      });
      return;
    }

    // Parse and validate number
    const num = parseFloat(query);
    if (isNaN(num)) {
      logger.warn(`[${requestId}] Invalid number input: ${query}`);
      res.status(400).json({
        error: 'InvalidNumber',
        message: 'Invalid input. Please provide a valid number.',
        statusCode: 400,
        statusText: 'Bad Request',
        requestId
      });
      return;
    }

    // Validate whole number
    if (!Number.isInteger(num)) {
      logger.warn(`[${requestId}] Decimal number input: ${num}`);
      res.status(400).json({
        error: 'DecimalNumber',
        message: 'Please provide a whole number (no decimals).',
        statusCode: 400,
        statusText: 'Bad Request',
        requestId
      });
      return;
    }

    // Validate number range
    if (num < 1 || num > 3999) {
      logger.warn(`[${requestId}] Number out of range: ${num}`);
      res.status(400).json({
        error: 'OutOfRange',
        message: 'Number must be between 1 and 3999.',
        statusCode: 400,
        statusText: 'Bad Request',
        requestId
      });
      return;
    }

    logger.info(`[${requestId}] Converting number: ${num}`);
    
    // Convert number to Roman numeral
    const result = toRoman(num);
    
    logger.info(`[${requestId}] Conversion successful: ${num} -> ${result}`);

    // Update metrics
    requestCount.inc();
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds.observe(duration);
    
    logger.debug(`[${requestId}] Request duration: ${duration}ms`);

    // Return successful response
    res.status(200).json({ 
      input: String(num), 
      output: result,
      statusCode: 200,
      statusText: 'OK',
      requestId,
      duration: `${duration}ms`
    });

  } catch (error) {
    // Log the error for debugging
    logger.error(`[${requestId}] Error in romanNumeralHandler:`, error);

    // Update metrics with error
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds.observe(duration);
    
    logger.error(`[${requestId}] Request failed after ${duration}ms`);

    // Return appropriate error response
    res.status(500).json({
      error: 'InternalServerError',
      message: 'An unexpected error occurred while processing your request.',
      statusCode: 500,
      statusText: 'Internal Server Error',
      requestId,
      duration: `${duration}ms`
    });
  }
}; 