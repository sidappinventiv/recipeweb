"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alcoholshelf = void 0;
const axios_1 = __importDefault(require("axios"));
const api_base_url = process.env.API_BASE_URL;
const alcoholshelf = async (ctx) => {
    try {
        const size = parseInt(ctx.params.size, 10);
        if (isNaN(size)) {
            ctx.status = 400;
            ctx.body = { error: 'Invalid size parameter' };
            return;
        }
        const response = await axios_1.default.get(`${api_base_url}/beers`, {
            params: { size },
        });
        const alcoholData = response.data;
        ctx.status = 200;
        ctx.body = alcoholData;
    }
    catch (error) {
        console.error('error fetching alcohol data:', error);
        ctx.status = 500;
        ctx.body = { error: 'error occurred while fetching alcohol data' };
    }
};
exports.alcoholshelf = alcoholshelf;
