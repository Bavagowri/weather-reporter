import { useState, useEffect } from 'react';
import axios from 'axios';
import FiveDayForecast from '../FiveDayForecast/FiveDayForecast';
import Homebg from '../../assets/hero.png';
import './DisplayWeather.css'

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
    if (!/^[a-zA-Z\s]+$/.test(input)) {
      return 'Please enter a valid city or country name (letters only)';
    }
    return null;
  };

  const fetchingWeather = async (cityInput) => {
    setLoading(true);
    setError(null);
    setWeather(null);

    const validationError = inputValidation(cityInput);
    if (validationError) {
      setInputError(validationError);
      setLoading(false);
      return;
    }

    try {
      const geoResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );

      if (!geoResponse.data.length) {
        throw new Error('City or country not found');
      }

      const { lat, lon, name } = geoResponse.data[0];
      console.log('Setting coordinates:', { lat, lon, name }); // Debug log
      setCoordinates({ lat, lon, city: name });

      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric&exclude=hourly,minutely`
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
  }, []); // Empty dependency array, run once on mount

  const handleSearch = (e) => {
    e.preventDefault();
    setInputError(null);
    fetchingWeather(inputName);
    setdefaultValue(inputName);
  };

  return (
    <div
      className="weather-container"
      style={{
        backgroundImage: `url(${Homebg})`,
      }}
    >
      {/* Overlay to improve text readability */}
      <div className="weather-overlay"></div>
      <div className="weather-content">
        <div className="weather-header">
          <h2 className="weather-title">Weather Reporter</h2>
          <form onSubmit={handleSearch} className="weather-form">
            <div className="weather-form-input-group">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Enter city or country (e.g., Colombo,lk)"
                className="weather-input"
              />
              <button
                type="submit"
                className="weather-button"
                disabled={loading}
              >
                Search
              </button>
            </div>
            {inputError && <p className="weather-error">{inputError}</p>}
          </form>
        </div>
        <div className="weather-details-container">
          {loading && (
            <div className="weather-loading">
              <svg className="weather-loading-svg" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p>Loading...</p>
            </div>
          )}
          {error && <p className="weather-error">{error}</p>}
          {weather && (
            <div className='weather-current'>
              <h3 className="weather-current-title">Weather in {weather.city}</h3>
              {weather.weather?.[0]?.icon && (
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt="Weather icon"
                  className="weather-icon"
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
    </div>
  );
}

export default DisplayWeather;