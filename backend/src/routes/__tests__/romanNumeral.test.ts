// import { Request, Response, NextFunction } from 'express';
// import { romanNumeralHandler } from '../romanNumeral';

// // Add Jest types
// declare global {
//   namespace jest {
//     interface Matchers<R> {
//       toHaveBeenCalledWith(...args: any[]): R;
//     }
//   }
// }

// describe('Roman Numeral Route', () => {
//   let mockRequest: Partial<Request>;
//   let mockResponse: Partial<Response>;
//   let mockNext: NextFunction;

//   beforeEach(() => {
//     mockRequest = {
//       query: {}
//     };
//     mockResponse = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn().mockReturnThis()
//     };
//     mockNext = jest.fn();
//   });

//   it('converts valid number to Roman numeral', () => {
//     mockRequest.query = { query: '42' };
//     romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       input: '42',
//       output: 'XLII'
//     });
//   });

//   it('handles invalid input', () => {
//     mockRequest.query = { query: 'invalid' };
//     romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);
//     expect(mockResponse.status).toHaveBeenCalledWith(400);
//     expect(mockResponse.send).toHaveBeenCalledWith('Invalid input. Please provide a valid number.');
//   });

//   it('handles out of range numbers', () => {
//     mockRequest.query = { query: '4000' };
//     romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);
//     expect(mockResponse.status).toHaveBeenCalledWith(400);
//     expect(mockResponse.send).toHaveBeenCalledWith('Number must be between 1 and 3999.');
//   });

//   it('handles missing query parameter', () => {
//     mockRequest.query = {};
//     romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);
//     expect(mockResponse.status).toHaveBeenCalledWith(400);
//     expect(mockResponse.send).toHaveBeenCalledWith('Please provide a number using the query parameter.');
//   });

//   it('handles non-string query parameter', () => {
//     mockRequest.query = { query: ['42'] }; // array instead of string
//     romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);
//     expect(mockResponse.status).toHaveBeenCalledWith(400);
//     expect(mockResponse.send).toHaveBeenCalledWith('Query parameter must be a string.');
//   });

//   it('handles decimal numbers', () => {
//     mockRequest.query = { query: '42.5' };
//     romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);
//     expect(mockResponse.status).toHaveBeenCalledWith(400);
//     expect(mockResponse.send).toHaveBeenCalledWith('Please provide a whole number (no decimals).');
//   });
// }); 


import { Request, Response, NextFunction } from 'express';
import { romanNumeralHandler } from '../romanNumeral';

// Mock dependencies
jest.mock('../../services/romanConverter', () => ({
  toRoman: (num: number) => {
    const map: Record<number, string> = {
      42: 'XLII',
      1: 'I',
      3999: 'MMMCMXCIX'
    };
    return map[num] || 'UNKNOWN';
  }
}));

jest.mock('../../services/logger', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

jest.mock('../../services/metrics', () => ({
  requestCount: { inc: jest.fn() },
  httpRequestDurationMicroseconds: { observe: jest.fn() }
}));

describe('Roman Numeral Route', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      query: {}
    };

    mockResponse = {
      json: jsonMock,
      status: statusMock
    };

    mockNext = jest.fn();
  });

  it('converts valid number to Roman numeral', async () => {
    mockRequest.query = { query: '42' };

    await romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        input: '42',
        output: 'XLII',
        statusCode: 200
      })
    );
  });

  it('handles invalid input', async () => {
    mockRequest.query = { query: 'invalid' };

    await romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'InvalidNumber'
      })
    );
  });

  it('handles out of range numbers', async () => {
    mockRequest.query = { query: '4000' };

    await romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'OutOfRange'
      })
    );
  });

  it('handles missing query parameter', async () => {
    mockRequest.query = {};

    await romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'MissingParameter'
      })
    );
  });

  it('handles non-string query parameter', async () => {
    mockRequest.query = { query: ['42'] as any };

    await romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'InvalidParameterType'
      })
    );
  });

  it('handles decimal numbers', async () => {
    mockRequest.query = { query: '42.5' };

    await romanNumeralHandler(mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'DecimalNumber'
      })
    );
  });
});
