import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/90 border border-white/10 p-3 rounded-xl text-white text-xs shadow-xl">
                <p className="mb-1 text-gray-400">{new Date(label * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-lg font-bold text-orange-400">{payload[0].value}°</p>
            </div>
        );
    }
    return null;
};

const ForecastChart = () => {
    const { weatherData } = useWeather();
    if (!weatherData) return null;

    // Take first 8 hours for a cleaner view matching reference
    const data = weatherData.hourly.slice(0, 8);

    return (
        <div className="w-full h-full bg-[#1e1e24] rounded-[2rem] p-6 shadow-lg border border-white/5 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-400 text-sm font-medium">Weather Forecast</h3>
            </div>

            <div className="flex-grow w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff8c42" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ff8c42" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                        <Area
                            type="monotone"
                            dataKey="temp"
                            stroke="#ff8c42"
                            strokeWidth={3}
                            fill="url(#colorTemp)"
                            activeDot={{ r: 6, fill: '#fff', stroke: '#ff8c42', strokeWidth: 2 }}
                        />
                        {/* Custom X Axis to match the "points" look */}
                        <XAxis
                            dataKey="dt"
                            tickFormatter={(unix) => new Date(unix * 1000).getHours()}
                            stroke="rgba(255,255,255,0.2)"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ForecastChart;
