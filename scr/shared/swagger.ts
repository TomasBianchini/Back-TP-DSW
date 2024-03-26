import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
  },
  servers: [
    {
      url: "https://back-tp-dsw.onrender.com/api",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
        user: {
            type: "object",
            required: ["user_name", "email", "password", "address", "type", "id", "createdAt", "updatedAt"],
            properties: {
            user_name: {
                type: "string",
                },
                email: {
                type: "string",
                },
                password: {
                    type: "string",
                },
                address: {
                    type: "string",
                },
                type: {
                    type: "string",
                },
                id: {
                    type: "string",
                },
                createdAt: {
                    type: "Date",
                },
                updatedAt: {
                    type: "Date",
                },
                state:{
                    type: "string",
                }
            },
        },
        seller: {
            allOf: [
            { $ref: "#/components/schemas/user" },
            {
                type: "object",
                properties: {
                shop_name: { type: "string" },
                cuil: { type: "string" },
                cbu: { type: "string" }
                }
            },
            { required: ["shop_name", "cuil", "cbu"] }
            ]
        },
        category: {
            type: "object",
            required: ["category", "id", "createdAt", "updatedAt"],
            properties: {
            category: {
                type: "string",
            },
            id: {
                type: "string",
                },
                createdAt: {
                    type: "Date",
                },
                updatedAt: {
                    type: "Date",
                },
                state:{
                    type: "string",
                }
            },
        },
        discount:{
            type: "object",
            required: ["value", "id", "createdAt", "updatedAt", "category"],
            properties:{
                value: {
                    type: "number",
                },
                id: {
                    type: "string",
                },
                createdAt: {
                    type: "Date",
                },
                updatedAt: {
                    type: "Date",
                },
                state:{
                    type: "string",
                },
                category: { $ref: "#/components/schemas/category" },
            },
        },
        shipping: {
            type: "object",
            required: ["shipmethod", "cancellationDeadline", "price", "estimatedTime","id", "createdAt", "updatedAt"],
            properties: {
                shipmethod: {
                    type: "string",
                },
                cancellationDeadline: {
                    type: "number",
                },
                price: {
                    type: "number",
                },
                estimatedTime: {
                    type: "number",
                },
                id: {
                    type: "string",
                },
                createdAt: {
                    type: "Date",
                },
                updatedAt: {
                    type: "Date",
                },
                state:{
                    type: "string",
                }
            },
        },
        product:{
            type: "object",
            required: ["name", "price", "description", "img_url", "category", "seller","id", "createdAt", "updatedAt", "category"],
            properties:{
                name: {
                    type: "string",
                },
                price: {
                    type: "string",
                },
                description: {
                    type: "string",
                },
                img_url: {
                    type: "string",
                },
                seller: {
                    $ref: "#/components/schemas/seller"
                },
                id: {
                    type: "string",
                },
                createdAt: {
                    type: "Date",
                },
                updatedAt: {
                    type: "Date",
                },
                state:{
                    type: "string",
                },
                category: { $ref: "#/components/schemas/category" },
            },
        },
        review:{
            type: "object",
            required: ["comment", "rating", "product", "id", "createdAt", "updatedAt"],
            properties:{
                comment: {
                    type: "string",
                },
                rating: {
                    type: "number",
                },
                product: {
                    $ref: "#/components/schemas/product"
                },
                id: {
                    type: "string",
                },
                createdAt: {
                    type: "Date",
                },
                updatedAt: {
                    type: "Date",
                },
                state:{
                    type: "string",
                }
            },
        }, 
        payment_type:{
            type: "object",
            required: ["payment_type", "id", "createdAt", "updatedAt"],
            properties:{
                payment_type: {
                    type: "string",
                },
                id: {
                    type: "string",
                },
                createdAt: {
                    type: "Date",
                },
                updatedAt: {
                    type: "Date",
                },
                state:{
                    type: "string",
                }
            },
        },
        cart:{
            type: "object",
            required: ["total", "payment_type", "shipping", "user", "id", "createdAt", "updatedAt"],
            properties:{
                total: {
                    type: "number",
                },
                payment_type: {
                    $ref: "#/components/schemas/payment_type"
                },
                shipping: {
                    $ref: "#/components/schemas/shipping"
                },
                user: {
                    $ref: "#/components/schemas/user"
                },
                id: {
                    type: "string",
                },
                createdAt: {
                    type: "Date",
                },
                updatedAt: {
                    type: "Date",
                },
                state:{
                    type: "string",
                }
            },
        },
        order:{
            type: "object",
            required: ["quantity", "product", "subtotal", "id", "createdAt", "updatedAt", "cart"],
            properties:{
                quantity: {
                    type: "number",
                },
                product: {
                    $ref: "#/components/schemas/product"
                },
                subtotal: {
                    type: "number",
                },
                cart: {
                    $ref: "#/components/schemas/cart"
                },
                id: {
                    type: "string",
                },
                createdAt: {
                    type: "Date",
                },
                updatedAt: {
                    type: "Date",
                },
            },
        }
      }
    },
  };

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  apis: ["./**/**/*routes.ts"],
};

export default swaggerJSDoc(swaggerOptions);