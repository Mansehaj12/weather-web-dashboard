import React from 'react';
import { useWeather } from '../context/WeatherContext';

const AQICard = () => {
    const { weatherData } = useWeather();
    if (!weatherData) return null;
    const { aqi } = weatherData;

    // Helper for reference style dot indicators
    const Pollutant = ({ label, value, color }) => (
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xl font-bold text-white">{value}</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">{label}</span>
        </div>
    );

    return (
        <div className="bg-[#1e1e24] rounded-[2rem] p-6 shadow-lg border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left Gauge Section */}
            <div className="flex flex-col items-center gap-2">
                <h3 className="text-gray-400 text-sm font-medium self-start w-full">Air Quality Overview</h3>
                <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Simple SVG Gauge */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="#333" strokeWidth="8" fill="transparent" />
                        <circle cx="64" cy="64" r="56" stroke="#4ade80" strokeWidth="8" fill="transparent" strokeDasharray="351" strokeDashoffset={351 - (351 * (100 / 500) * aqi.aqi * 20)} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm text-green-400 font-medium">Good</span>
                        <span className="text-3xl font-bold text-white">{aqi.aqi * 12}</span>
                    </div>
                </div>
                <span className="text-[10px] text-gray-500">Air is clean and healthy</span>
            </div>

            {/* Right List Section */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 flex-grow">
                <Pollutant label="PM10" value={aqi.components.pm10} color="bg-green-500" />
                <Pollutant label="O3" value={aqi.components.o3} color="bg-yellow-400" />
                <Pollutant label="SO2" value={aqi.components.so2} color="bg-green-500" />
                <Pollutant label="PM2.5" value={aqi.components.pm2_5} color="bg-green-500" />
                <Pollutant label="CO" value={aqi.components.co} color="bg-red-400" />
                <Pollutant label="NO2" value={aqi.components.no2} color="bg-green-500" />
            </div>
        </div>
    );
};

export default AQICard;
