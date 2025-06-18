import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import WeatherDisplay from './components/DisplayWeather';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <WeatherDisplay />
      </div>
    </>
  )
}

export default App;
