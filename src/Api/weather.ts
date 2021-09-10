import axiosClient from ".";
import { ILocation, IResponseWeather } from "src/Interface";

export const weatherApi = {
    searchLocation(keySearch: string): Promise<ILocation[]> {
        const url = `search.json?key=${process.env.REACT_APP_MAP_API_KEY}&q=${keySearch}`;
        return axiosClient.get(url);
    },
    getCurrentWeather(q: string): Promise<IResponseWeather> {
        const url = `forecast.json?key=${process.env.REACT_APP_MAP_API_KEY}&q=${q}&days=3`;
        return axiosClient.get(url);
    },
};
