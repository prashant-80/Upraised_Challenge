const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IMF Gadget API',
      version: '1.0.0',
      description: 'API for managing IMF gadgets',
    },
    servers: [
      {
       url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            username: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'AGENT'] },
          },
        },
        Gadget: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            codename: { type: 'string' },
            description: { type: 'string' },
            status: {
              type: 'string',
              enum: ['AVAILABLE', 'DEPLOYED', 'DESTROYED', 'DECOMMISSIONED'],
            },
            decommissionedAt: { type: 'string', format: 'date-time' },
            missionSuccessProbability: { type: 'number' },
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
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);