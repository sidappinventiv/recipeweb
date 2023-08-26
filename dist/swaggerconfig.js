"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Recipe Book',
        version: '1.0.0',
        description: 'recipes on the way',
    },
    servers: [
        {
            url: 'http://localhost:3000',
        },
    ],
};
const options = {
    swaggerDefinition,
    apis: ['./routes/commonroute.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
