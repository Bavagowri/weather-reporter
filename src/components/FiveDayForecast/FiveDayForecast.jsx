import { useState, useEffect } from 'react';
import axios from 'axios';
import './FiveDayForecast.css';
import { ReactSVG } from 'react-svg';
import { weatherIconMap, getWeatherIcon } from '../../utils/WeatherIcons';


function FiveDayForecast({ lat, lon, city }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchForecast = async () => {
    if (!lat || !lon) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setForecast(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric&exclude=hourly,minutely`
      );
      // Get 5 days from daily forecast (excluding today)
      const fiveDayForecast = response.data.daily.slice(1, 6);
      setForecast(fiveDayForecast);
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch forecast: ${err.response?.data?.message || err.message}`);
      setLoading(false);
      console.error('API Error:', err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [lat, lon]);

  return (
    <div className="forecast-container">
      <h3 className="forecast-title">5-Day Forecast for {city}</h3>
      {loading && (
        <div className="forecast-loading">
          <svg className="weather-loading-svg" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p>Loading...</p>
        </div>
      )}
      {error && <p className="weather-error">{error}</p>}
      {forecast && (
        <div className="forecast-grid">
          {forecast.map((day) => (
            <div key={day.dt} className="forecast-day">
              <div>
                <p className="forecast-day-date">
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <ReactSVG src={getWeatherIcon(day.weather?.[0]?.description)} alt="Weather icon" className="forecast-day-icon" />
                <p className="forecast-day-temp-details">{day.weather[0].description}</p>
              </div>
              <div className="text-right">
                <p className="forecast-day-temp">{Math.round(day.temp.day)}°C</p>
                <p className="forecast-day-temp-details">High: {Math.round(day.temp.max)}°C</p>
                <p className="forecast-day-temp-details">Low: {Math.round(day.temp.min)}°C</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FiveDayForecast;