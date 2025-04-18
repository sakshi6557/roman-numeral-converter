import { Request, Response, NextFunction } from 'express';
import { romanNumeralHandler } from '../romanNumeral';

// Add Jest types
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWith(...args: any[]): R;
    }
  }
}

describe('Roman Numeral Route', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      query: {}
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  it('converts valid number to Roman numeral', () => {
    mockRequest.query = { query: '42' };
    romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.json).toHaveBeenCalledWith({
      input: '42',
      output: 'XLII'
    });
  });

  it('handles invalid input', () => {
    mockRequest.query = { query: 'invalid' };
    romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith('Invalid input. Please provide a valid number.');
  });

  it('handles out of range numbers', () => {
    mockRequest.query = { query: '4000' };
    romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith('Number must be between 1 and 3999.');
  });

  it('handles missing query parameter', () => {
    mockRequest.query = {};
    romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith('Please provide a number using the query parameter.');
  });

  it('handles non-string query parameter', () => {
    mockRequest.query = { query: ['42'] }; // array instead of string
    romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith('Query parameter must be a string.');
  });

  it('handles decimal numbers', () => {
    mockRequest.query = { query: '42.5' };
    romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith('Please provide a whole number (no decimals).');
  });
}); 