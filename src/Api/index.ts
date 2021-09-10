import axios from "axios";
const queryString = require("query-string");

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_WEATHER_API_URL,

    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },

    paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use((config) => {
    return config;
});

axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
});

export default axiosClient;
export * from "./weather";
