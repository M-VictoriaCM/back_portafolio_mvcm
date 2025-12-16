import { z } from 'zod';

/**
 * Schema de validación para crear estudio
 */
export const createStudySchema = z.object({
  body: z.object({
    title: z.string()
      .min(2, 'El título debe tener al menos 2 caracteres')
      .max(255),

    institution: z.string()
      .min(2)
      .max(255),

    startYear: z.number()
      .int('El año debe ser un número entero')
      .min(1900, 'El año debe ser mayor o igual a 1900')
      .max(new Date().getFullYear(), 'El año no puede ser mayor al actual')
      .optional()
      .nullable(),

    endYear: z.number()
      .int('El año debe ser un número entero')
      .min(1900, 'El año debe ser mayor o igual a 1900')
      .max(new Date().getFullYear() + 10, 'El año no puede ser más de 10 años en el futuro')
      .optional()
      .nullable(),

    studyTypeId: z.string()
      .uuid("El tipo de estudio debe ser un UUID válido"),

    studyStateId: z.string()
      .uuid("El estado debe ser un UUID válido"),

  })
   .superRefine((data, ctx) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    if (data.startYear) {
      const StartYear = new Date(data.startYear);
      
      if (StartYear > currentDate) {
        ctx.addIssue({
          code: "custom",
          path: ["StartYear"],
          message: "La fecha de inicio no puede ser mayor a la actual"
        });
      }
    }

    if (data.startYear && data.endYear) {
      const StartYear = new Date(data.startYear);
      const endYear = new Date(data.endYear);
      
      if (StartYear > endYear) {
        ctx.addIssue({
          code: "custom",
          path: ["endYear"],
          message: "La fecha de finalización no puede ser anterior a la de inicio"
        });
      }
    }
  })
});

export  const updateStudySchema =z.object({
  params: z.object({
    id: z.string().uuid('ID de studio inválido')
  }),
 body: z.object({
     title: z.string()
      .min(2, 'El título debe tener al menos 2 caracteres')
      .max(255),

    institution: z.string()
      .min(2)
      .max(255),

    startYear: z.number()
      .int('El año debe ser un número entero')
      .min(1900, 'El año debe ser mayor o igual a 1900')
      .max(new Date().getFullYear(), 'El año no puede ser mayor al actual')
      .optional()
      .nullable(),

    endYear: z.number()
      .int('El año debe ser un número entero')
      .min(1900, 'El año debe ser mayor o igual a 1900')
      .max(new Date().getFullYear() + 10, 'El año no puede ser más de 10 años en el futuro')
      .optional()
      .nullable(),

    studyTypeId: z.string()
      .uuid("El tipo de estudio debe ser un UUID válido"),

    studyStateId: z.string()
      .uuid("El estado debe ser un UUID válido"),
  })
  .superRefine((data, ctx) => {
    const currentYear = new Date().getFullYear();
    
    if (data.startYear && data.startYear > currentYear) {
      ctx.addIssue({
        code: "custom",
        path: ["startYear"],
        message: "El año de inicio no puede ser mayor al actual"
      });
    }

    if (data.startYear && data.endYear) {
      if (data.startYear > data.endYear) {
        ctx.addIssue({
          code: "custom",
          path: ["endYear"],
          message: "El año de finalización no puede ser anterior al de inicio"
        });
      }
    }
  })
});

export const studyIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de estudio inválido')
  })
})

export type CreateStudyInput = z.infer<typeof createStudySchema>;
export type UpdateStudyInput = z.infer<typeof updateStudySchema>;        