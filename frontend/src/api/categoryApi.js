import axios from "axios";

const API_URL = "http://localhost:8080/api/categories";

export const getCategories = () => {
    return axios.get(API_URL);
};

export const createCategory = (category) => {
    return axios.post(API_URL, category);
};

export const updateCategory = (id, category) => {
    return axios.put(`${API_URL}/${id}`, category);
};

export const deactivateCategory = (id) => {
    return axios.put(`${API_URL}/${id}/deactivate`);
};