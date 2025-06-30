import swaggerJSDoc from "swagger-jsdoc";

export const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "PlayMap API",
            version: "1.0.0",
            description:
                "API docs for PlayMap app (anonymous user & location system)",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["src/routes/*.ts", "src/controllers/*.ts"], // adjust based on your paths
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
