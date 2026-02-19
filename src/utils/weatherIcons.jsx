import React from 'react';
import {
    Sun, Cloud, CloudRain, CloudLightning, CloudSnow, CloudFog, Moon,
    CloudSun, CloudMoon, Wind
} from 'lucide-react';

export const getWeatherIcon = (iconCode, className = "w-6 h-6") => {
    const code = iconCode?.replace('n', 'd') || '01d'; // Simplify for now, handle night later if needed

    switch (code) {
        case '01d': return <Sun className={`${className} text-yellow-400`} />;
        case '01n': return <Moon className={`${className} text-slate-300`} />;
        case '02d': return <CloudSun className={`${className} text-yellow-300`} />;
        case '02n': return <CloudMoon className={`${className} text-slate-400`} />;
        case '03d':
        case '03n': return <Cloud className={`${className} text-gray-300`} />;
        case '04d':
        case '04n': return <Cloud className={`${className} text-gray-400`} />;
        case '09d':
        case '09n': return <CloudRain className={`${className} text-blue-400`} />;
        case '10d':
        case '10n': return <CloudRain className={`${className} text-blue-500`} />;
        case '11d':
        case '11n': return <CloudLightning className={`${className} text-purple-500`} />;
        case '13d':
        case '13n': return <CloudSnow className={`${className} text-white`} />;
        case '50d':
        case '50n': return <CloudFog className={`${className} text-emerald-300`} />;
        default: return <Sun className={`${className} text-yellow-400`} />;
    }
};
