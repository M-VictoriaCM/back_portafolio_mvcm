import { z } from 'zod';

/**
 * Schema de validación para crear proyecto
 */
export const createProjectSchema = z.object({
  body: z.object({
    title: z.string()
      .min(1, 'El título es requerido')
      .min(2, 'El título debe tener al menos 2 caracteres')
      .max(255, 'El título no puede exceder 255 caracteres'),
    
    intro: z.string()
      .min(2, 'La introducción debe tener al menos 2 caracteres')
      .max(255, 'La introducción no puede exceder 255 caracteres')
      .optional(),
    
    description: z.string()
      .min(1, 'La descripción es requerida')
      .min(2, 'La descripción debe tener al menos 2 caracteres')
      .max(2000, 'La descripción no puede exceder 2000 caracteres'),
    
    image: z.string()
      .min(1, 'La imagen es requerida')
      .url('La imagen debe ser una URL válida'),
    
    repository: z.string()
      .min(1, 'El repositorio es requerido')
      .url('El repositorio debe ser una URL válida'),
    
    urlDemo: z.string()
      .url('La URL de demo debe ser una URL válida')
      .optional(),
    
    technologyIds: z.array(z.string().uuid('ID de tecnología inválido'))
      .optional()
  })
});

/**
 * Schema de validación para actualizar proyecto
 */
export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de proyecto inválido')
  }),
  body: z.object({
    title: z.string()
      .min(2, 'El título debe tener al menos 2 caracteres')
      .max(255, 'El título no puede exceder 255 caracteres')
      .optional(),
    
    intro: z.string()
      .min(2, 'La introducción debe tener al menos 2 caracteres')
      .max(255, 'La introducción no puede exceder 255 caracteres')
      .optional(),
    
    description: z.string()
      .min(2, 'La descripción debe tener al menos 2 caracteres')
      .max(2000, 'La descripción no puede exceder 2000 caracteres')
      .optional(),
    
    image: z.string()
      .url('La imagen debe ser una URL válida')
      .optional(),
    
    repository: z.string()
      .url('El repositorio debe ser una URL válida')
      .optional(),
    
    urlDemo: z.string()
      .url('La URL de demo debe ser una URL válida')
      .optional(),
    
    technologyIds: z.array(z.string().uuid('ID de tecnología inválido'))
      .optional()
  })
});

/**
 * Schema de validación para ID de proyecto
 */
export const projectIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de proyecto inválido')
  })
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
