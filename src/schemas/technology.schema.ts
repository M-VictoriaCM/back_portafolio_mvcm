import { z } from 'zod';

/**
 * Schema de validación para crear tecnología
 */
export const createTechnologySchema = z.object({
  body: z.object({
    nombre: z.string()
      .min(1, 'El nombre es requerido')
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(255, 'El nombre no puede exceder 255 caracteres'),
    
    image: z.string()
      .min(1, 'La imagen es requerida')
      .url('La imagen debe ser una URL válida'),
    
    categoryId: z.string()
      .min(1, 'La categoría es requerida')
      .uuid('ID de categoría inválido')
  })
});

/**
 * Schema de validación para actualizar tecnología
 */
export const updateTechnologySchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de tecnología inválido')
  }),
  body: z.object({
    nombre: z.string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(255, 'El nombre no puede exceder 255 caracteres')
      .optional(),
    
    image: z.string()
      .url('La imagen debe ser una URL válida')
      .optional(),
    
    categoryId: z.string()
      .uuid('ID de categoría inválido')
      .optional()
  })
});

/**
 * Schema de validación para ID de tecnología
 */
export const technologyIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de tecnología inválido')
  })
});

export type CreateTechnologyInput = z.infer<typeof createTechnologySchema>;
export type UpdateTechnologyInput = z.infer<typeof updateTechnologySchema>;
