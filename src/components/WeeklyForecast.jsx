import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { getWeatherIcon } from '../utils/weatherIcons';
import { getDayName } from '../utils/helpers';
import { motion } from 'framer-motion';

const WeeklyForecast = () => {
    const { weatherData } = useWeather();
    if (!weatherData) return null;

    // Show next 3 days for the bento layout to fit nicely, or all scrollable
    // Reference image shows 3 distinct top cards. Let's try to fit 3-4 nicely.
    const visibleForecast = weatherData.forecast.slice(0, 4);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {visibleForecast.map((day, index) => (
                <motion.div
                    key={day.dt}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-[#1e1e24] rounded-[2rem] p-6 flex flex-col items-center justify-between gap-4 shadow-lg border border-white/5 transition-all"
                >
                    <div className="scale-110">
                        {getWeatherIcon(day.icon, "w-10 h-10")}
                    </div>
                    <div className="text-center">
                        <p className="text-gray-400 text-sm font-medium mb-1">{index === 0 ? 'Today' : getDayName(day.dt)}</p>
                        <p className="text-xl font-bold text-white">{day.temp}°C</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default WeeklyForecast;
