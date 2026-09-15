const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fintech Backend API Documentation',
      version: '1.0.0',
      description: 'Production-ready Banking & Ledger API with atomic transactions, idempotency, and concurrency controls.',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token', 
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // 
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;