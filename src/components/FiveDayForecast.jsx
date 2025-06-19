import { useState, useEffect } from 'react';
import axios from 'axios';

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
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
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
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">5-Day Forecast for {city}</h3>
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
      {forecast && (
        <div className="grid grid-cols-1 gap-4">
          {forecast.map((day) => (
            <div
              key={day.dt}
              className="bg-gray-100 rounded-md p-4 flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="font-medium">
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                {day.weather?.[0]?.icon && (
                  <img
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt="Weather icon"
                    className="w-8 h-8 my-2"
                  />
                )}
                <p>{day.weather[0].description}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{Math.round(day.temp.day)}°C</p>
                <p className="text-sm">High: {Math.round(day.temp.max)}°C</p>
                <p className="text-sm">Low: {Math.round(day.temp.min)}°C</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FiveDayForecast;