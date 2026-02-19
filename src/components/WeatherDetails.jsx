import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { Wind, Droplets, Eye, Gauge, Sun, CloudRain } from 'lucide-react';

const DetailCard = ({ icon: Icon, label, value, unit }) => (
    <div className="bg-[#1e1e24] rounded-[2rem] p-5 flex flex-col justify-center gap-2 shadow-lg border border-white/5 hover:bg-[#25252b] transition-colors">
        <div className="flex items-center gap-2 text-gray-400">
            <Icon size={18} />
            <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        </div>
        <div className="mt-1">
            <span className="text-2xl font-bold text-white">{value}</span>
            <span className="text-sm text-gray-500 ml-1">{unit}</span>
        </div>
    </div>
);

const WeatherDetails = () => {
    const { weatherData } = useWeather();
    if (!weatherData) return null;
    const { current } = weatherData;

    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            <DetailCard icon={Droplets} label="Humidity" value={current.humidity} unit="%" />
            <DetailCard icon={Wind} label="Wind Speed" value={current.windSpeed} unit="km/h" />
            <DetailCard icon={Eye} label="Visibility" value={current.visibility} unit="KM" />
            <DetailCard icon={Gauge} label="Pressure" value={current.pressure} unit="mm" />
            <DetailCard icon={Sun} label="UV Index" value={current.uvIndex} unit="" />
            <DetailCard icon={CloudRain} label="Precipitation" value={current.precipitation.toFixed(0)} unit="%" />
        </div>
    );
};

export default WeatherDetails;
