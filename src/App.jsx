import { useState } from 'react';
import WeatherDisplay from './components/DisplayWeather/DisplayWeather';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="app-container">
        <WeatherDisplay />
      </div>
    </>
  )
}

export default App;
