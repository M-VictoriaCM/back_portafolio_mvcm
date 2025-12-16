import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { validateRequest } from '../validateRequest';

describe('validateRequest middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
  });

  it('debería pasar la validación con datos válidos', async () => {
    const schema = z.object({
      body: z.object({
        name: z.string(),
        age: z.number()
      })
    });

    mockRequest.body = { name: 'John', age: 30 };

    const middleware = validateRequest(schema);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('debería rechazar datos inválidos con error 400', async () => {
    const schema = z.object({
      body: z.object({
        email: z.string().email(),
        age: z.number().min(18)
      })
    });

    mockRequest.body = { email: 'invalid-email', age: 15 };

    const middleware = validateRequest(schema);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Errores de validación',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: expect.any(String),
            message: expect.any(String)
          })
        ])
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('debería validar params correctamente', async () => {
    const schema = z.object({
      params: z.object({
        id: z.string().uuid()
      })
    });

    mockRequest.params = { id: '123e4567-e89b-12d3-a456-426614174000' };

    const middleware = validateRequest(schema);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('debería rechazar UUID inválido', async () => {
    const schema = z.object({
      params: z.object({
        id: z.string().uuid('ID inválido')
      })
    });

    mockRequest.params = { id: 'not-a-uuid' };

    const middleware = validateRequest(schema);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Errores de validación',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'params.id',
            message: 'ID inválido'
          })
        ])
      })
    );
  });

  it('debería manejar errores no esperados', async () => {
    const schema = z.object({
      body: z.object({
        name: z.string()
      })
    });

    // Forzar un error no relacionado con Zod
    mockRequest.body = null;

    const middleware = validateRequest(schema);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor'
    });
  });
});
