import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { formatTime } from '../utils/helpers';
import { Sunrise, Sunset } from 'lucide-react';

const SunriseSunset = () => {
    const { weatherData } = useWeather();
    if (!weatherData) return null;
    const { current } = weatherData;

    return (
        <div className="bg-[#1e1e24] rounded-[2rem] p-6 h-full flex flex-col justify-between shadow-lg border border-white/5">
            <h3 className="text-gray-400 text-sm font-medium">Sunrise & Sunset</h3>

            <div className="space-y-6 mt-4">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                    <Sunrise size={32} className="text-yellow-400" />
                    <div>
                        <span className="block text-gray-400 text-xs uppercase tracking-wider">Sunrise</span>
                        <span className="text-xl font-bold text-white">{formatTime(current.sunrise, 0)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                    <Sunset size={32} className="text-orange-500" />
                    <div>
                        <span className="block text-gray-400 text-xs uppercase tracking-wider">Sunset</span>
                        <span className="text-xl font-bold text-white">{formatTime(current.sunset, 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SunriseSunset;
