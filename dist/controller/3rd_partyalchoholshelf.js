"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAlcohol = exports.alcoholshelf = void 0;
const axios_1 = __importDefault(require("axios"));
//display the radom alcohol available in the shelf :)
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
const addAlcohol = async (ctx) => {
    var _a, _b;
    try {
        const { name, type, alcoholContent } = ctx.request.body;
        const response = await axios_1.default.post(`${api_base_url}beers`, {
            name,
            type,
            alcoholContent,
        });
        ctx.status = response.status;
        ctx.body = response.data;
    }
    catch (error) {
        console.error('Error adding alcohol item:', error);
        if (axios_1.default.isAxiosError(error)) {
            const axiosError = error;
            ctx.status = ((_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
            ctx.body = ((_b = axiosError.response) === null || _b === void 0 ? void 0 : _b.data) || { error: 'Error occurred while adding alcohol item' };
        }
        else {
            ctx.status = 500;
            ctx.body = { error: 'Error occurred while adding alcohol item' };
        }
    }
};
exports.addAlcohol = addAlcohol;
