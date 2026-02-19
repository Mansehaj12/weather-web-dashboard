
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { getCitySuggestions } from '../services/weatherApi';

const SearchBar = () => {
    const { setCity } = useWeather();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 3) {
                const results = await getCitySuggestions(query);
                setSuggestions(results);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            setCity(query);
            setQuery('');
            setShowSuggestions(false);
        }
    };

    const handleSelect = (cityName) => {
        setCity(cityName);
        setQuery('');
        setShowSuggestions(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full z-50">
            <form onSubmit={handleSubmit} className="relative w-full">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    <div className="relative flex items-center bg-gray-900/80 backdrop-blur-xl rounded-xl border border-white/10">
                        <Search className="ml-4 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search city..."
                            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 py-3 px-4 outline-none rounded-xl"
                        />
                    </div>
                </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e1e24] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {suggestions.map((item, index) => (
                        <button
                            key={`${item.name}-${index}`}
                            onClick={() => handleSelect(item.name)}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-3 transition-colors border-b border-white/5 last:border-none"
                        >
                            <MapPin size={16} className="text-orange-400" />
                            <div>
                                <span className="text-white font-medium">{item.name}</span>
                                <span className="text-gray-500 text-xs ml-2">
                                    {item.state ? `${item.state}, ` : ''}{item.country}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
