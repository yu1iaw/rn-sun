import axios from 'axios';
const API_KEY = 'aa14cd663d0c4064ab164947232907';
const API_KEY2 = 'a06cebb6ff1a87ad298602609ac5cc59';

// const forecastEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${params.city}&days=${params.days}&aqi=no&alerts=no`;
const forecastEndpoint = params => `https://api.openweathermap.org/data/2.5/forecast?lat=${params.city.lat}&lon=${params.city.lon}&units=metric&appid=${API_KEY2}`;
const locationEndpoint = params => `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${params.city}`;

const apiCall = async (endpoint) => {
    const options = {
        method: "GET",
        url: endpoint
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch(e) {
        console.log(e);
        return null;
    }
}

export const fetchWeatherForecast = (params) => {
    return apiCall(forecastEndpoint(params));
}

export const fetchLocation = (params) => {
    return apiCall(locationEndpoint(params));
}