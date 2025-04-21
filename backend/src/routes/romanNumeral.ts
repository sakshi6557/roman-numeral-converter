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

import { Request, Response } from 'express';
import { toRoman } from '../services/romanConverter';
import { requestCount, httpRequestDurationMicroseconds } from '../services/metrics';
import logger from '../services/logger';

/**
 * Type definition for error response
 * @interface ErrorResponse
 * @property {string} error - Error type identifier
 * @property {string} message - Human-readable error message
 * @property {number} statusCode - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {string} requestId - Unique request identifier
 * @property {string} [duration] - Request duration in milliseconds
 * @property {string} [input] - Input value that caused the error
 */
interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  statusText: string;
  requestId: string;
  duration?: string;
  input?: string;
}

/**
 * Type definition for success response
 * @interface SuccessResponse
 * @property {string} input - Input number
 * @property {string} output - Roman numeral result
 * @property {number} statusCode - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {string} requestId - Unique request identifier
 * @property {string} duration - Request duration in milliseconds
 */
interface SuccessResponse {
  input: string;
  output: string;
  statusCode: number;
  statusText: string;
  requestId: string;
  duration: string;
}

/**
 * Handles requests to convert numbers to Roman numerals.
 * Validates input and returns appropriate responses.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {Promise<void>}
 * 
 * @response {200} Success
 * @responseExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "input": "42",
 *       "output": "XLII",
 *       "statusCode": 200,
 *       "statusText": "OK",
 *       "requestId": "abc123",
 *       "duration": "5ms"
 *     }
 * 
 * @response {400} BadRequest
 * @responseExample {json} BadRequest-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "MissingParameter",
 *       "message": "Please provide a number using the query parameter.",
 *       "statusCode": 400,
 *       "statusText": "Bad Request",
 *       "requestId": "abc123",
 *       "duration": "2ms"
 *     }
 * 
 * @response {500} InternalServerError
 * @responseExample {json} InternalServerError-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "InternalServerError",
 *       "message": "An unexpected error occurred while processing your request.",
 *       "statusCode": 500,
 *       "statusText": "Internal Server Error",
 *       "requestId": "abc123",
 *       "duration": "10ms"
 *     }
 */
export const romanNumeralHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  logger.info(`[${requestId}] Starting Roman numeral conversion request`);
  logger.debug(`[${requestId}] Request query: ${JSON.stringify(req.query)}`);
  
  try {
    const query = req.query.query;

    // Validate query parameter exists
    if (!query) {
      logger.warn(`[${requestId}] Missing query parameter`);
      const errorResponse: ErrorResponse = {
        error: 'MissingParameter',
        input: '',
        message: 'Please provide a number using the query parameter.',
        statusCode: 400,
        statusText: 'Bad Request',
        requestId
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Validate query parameter type
    if (typeof query !== 'string') {
      logger.warn(`[${requestId}] Invalid query parameter type: ${typeof query}`);
      const errorResponse: ErrorResponse = {
        error: 'InvalidParameterType',
        input: '',
        message: 'Query parameter must be a string.',
        statusCode: 400,
        statusText: 'Bad Request',
        requestId
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Parse and validate number
    const num = parseFloat(query);
    if (isNaN(num)) {
      logger.warn(`[${requestId}] Invalid number input: ${query}`);
      const errorResponse: ErrorResponse = {
        error: 'InvalidNumber',
        input: query,
        message: 'Invalid input. Please provide a valid number.',
        statusCode: 400,
        statusText: 'Bad Request',
        requestId
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Validate whole number
    if (!Number.isInteger(num)) {
      logger.warn(`[${requestId}] Decimal number input: ${num}`);
      const errorResponse: ErrorResponse = {
        error: 'DecimalNumber',
        input: query,
        message: 'Please provide a whole number (no decimals).',
        statusCode: 400,
        statusText: 'Bad Request',
        requestId
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Validate number range
    if (num < 1 || num > 3999) {
      logger.warn(`[${requestId}] Number out of range: ${num}`);
      const errorResponse: ErrorResponse = {
        error: 'OutOfRange',
        input: query,
        message: 'Number must be between 1 and 3999.',
        statusCode: 400,
        statusText: 'Bad Request',
        requestId
      };
      res.status(400).json(errorResponse);
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
    const successResponse: SuccessResponse = {
      input: String(num),
      output: result,
      statusCode: 200,
      statusText: 'OK',
      requestId,
      duration: `${duration}ms`
    };
    res.status(200).json(successResponse);

  } catch (error: unknown) {
    // Log the error for debugging
    logger.error(`[${requestId}] Error in romanNumeralHandler:`, error);

    // Update metrics with error
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds.observe(duration);
    
    logger.error(`[${requestId}] Request failed after ${duration}ms`);

    // Return appropriate error response
    const errorResponse: ErrorResponse = {
      error: 'InternalServerError',
      message: 'An unexpected error occurred while processing your request.',
      statusCode: 500,
      statusText: 'Internal Server Error',
      requestId,
      duration: `${duration}ms`
    };
    res.status(500).json(errorResponse);
  }
}; 