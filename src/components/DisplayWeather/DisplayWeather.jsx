import { useState, useEffect } from 'react';
import axios from 'axios';
import FiveDayForecast from '../FiveDayForecast/FiveDayForecast';
import Homebg from '../../assets/hero.png';
import './DisplayWeather.css';
import { ReactSVG } from 'react-svg';
import { weatherIconMap, getWeatherIcon } from '../../utils/WeatherIcons';

// Import new Flaticon SVG icons
import humidityIcon from '../../assets/weather-icons/humidity.svg';
import windSpeedIcon from '../../assets/weather-icons/wind-speed.svg';
import pressureIcon from '../../assets/weather-icons/pressure.svg';
import uvIndexIcon from '../../assets/weather-icons/uv-index.svg';
import visibility from '../../assets/weather-icons/visibility.svg'


function DisplayWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [defaultValue, setdefaultValue] = useState('Colombo');
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
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
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
                placeholder="Enter city or country (e.g., Colombo / London)"
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
              <div className='weather-current-left'>
                <div className='weather-current-card'>
                  <h3 className="weather-current-title">Weather in {weather.city}</h3>
                  <ReactSVG src={getWeatherIcon(weather.weather?.[0]?.description)} className="weather-icon" />
                  <p className='weather-current-temp'>{weather.temp}°C</p>
                  <p className='weather-current-temp text'>Feels like {weather.feels_like}°C</p>
                </div>
              </div>
      
              <div className='weather-current-right'>
                <div className='weather-current-card'>
                  <div className="weather-current-details"> {/* Changed from <p> to <div> */}
                    <ReactSVG src={humidityIcon} className="weather-detail-icon" /> Humidity: {weather.humidity}%
                  </div>
                  <div className="weather-current-details"> {/* Changed from <p> to <div> */}
                    <ReactSVG src={windSpeedIcon} className="weather-detail-icon" /> Wind Speed: {weather.wind_speed} m/s
                  </div>
                  <div className="weather-current-details"> {/* Changed from <p> to <div> */}
                    <ReactSVG src={pressureIcon} className="weather-detail-icon" /> Pressure: {weather.pressure} hPa
                  </div>
                  <div className="weather-current-details"> {/* Changed from <p> to <div> */}
                    <ReactSVG src={uvIndexIcon} className="weather-detail-icon" /> UV Index: {weather.uvi}
                  </div>
                  <div className="weather-current-details"> {/* Changed from <p> to <div> */}
                    <ReactSVG src={visibility} className="weather-detail-icon" /> Visibility: {weather.visibility}
                  </div>
                </div>
              </div>

            </div>
          )}
          <FiveDayForecast lat={coordinates.lat} lon={coordinates.lon} city={coordinates.city} />
        </div>
      </div>
    </div>
  );
}

export default DisplayWeather;