import { z } from 'zod';

/**
 * Schema de validación para crear insignia
 */
export const createBadgeSchema = z.object({
  body: z.object({
    creadly: z.string()
      .min(1, 'El campo creadly es requerido')
      .min(2, 'El campo creadly debe tener al menos 2 caracteres')
      .max(500, 'El campo creadly no puede exceder 500 caracteres')
      .url('El campo creadly debe ser una URL válida')
  })
});

/**
 * Schema de validación para actualizar insignia
 */
export const updateBadgeSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de insignia inválido')
  }),
  body: z.object({
    creadly: z.string()
      .min(2, 'El campo creadly debe tener al menos 2 caracteres')
      .max(500, 'El campo creadly no puede exceder 500 caracteres')
      .url('El campo creadly debe ser una URL válida')
      .optional()
  })
});

/**
 * Schema de validación para ID de insignia
 */
export const badgeIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de insignia inválido')
  })
});

export type CreateBadgeInput = z.infer<typeof createBadgeSchema>;
export type UpdateBadgeInput = z.infer<typeof updateBadgeSchema>;
