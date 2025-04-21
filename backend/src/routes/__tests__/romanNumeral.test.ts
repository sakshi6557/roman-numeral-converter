import { Request, Response } from 'express';
import { romanNumeralHandler } from '../romanNumeral';
import { toRoman } from '../../services/romanConverter';
import { requestCount, httpRequestDurationMicroseconds } from '../../services/metrics';

// Mock dependencies
jest.mock('../../services/romanConverter');
jest.mock('../../services/metrics');

describe('Roman Numeral Route Handler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request mock
    mockRequest = {
      query: {},
      params: {},
      body: {}
    };

    // Setup response mock
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };

    // Setup next function mock
    mockNext = jest.fn();
  });

  it('should convert valid number to roman numeral', async () => {
    // Setup
    const mockNumber = '42';
    const mockRoman = 'XLII';
    mockRequest.query = { query: mockNumber };
    (toRoman as jest.Mock).mockReturnValue(mockRoman);

    // Execute
    await romanNumeralHandler(mockRequest as Request, mockResponse as Response);

    // Verify
    expect(toRoman).toHaveBeenCalledWith(42);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        input: mockNumber,
        output: mockRoman,
        statusCode: 200,
        statusText: 'OK',
        requestId: expect.any(String),
        duration: expect.stringMatching(/\d+ms/)
      })
    );
    expect(requestCount.inc).toHaveBeenCalled();
    expect(httpRequestDurationMicroseconds.observe).toHaveBeenCalled();
  });

  it('should handle missing query parameter', async () => {
    // Setup
    mockRequest.query = {};

    // Execute
    await romanNumeralHandler(mockRequest as Request, mockResponse as Response);

    // Verify
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'MissingParameter',
        message: 'Please provide a number using the query parameter.',
        statusCode: 400,
        statusText: 'Bad Request',
        requestId: expect.any(String),
        input: ''
      })
    );
    expect(toRoman).not.toHaveBeenCalled();
  });

  it('should handle invalid number format', async () => {
    // Setup
    mockRequest.query = { query: 'not-a-number' };

    // Execute
    await romanNumeralHandler(mockRequest as Request, mockResponse as Response);

    // Verify
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'InvalidNumber',
        message: 'Invalid input. Please provide a valid number.',
        statusCode: 400,
        statusText: 'Bad Request',
        requestId: expect.any(String),
        input: 'not-a-number'
      })
    );
    expect(toRoman).not.toHaveBeenCalled();
  });

  it('should handle number out of range', async () => {
    // Setup
    mockRequest.query = { query: '4000' };

    // Execute
    await romanNumeralHandler(mockRequest as Request, mockResponse as Response);

    // Verify
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'OutOfRange',
        message: 'Number must be between 1 and 3999.',
        statusCode: 400,
        statusText: 'Bad Request',
        requestId: expect.any(String),
        input: '4000'
      })
    );
    expect(toRoman).not.toHaveBeenCalled();
  });

  it('should handle conversion error', async () => {
    // Setup
    const mockNumber = '42';
    mockRequest.query = { query: mockNumber };
    (toRoman as jest.Mock).mockImplementation(() => {
      throw new Error('Conversion failed');
    });

    // Execute
    await romanNumeralHandler(mockRequest as Request, mockResponse as Response);

    // Verify
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'InternalServerError',
        message: 'An unexpected error occurred while processing your request.',
        statusCode: 500,
        statusText: 'Internal Server Error',
        requestId: expect.any(String),
        duration: expect.stringMatching(/\d+ms/)
      })
    );
  });

  it('should handle metrics recording error gracefully', async () => {
    // Setup
    const mockNumber = '42';
    const mockRoman = 'XLII';
    mockRequest.query = { query: mockNumber };
    (toRoman as jest.Mock).mockReturnValue(mockRoman);
    (httpRequestDurationMicroseconds.observe as jest.Mock).mockImplementation(() => {
      // Simulate error without throwing
      return false;
    });

    // Execute
    await romanNumeralHandler(mockRequest as Request, mockResponse as Response);

    // Verify
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        input: mockNumber,
        output: mockRoman,
        statusCode: 200,
        statusText: 'OK',
        requestId: expect.any(String),
        duration: expect.stringMatching(/\d+ms/)
      })
    );
    // Even if metrics recording fails, the conversion should still succeed
  });
});
