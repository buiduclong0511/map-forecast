export interface IViewport {
    latitude?: number;
    longitude?: number;
    zoom?: number;
    width?: number | string;
    height?: number | string;
    pitch?: number;
}

export interface ICoordinates {
    latitude: number;
    longitude: number;
}

export interface ILocation {
    id: number;
    name: string;
    lat: number;
    lon: number;
    region: string;
    url: string;
}

export interface ICurrentWeather {
    cloud: number;
    condition: ICondition;
    temp_c: number;
    temp_f: number;
    uv: number;
    wind_kph: number;
}

export interface ICurrentLocation {
    country: string;
    lat: number;
    lon: number;
    name: string;
    region: string;
}

export interface IForecast {
    date: string;
    day: {
        maxtemp_c: number;
        mintemp_c: number;
        maxtemp_f: number;
        mintemp_f: number;
        condition: ICondition;
    };
}

export interface ICondition {
    code: number;
    icon: string;
    text: string;
}

export interface IResponseWeather {
    current: ICurrentWeather;
    forecast: {
        forecastday: IForecast[];
    };
    location: ICurrentLocation;
}
