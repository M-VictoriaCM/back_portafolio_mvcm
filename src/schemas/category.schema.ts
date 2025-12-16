import { z } from 'zod';

/**
 * Schema de validación para crear categoría
 */
export const createCategorySchema = z.object({
  body: z.object({
    title: z.string()
      .min(1, 'El título es requerido')
      .min(2, 'El título debe tener al menos 2 caracteres')
      .max(255, 'El título no puede exceder 255 caracteres'),
    
    icon: z.string()
      .min(2, 'El ícono debe tener al menos 2 caracteres')
      .max(255, 'El ícono no puede exceder 255 caracteres')
      .optional()
      .default('default-icon')
  })
});

/**
 * Schema de validación para actualizar categoría
 */
export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de categoría inválido')
  }),
  body: z.object({
    title: z.string()
      .min(2, 'El título debe tener al menos 2 caracteres')
      .max(255, 'El título no puede exceder 255 caracteres')
      .optional(),
    
    icon: z.string()
      .min(2, 'El ícono debe tener al menos 2 caracteres')
      .max(255, 'El ícono no puede exceder 255 caracteres')
      .optional()
  })
});

/**
 * Schema de validación para ID de categoría
 */
export const categoryIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de categoría inválido')
  })
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
