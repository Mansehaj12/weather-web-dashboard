import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { getWeatherIcon } from '../utils/weatherIcons';
import { formatTime, formatDate } from '../utils/helpers';
import { MapPin } from 'lucide-react';
import CityScroller from './CityScroller';

const CurrentWeather = () => {
    const { weatherData, loading, error } = useWeather();

    if (loading) return <div className="hidden"></div>;
    if (!weatherData) return null;

    const { current, city, country } = weatherData;

    return (
        <div className="h-full flex flex-col justify-between p-10 rounded-[2.5rem] bg-gradient-to-br from-[#ff9a59] to-[#ff4e25] shadow-2xl relative overflow-hidden text-white">

            {/* Right side decorative dots */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
                <div className="w-5 h-5 rounded-full border-2 border-white/50" />
                <div className="w-4 h-4 rounded-full bg-cyan-400" />
                <div className="w-4 h-4 rounded-full bg-indigo-400" />
                <div className="w-4 h-4 rounded-full bg-blue-600" />
            </div>

            {/* Top Section */}
            <div className="flex justify-between items-start z-10 w-full pr-8">
                <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-white/80" />
                    <span className="text-xl font-medium">{city}</span>
                </div>
                <div className="text-right">
                    <span className="text-sm font-medium opacity-90">Last Updated, {formatDate(current.dt).split(',')[1]} {formatTime(current.dt, 0)}</span>
                </div>
            </div>

            {/* Middle Section */}
            <div className="flex flex-col items-start gap-1 z-10 mt-6 pl-2">
                <div className="flex items-center gap-4">
                    <div className="scale-150 transform origin-left">
                        {getWeatherIcon(current.icon, "w-24 h-24")}
                    </div>
                </div>
                <h1 className="text-[5rem] font-bold leading-none tracking-tight mt-6">
                    {current.temp} °C
                </h1>
                <p className="text-xl font-medium opacity-90 mt-2">
                    {current.condition}
                </p>
            </div>

            {/* Bottom Section - Scroller */}
            <div className="z-10 mt-auto w-full pr-8">
                <CityScroller />
            </div>
        </div>
    );
};

export default CurrentWeather;
