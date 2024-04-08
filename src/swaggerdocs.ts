// swagger.ts
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "V-assignment",
    },
  },
  apis: ["**/*.ts"], // Path to the API routes
};

const specs = swaggerJsdoc(options);

export default specs;
