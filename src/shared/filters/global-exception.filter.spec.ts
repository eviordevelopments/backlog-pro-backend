import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GlobalExceptionFilter } from '.';
import { BaseDomainException } from '..';

class TestDomainException extends BaseDomainException {
  constructor() {
    super('TEST_001', 'Test domain exception');
  }
}

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockResponse: any;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    } as any;
  });

  it('should handle BaseDomainException and return formatted error without stack trace', () => {
    const exception = new TestDomainException();
    
    filter.catch(exception, mockArgumentsHost);
    
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      codigo: 'TEST_001',
      mensaje: 'Test domain exception',
      timestamp: expect.any(String),
    });
    
    const jsonCall = mockResponse.json.mock.calls[0][0];
    expect(jsonCall).not.toHaveProperty('stack');
  });

  it('should handle HttpException', () => {
    const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);
    
    filter.catch(exception, mockArgumentsHost);
    
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      codigo: 'HTTP_ERROR',
      mensaje: 'Not found',
      timestamp: expect.any(String),
    });
  });

  it('should handle unknown exceptions without exposing stack traces', () => {
    const exception = new Error('Unknown error');
    
    filter.catch(exception, mockArgumentsHost);
    
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({
      codigo: 'INTERNAL_ERROR',
      mensaje: 'Error interno del servidor',
      timestamp: expect.any(String),
    });
    
    const jsonCall = mockResponse.json.mock.calls[0][0];
    expect(jsonCall).not.toHaveProperty('stack');
    expect(jsonCall.mensaje).not.toContain('Unknown error');
  });

  it('should include timestamp in ISO format', () => {
    const exception = new TestDomainException();
    const beforeTime = new Date().toISOString();
    
    filter.catch(exception, mockArgumentsHost);
    
    const afterTime = new Date().toISOString();
    const jsonCall = mockResponse.json.mock.calls[0][0];
    
    expect(jsonCall.timestamp).toBeDefined();
    expect(new Date(jsonCall.timestamp).toISOString()).toBe(jsonCall.timestamp);
    expect(jsonCall.timestamp >= beforeTime).toBe(true);
    expect(jsonCall.timestamp <= afterTime).toBe(true);
  });
});
