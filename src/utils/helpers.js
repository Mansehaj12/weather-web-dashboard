export const formatTime = (timestamp, timezoneOffset) => {
    if (!timestamp) return '';
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
};

export const getDayName = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString([], { weekday: 'long' });
};

export const kelvinToCelsius = (kelvin) => {
    return Math.round(kelvin - 273.15);
};
