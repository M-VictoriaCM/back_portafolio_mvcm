import { createCategorySchema, updateCategorySchema } from '../category.schema';
import { createProjectSchema, updateProjectSchema } from '../project.schema';
import { createBadgeSchema } from '../badge.schema';

describe('Schemas de Validación', () => {
  describe('Category Schema', () => {
    it('debería validar categoría válida', () => {
      const validData = {
        body: {
          title: 'Frontend',
          icon: 'icon-frontend'
        }
      };

      const result = createCategorySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('debería rechazar título muy corto', () => {
      const invalidData = {
        body: {
          title: 'A',
          icon: 'icon'
        }
      };

      const result = createCategorySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('al menos 2 caracteres');
      }
    });

    it('debería usar icon por defecto', () => {
      const dataWithoutIcon = {
        body: {
          title: 'Backend'
        }
      };

      const result = createCategorySchema.safeParse(dataWithoutIcon);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.body.icon).toBe('default-icon');
      }
    });
  });

  describe('Project Schema', () => {
    it('debería validar proyecto válido', () => {
      const validData = {
        body: {
          title: 'Mi Proyecto',
          description: 'Descripción del proyecto',
          image: 'https://example.com/image.png',
          repository: 'https://github.com/user/repo',
          urlDemo: 'https://demo.com',
          technologyIds: [
            '123e4567-e89b-12d3-a456-426614174000'
          ]
        }
      };

      const result = createProjectSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('debería rechazar URL de imagen inválida', () => {
      const invalidData = {
        body: {
          title: 'Proyecto',
          description: 'Descripción',
          image: 'not-a-url',
          repository: 'https://github.com/user/repo'
        }
      };

      const result = createProjectSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const imageError = result.error.issues.find(
          issue => issue.path.includes('image')
        );
        expect(imageError?.message).toContain('URL válida');
      }
    });

    it('debería rechazar UUID de tecnología inválido', () => {
      const invalidData = {
        body: {
          title: 'Proyecto',
          description: 'Descripción válida',
          image: 'https://example.com/image.png',
          repository: 'https://github.com/user/repo',
          technologyIds: ['not-a-uuid']
        }
      };

      const result = createProjectSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('debería permitir campos opcionales', () => {
      const minimalData = {
        body: {
          title: 'Proyecto Mínimo',
          description: 'Descripción mínima',
          image: 'https://example.com/image.png',
          repository: 'https://github.com/user/repo'
        }
      };

      const result = createProjectSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });
  });

  describe('Badge Schema', () => {
    it('debería validar insignia válida', () => {
      const validData = {
        body: {
          creadly: 'https://www.credly.com/badges/abc123'
        }
      };

      const result = createBadgeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('debería rechazar URL de creadly inválida', () => {
      const invalidData = {
        body: {
          creadly: 'not-a-url'
        }
      };

      const result = createBadgeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('URL válida');
      }
    });

    it('debería rechazar creadly vacío', () => {
      const emptyData = {
        body: {
          creadly: ''
        }
      };

      const result = createBadgeSchema.safeParse(emptyData);
      expect(result.success).toBe(false);
    });
  });
});
