import React, { useRef } from 'react';
import { useWeather } from '../context/WeatherContext';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const CityScroller = () => {
    const { recentCities, city, setCity, weatherData, weatherCache } = useWeather();
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 150;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="w-full relative group mt-8">
            <button
                onClick={() => scroll('left')}
                className="absolute left-[-10px] top-1/2 -translate-y-1/2 z-10 p-1 text-white/50 hover:text-white transition-colors"
            >
                <ChevronLeft size={24} />
            </button>

            <div
                className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide px-4 scroll-smooth"
                ref={scrollRef}
            >
                {recentCities.map((cityName) => {
                    const isActive = city === cityName;
                    // Try to get data from cache or current weatherData
                    let displayTemp = '--';

                    if (isActive && weatherData) {
                        displayTemp = `${weatherData.current.temp} °C`;
                    } else if (weatherCache && weatherCache[cityName]) {
                        displayTemp = `${weatherCache[cityName].temp} °C`;
                    }

                    return (
                        <button
                            key={cityName}
                            onClick={() => setCity(cityName)}
                            className={`
                                min-w-[140px] h-[80px] rounded-3xl flex flex-col items-start justify-center px-5 transition-all duration-300
                                ${isActive
                                    ? 'bg-transparent border-2 border-white/80 shadow-inner'
                                    : 'bg-white/10 border border-transparent hover:bg-white/20'
                                }
                            `}
                        >
                            <span className="text-sm font-medium text-white mb-1">{cityName}</span>
                            <span className="text-lg font-light text-white/90">
                                {displayTemp}
                            </span>
                        </button>
                    );
                })}
            </div>

            <button
                onClick={() => scroll('right')}
                className="absolute right-[-10px] top-1/2 -translate-y-1/2 z-10 p-1 text-white/50 hover:text-white transition-colors"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

export default CityScroller;
