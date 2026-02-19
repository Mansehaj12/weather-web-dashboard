import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { motion } from 'framer-motion';

const RainBar = ({ label, value, index }) => (
    <div className="w-full grid grid-cols-[80px_1fr_40px] items-center gap-4">
        <span className="text-sm text-gray-300 font-medium">{label}</span>
        <div className="h-8 bg-[#151518] rounded-full overflow-hidden relative p-1">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(value, 2)}%` }} // Ensure even 0% is slightly visible as a dot
                transition={{ duration: 1, delay: index * 0.1, type: "spring", stiffness: 50 }}
                className="h-full bg-gradient-to-r from-orange-400 to-[#ff4e25] rounded-full flex items-center justify-end"
            >
            </motion.div>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white">
                {value}%
            </span>
        </div>

    </div>
);

const RainChance = () => {
    const { weatherData } = useWeather();
    if (!weatherData) return null;

    return (
        <div className="bg-[#1e1e24] rounded-[2rem] p-6 shadow-lg border border-white/5 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-400 text-sm font-medium">Chances of Rain</h3>
            </div>

            <div className="flex flex-col gap-6 justify-center flex-grow">
                {weatherData.rainChances && weatherData.rainChances.length > 0 ? (
                    weatherData.rainChances.slice(0, 3).map((item, index) => (
                        <RainBar key={index} index={index} label={item.day} value={item.chance} />
                    ))
                ) : (
                    // Fallback visuals if no rain data (e.g. early load)
                    <>
                        <RainBar index={0} label="Today" value={0} />
                        <RainBar index={1} label="Tomorrow" value={0} />
                        <RainBar index={2} label="Next Day" value={0} />
                    </>
                )}
            </div>

            <div className="flex justify-between text-xs text-gray-600 mt-4 px-[100px]">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
            </div>
        </div>
    );
};

export default RainChance;
