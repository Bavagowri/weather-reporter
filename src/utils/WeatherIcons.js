import { ReactSVG } from 'react-svg';

// Import SVG icons
import brokenCloudsIcon from '../assets/weather-icons/brokenClouds.svg';
import clearSkyIcon from '../assets/weather-icons/clearSky.svg';
import fewCloudsIcon from '../assets/weather-icons/fewClouds.svg';
import showerRainIcon from '../assets/weather-icons/showerRain.svg';
import heavyRainIcon from '../assets/weather-icons/heavyRain.svg';
import moderateRainIcon from '../assets/weather-icons/moderateRain.svg';
import lightRainIcon from '../assets/weather-icons/lightRain.svg';
import overcastCloudsIcon from '../assets/weather-icons/overcastClouds.svg';
import scatteredCloudsIcon from '../assets/weather-icons/scatteredClouds.svg';
import hazeIcon from '../assets/weather-icons/haze.svg';
import mistIcon from '../assets/weather-icons/mist.svg';
import smokeIcon from '../assets/weather-icons/smoke.svg';
import snowIcon from '../assets/weather-icons/snow.svg';
import sunIcon from '../assets/weather-icons/sunnyIcon.svg';
import thunderstormIcon from '../assets/weather-icons/thunderstorm.svg';
import tornadoIcon from '../assets/weather-icons/tornado.svg';

// Mapping of weather descriptions to Weather Icons
export const weatherIconMap = {
  'clear sky': clearSkyIcon,
  'few clouds': fewCloudsIcon,
  'scattered clouds': scatteredCloudsIcon,
  'broken clouds': brokenCloudsIcon,
  'overcast clouds': overcastCloudsIcon,
  'light rain': lightRainIcon,
  'moderate rain': moderateRainIcon,
  'heavy rain': heavyRainIcon,
  'shower rain': showerRainIcon,
  'haze': hazeIcon,
  'mist': mistIcon,
  'smoke': smokeIcon,
  'snow': snowIcon,
  'sunny day': sunIcon,
  'thunderstorm': thunderstormIcon,
  'tornado': tornadoIcon,
  default: clearSkyIcon, // Fallback icon
};

// Utility function to get the appropriate icon
export const getWeatherIcon = (description) => {
  const desc = description?.toLowerCase() || 'default';
  return weatherIconMap[desc] || weatherIconMap.default;
};