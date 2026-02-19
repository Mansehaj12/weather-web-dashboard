
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getWeatherData, getWeatherByCoordinates } from '../services/weatherApi';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
    const [city, setCity] = useState(null); // Start with null to avoid flash
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Cache to store basic info for cities: { 'Chennai': { temp: 29, icon: '01d' } }
    const [weatherCache, setWeatherCache] = useState({});

    // Initial list
    const [recentCities, setRecentCities] = useState([
        'Chennai', 'Ajmer', 'Bangalore', 'Bhopal', 'Delhi', 'Mumbai', 'New York', 'London'
    ]);

    const fetchWeather = async (cityName) => {
        if (!cityName) return; // Guard clause
        setLoading(true);
        setError(null);
        try {
            const data = await getWeatherData(cityName);
            setWeatherData(data);

            // Update cache with new data
            setWeatherCache(prev => ({
                ...prev,
                [data.city]: {
                    temp: data.current.temp,
                    condition: data.current.condition,
                    icon: data.current.icon
                }
            }));

            // Update recent cities list to move current to front if desired, 
            // or just ensure it exists. For now, simple existence check.
            setRecentCities(prev => {
                const filtered = prev.filter(c => c !== data.city);
                return [data.city, ...filtered].slice(0, 10);
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Initial Load Effect (Geolocation)
    useEffect(() => {
        const initWeather = async () => {
            console.log("Initializing Weather... Checking Geolocation");
            setLoading(true);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        console.log("Geolocation permission granted. Coords:", position.coords);
                        try {
                            const data = await getWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
                            console.log("Weather by Coords fetched successfully:", data);
                            setWeatherData(data);
                            setCity(data.city); // This sets the city

                            // Update cache
                            setWeatherCache(prev => ({
                                ...prev,
                                [data.city]: {
                                    temp: data.current.temp,
                                    condition: data.current.condition,
                                    icon: data.current.icon
                                }
                            }));
                            setRecentCities(prev => {
                                const filtered = prev.filter(c => c !== data.city);
                                return [data.city, ...filtered].slice(0, 10);
                            });
                            setLoading(false);
                        } catch (e) {
                            console.error("Geo fetch failed:", e);
                            // If geo fails, fallback to Chennai
                            fetchWeather('Chennai');
                            setCity('Chennai');
                        }
                    },
                    (err) => {
                        console.warn("Location denied/error:", err);
                        fetchWeather('Chennai');
                        setCity('Chennai');
                    }
                );
            } else {
                console.log("Geolocation not supported");
                fetchWeather('Chennai');
                setCity('Chennai');
            }
        };

        if (!city) {
            initWeather();
        }
    }, []); // Run once on mount

    // Respond to manual City changes
    useEffect(() => {
        if (city) {
            // Only fetch if we don't have data OR if the data we have is NOT for this city
            // This prevents double fetch on initial load (since initWeather sets both data and city)
            if (!weatherData || weatherData.city !== city) {
                fetchWeather(city);
            }

            const interval = setInterval(() => {
                fetchWeather(city);
            }, 5 * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, [city]);

    // Fetch data for the scroller list in background
    useEffect(() => {
        const fetchBackgroundCities = async () => {
            // Wait a bit for initial load to settle
            await new Promise(resolve => setTimeout(resolve, 2000));

            for (const cityName of recentCities) {
                // Skip if we already have it in cache (simple check)
                if (!weatherCache[cityName]) {
                    try {
                        const data = await getWeatherData(cityName);
                        setWeatherCache(prev => ({
                            ...prev,
                            [data.city]: { // Use returned city name to match
                                temp: data.current.temp,
                                condition: data.current.condition,
                                icon: data.current.icon
                            }
                        }));
                    } catch (err) {
                        console.warn('Failed to load background weather for ' + cityName, err);
                    }
                }
            }
        };

        fetchBackgroundCities();
    }, [recentCities]); // Run when list changes (new search) or on mount

    const handleCityChange = (newCity) => {
        setCity(newCity);
    };

    return (
        <WeatherContext.Provider value={{
            city,
            setCity: handleCityChange,
            weatherData,
            loading,
            error,
            recentCities,
            weatherCache // Expose cache
        }}>
            {children}
        </WeatherContext.Provider>
    );
};

export const useWeather = () => {
    const context = useContext(WeatherContext);
    if (!context) {
        throw new Error('useWeather must be used within a WeatherProvider');
    }
    return context;
};
