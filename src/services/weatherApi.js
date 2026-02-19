import { formatTime } from '../utils/helpers';

// Mock Data for development and fallback
const MOCK_WEATHER = {
    city: 'Chennai',
    country: 'IN',
    current: {
        temp: 32,
        condition: 'Sunny',
        icon: '01d',
        humidity: 65,
        windSpeed: 12,
        pressure: 1012,
        visibility: 10,
        feelsLike: 36,
        sunrise: 1709255400,
        sunset: 1709298600,
        dt: 1709280000,
        precipitation: 0,
        uvIndex: 4
    },
    forecast: [
        { dt: 1709341200, temp: 31, icon: '01d', condition: 'Sunny' },
        { dt: 1709427600, temp: 30, icon: '02d', condition: 'Cloudy' },
        { dt: 1709514000, temp: 29, icon: '03d', condition: 'Rain' },
        { dt: 1709600400, temp: 28, icon: '04d', condition: 'Storm' },
        { dt: 1709686800, temp: 30, icon: '01d', condition: 'Clear' },
        { dt: 1709773200, temp: 32, icon: '01d', condition: 'Sunny' },
        { dt: 1709859600, temp: 33, icon: '02d', condition: 'Partly Cloudy' }
    ],
    hourly: Array.from({ length: 24 }, (_, i) => ({
        dt: 1709280000 + i * 3600,
        temp: 30 + Math.sin(i / 4) * 5,
        icon: i > 6 && i < 18 ? '01d' : '01n',
        condition: i > 6 && i < 18 ? 'Sunny' : 'Clear',
    })),
    aqi: {
        aqi: 2, // 1-5
        status: 'Moderate',
        components: {
            pm2_5: 15,
            pm10: 25,
            co: 400,
            no2: 10,
            so2: 5,
            o3: 60,
        }
    },
    rainChances: [
        { day: 'Friday', chance: 10 },
        { day: 'Saturday', chance: 20 },
        { day: 'Sunday', chance: 50 },
        { day: 'Monday', chance: 5 }
    ]
};

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

export const getCitySuggestions = async (query) => {
    if (!query || query.length < 3) return [];
    if (!API_KEY) return [];

    try {
        const res = await fetch(`${GEO_URL}?q=${query}&limit=5&appid=${API_KEY}`);
        const data = await res.json();
        return data.map(item => ({
            name: item.name,
            state: item.state,
            country: item.country,
            lat: item.lat,
            lon: item.lon
        }));
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
    }
};

export const getWeatherByCoordinates = async (lat, lon) => {
    if (!API_KEY) {
        // Fallback to mock if check fails
        return getWeatherData('Chennai');
    }

    try {
        // 1. Get Reverse Geocoding to find City Name
        const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);
        const geoData = await geoRes.json();
        const name = geoData[0]?.name || 'Current Location';
        const country = geoData[0]?.country || '';

        // 2. Get Current Weather
        const weatherRes = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        const weatherData = await weatherRes.json();

        // 3. Get Forecast (5 day / 3 hour)
        const forecastRes = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        const forecastData = await forecastRes.json();

        // 4. Get Air Quality
        const aqiRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const aqiData = await aqiRes.json();

        // Process and format data
        return processWeatherData(name, country, weatherData, forecastData, aqiData);

    } catch (error) {
        console.error('Error fetching weather by coordinates:', error);
        throw error;
    }
};





export const getWeatherData = async (city) => {
    // If no API key, return mock data
    if (!API_KEY) {
        console.warn('No API key found, using mock data');
        const mock = { ...MOCK_WEATHER, city: city || 'Chennai' };
        return new Promise((resolve) => setTimeout(() => resolve(mock), 800));
    }

    try {
        // 1. Get Coordinates
        const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
        const geoData = await geoRes.json();

        if (!geoData.length) throw new Error('City not found');
        const { lat, lon, name, country } = geoData[0];

        // 2. Get Current Weather
        const weatherRes = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        const weatherData = await weatherRes.json();

        // 3. Get Forecast (5 day / 3 hour)
        const forecastRes = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        const forecastData = await forecastRes.json();

        // 4. Get Air Quality
        const aqiRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const aqiData = await aqiRes.json();

        // Process and format data
        return processWeatherData(name, country, weatherData, forecastData, aqiData);

    } catch (error) {
        console.error('Error fetching weather:', error);
        // Fallback to mock on error for robustness during demo
        return { ...MOCK_WEATHER, city: city || 'Unknown' };
    }
};

const processWeatherData = (city, country, current, forecast, aqi) => {
    // Helper to process raw API data into our app content
    // This is a simplified transformation

    // Extract daily forecast (approximated MAX temp for the day)
    const dailyMap = new Map();

    forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const temp = Math.round(item.main.temp);

        if (!dailyMap.has(date)) {
            dailyMap.set(date, {
                dt: item.dt,
                maxTemp: temp,
                icon: item.weather[0].icon,
                condition: item.weather[0].main
            });
        } else {
            const entry = dailyMap.get(date);
            if (temp > entry.maxTemp) {
                entry.maxTemp = temp;
                // If it's the max temp time, use this icon as "day" icon
                if (item.sys.pod === 'd') {
                    entry.icon = item.weather[0].icon;
                    entry.condition = item.weather[0].main;
                }
            }
        }
    });

    const daily = Array.from(dailyMap.values()).slice(0, 7).map(d => ({
        ...d,
        temp: d.maxTemp // Use max temp for display
    }));

    const hourly = forecast.list.slice(0, 24).map(item => ({
        dt: item.dt,
        temp: Math.round(item.main.temp),
        icon: item.weather[0].icon,
        condition: item.weather[0].main
    }));

    const aqiVal = aqi.list[0].main.aqi;
    const aqiStatus = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][aqiVal - 1] || 'Unknown';

    // Extract rain chances (Max probability per day for next 4 days)
    const rainChances = [];
    const seenRainDays = new Set();

    forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const dayName = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
        const pop = Math.round(item.pop * 100);

        if (!seenRainDays.has(date)) {
            seenRainDays.add(date);
            rainChances.push({ day: dayName, chance: pop });
        } else {
            // Update max chance for the day if we find a higher one in the 3h blocks
            const dayEntry = rainChances.find(d => d.day === dayName);
            if (dayEntry && pop > dayEntry.chance) {
                dayEntry.chance = pop;
            }
        }
    });

    return {
        city,
        country,
        current: {
            temp: Math.round(current.main.temp),
            condition: current.weather[0].main,
            icon: current.weather[0].icon,
            humidity: current.main.humidity,
            windSpeed: current.wind.speed,
            pressure: current.main.pressure,
            visibility: current.visibility / 1000,
            feelsLike: Math.round(current.main.feels_like),
            sunrise: current.sys.sunrise,
            sunset: current.sys.sunset,
            dt: current.dt,
            uvIndex: 9, // Standard API doesn't allow free UV. Mocking as per reference for visuals.
            precipitation: forecast.list[0].pop * 100 // Current Probability %
        },
        forecast: daily,
        hourly: hourly,
        aqi: {
            aqi: aqiVal,
            status: aqiStatus,
            components: aqi.list[0].components
        },
        rainChances: rainChances.slice(0, 4) // Return next 4 days
    };
};
