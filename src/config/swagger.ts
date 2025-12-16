import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Portfolio API',
      version: '1.0.0',
      description: 'API REST para gestión de portafolio personal con proyectos, tecnologías, estudios e insignias',
      contact: {
        name: 'API Support',
        email: 'soporte@portfolio.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api.portfolio.com',
        description: 'Servidor de producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT de autenticación',
        },
      },
      schemas: {
        Category: {
          type: 'object',
          required: ['id', 'title', 'icon'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único de la categoría',
            },
            title: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
              description: 'Nombre de la categoría',
            },
            icon: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
              description: 'Ícono de la categoría',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'ID del usuario propietario',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Project: {
          type: 'object',
          required: ['id', 'title', 'description', 'image', 'repository'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
            },
            intro: {
              type: 'string',
              maxLength: 255,
            },
            description: {
              type: 'string',
              minLength: 2,
              maxLength: 2000,
            },
            image: {
              type: 'string',
              format: 'uri',
            },
            repository: {
              type: 'string',
              format: 'uri',
            },
            urlDemo: {
              type: 'string',
              format: 'uri',
            },
            technologies: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Technology',
              },
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Technology: {
          type: 'object',
          required: ['id', 'nombre', 'image', 'categoryId'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            nombre: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
            },
            image: {
              type: 'string',
              format: 'uri',
            },
            categoryId: {
              type: 'string',
              format: 'uuid',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Badge: {
          type: 'object',
          required: ['id', 'creadly'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            creadly: {
              type: 'string',
              format: 'uri',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Study: {
          type: 'object',
          required: ['id', 'title', 'institution'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
            },
            institution: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
            },
            startYear: {
              type: 'integer',
              minimum: 1900,
            },
            endYear: {
              type: 'integer',
              minimum: 1900,
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Portfolio API Documentation',
  }));

  // JSON endpoint para la especificación
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Documentación Swagger disponible en http://localhost:3000/api-docs');
};

export default swaggerSpec;
