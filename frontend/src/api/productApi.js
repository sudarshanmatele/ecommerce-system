import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

export const getProducts = () => {
    return axios.get(API_URL);
};

export const getProductById = (productId) => {
    return axios.get(`${API_URL}/${productId}`);
};

export const createProduct = (product) => {
    return axios.post(API_URL, product);
};

export const updateProduct = (productId, product) => {
    return axios.put(`${API_URL}/${productId}`, product);
};

export const deactivateProduct = (productId) => {
    return axios.put(`${API_URL}/${productId}/deactivate`);
};