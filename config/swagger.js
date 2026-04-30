import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Digital Banking API",
      version: "1.0.0",
      description: "API documentation for your banking system"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: ["./controller/*.js", "./routes/*.js"] // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;