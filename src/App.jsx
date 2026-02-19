import React, { useState } from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import CurrentWeather from './components/CurrentWeather';
import WeeklyForecast from './components/WeeklyForecast';
import WeatherDetails from './components/WeatherDetails';
import AQICard from './components/AQICard';
import SunriseSunset from './components/SunriseSunset';
import RainChance from './components/RainChance';
import ForecastChart from './components/ForecastChart';
import SearchBar from './components/SearchBar';
import { LayoutDashboard } from 'lucide-react';

const DashboardLayout = () => {
    const { loading, error } = useWeather();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#101014] text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#101014] text-white flex flex-col items-center justify-center p-8 text-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
                <p className="text-gray-400 max-w-md">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-orange-500 rounded-full font-medium hover:bg-orange-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#101014] text-white p-4 md:p-8 flex items-center justify-center font-sans">
            <div className="max-w-[1600px] w-full grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-min">

                {/* LEFT COLUMN (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                    {/* Search Bar */}
                    <div className="w-full">
                        <SearchBar />
                    </div>

                    {/* Main Featured Card */}
                    <div className="flex-grow min-h-[500px]">
                        <CurrentWeather />
                    </div>

                    {/* Weather Details Grid */}
                    <div className="h-auto">
                        <WeatherDetails />
                    </div>
                </div>

                {/* RIGHT COLUMN (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* Row 1: Weekly Forecast */}
                    <div className="w-full">
                        <WeeklyForecast />
                    </div>

                    {/* Row 2: Chart & Sunrise */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 h-[300px]">
                            <ForecastChart />
                        </div>
                        <div className="md:col-span-1 h-[300px]">
                            <SunriseSunset />
                        </div>
                    </div>

                    {/* Row 3: AQI & Rain */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[250px]">
                        <AQICard />
                        <RainChance />
                    </div>

                </div>
            </div>

            {/* Watermark / Footer */}
            <div className="fixed bottom-4 right-4 text-xs text-gray-600 pointer-events-none">
                Weather Dashboard Demo
            </div>
        </div>
    );
};

const App = () => (
    <WeatherProvider>
        <DashboardLayout />
    </WeatherProvider>
);

export default App;
