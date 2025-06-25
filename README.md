# Weather Reporter

Welcome to **Weather Reporter**, a sleek and responsive weather application built with React and Vite! This app allows you to check the current weather and a 5-day forecast for any city or country using the OpenWeatherMap API. It features custom weather icons from Flaticon, styled with plain CSS, and a user-friendly interface.

- **Current Date and Time**: 07:08 PM +0530, Wednesday, June 25, 2025
- **Live Demo**: [Insert link if deployed] (e.g., https://your-weather-app.netlify.app)

## Features
- Display current weather (temperature, feels like, humidity, wind speed, pressure, UV index, visibility) for a searched city.
- 5-day weather forecast (excluding today) with daily temperature highs and lows.
- Interactive search bar with input validation.
- Loading and error states for a smooth user experience.
- Custom SVG weather icons sourced from Flaticon.
- Responsive design with a modern, ocean-inspired color scheme.

## Technologies Used
- **React**: A JavaScript library for building the user interface.
- **Vite**: A fast build tool and development server for modern web projects.
- **Axios**: For making HTTP requests to the OpenWeatherMap API.
- **ReactSVG**: To render SVG icons dynamically.
- **Plain CSS**: For styling with a custom, hand-crafted approach.
- **OpenWeatherMap API**: Provides real-time weather data.
- **Flaticon**: Source of custom weather and detail icons.

## Prerequisites
- Node.js (v14.x or higher)
- npm (comes with Node.js)
- An OpenWeatherMap API key (sign up at [openweathermap.org](https://openweathermap.org/))

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/weather-reporter.git
cd weather-reporter
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Set Up Environment Variables
```bash
Create a .env file in the root directory.
Add your OpenWeatherMap API key:
VITE_OPENWEATHER_API_KEY=your-api-key-here
```
### 4. Run the Application
```bash
npm run dev
```
