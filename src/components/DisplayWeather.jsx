import { useState, useEffect } from 'react';
import axios from 'axios';
import FiveDayForecast from './FiveDayForecast';


function DisplayWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [defaultValue, setdefaultValue] = useState('Colombo,lk');
  const [inputName, setInputName] = useState('');
  const [inputError, setInputError] = useState(null);
    const [coordinates, setCoordinates] = useState({ lat: null, lon: null, city: '' });


  const inputValidation = (input) => {
    if (!input.trim()) {
      return 'City or country name cannot be empty';
    }
    if (!/^[a-zA-Z\s,]+$/.test(input)) {
      return 'Please enter a valid city or country name (letters and commas only)';
    }
    return null;
  };

  const fetchingWeather = async (cityInput, isFavorite = false) => {
    setLoading(true);
    setError(null);
    setWeather(null);

    // Validate input
    const validationError = inputValidation(cityInput);
    if (validationError) {
      setInputError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Step 1: Get coordinates from Geocoding API
      const geoResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );

      if (!geoResponse.data.length) {
        throw new Error('City or country not found');
      }

      const { lat, lon, name } = geoResponse.data[0];
      setCoordinates({ lat, lon, city: name });

      // Step 2: Get weather from One Call API 3.0
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
      );

      setWeather({ ...weatherResponse.data.current, city: name });
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch weather data: ${err.response?.data?.message || err.message}`);
      setLoading(false);
      console.error('API Error:', err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchingWeather(defaultValue);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setInputError(null);
    fetchingWeather(inputName);
    setdefaultValue(inputName);
  };


  return (
    <div className="max-w-md mx-auto p-6">
        <div className="sticky top-0 bg-white z-10 pb-4">
            <h2 className="text-2xl font-bold mb-4">Weather Reporter</h2>
            <form onSubmit={handleSearch} className="mb-4">
                <div className="flex gap-2">
                <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Enter city or country (e.g., Colombo,lk)"
                    className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={loading}
                >
                    Search
                </button>
                </div>
                {inputError && <p className="text-red-500 text-sm mt-2">{inputError}</p>}
            </form>
        </div>
        <div className="h-[calc(100vh-12rem)] overflow-y-auto">
            {loading && (
            <div className="text-center">
            <svg className="animate-spin h-5 w-5 mx-auto mb-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p>Loading...</p>
            </div>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}
            {weather && (
            <div>
                <h3 className="text-xl font-semibold mb-2">Weather in {weather.city}</h3>
                {weather.weather?.[0]?.icon && (
                    <img
                    src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                    alt="Weather icon"
                    className="w-12 h-12 mx-auto mb-4"
                    />
                )}
                <p>Temperature: {weather.temp}°C</p>
                <p>Humidity: {weather.humidity}%</p>
                <p>Wind Speed: {weather.wind_speed} m/s</p>
                <p>Pressure: {weather.pressure} hPa</p>
                <p>UV Index: {weather.uvi}</p>
            </div>
            )}
            <FiveDayForecast lat={coordinates.lat} lon={coordinates.lon} city={coordinates.city} />
        </div>
    </div>
  );
}

export default DisplayWeather;