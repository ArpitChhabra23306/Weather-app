import React, { useEffect, useState, useRef } from 'react';
import './Weather.css';
import searchIcon from '../assets/search.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';
     // optional

export const Weather = () => {
  const inputRef = useRef(null);
  const [weatherData, setWeatherData] = useState(null);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const search = async (city) => {
    if (!city) return alert("Please enter a city name.");
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_ID}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);

      if (data.cod === 200) {
        const w = data.weather[0];
        const m = data.main;
        const wind = data.wind;
        const sys = data.sys;
        const coord = data.coord;

        setWeatherData({
          temperature: Math.floor(m.temp - 273.15),
          feelsLike: Math.floor(m.feels_like - 273.15),
          humidity: m.humidity,
          pressure: m.pressure,
          seaLevel: m.sea_level,
          groundLevel: m.grnd_level,
          windSpeed: wind.speed,
          windDeg: wind.deg,
          windGust: wind.gust,
          location: data.name,
          description: w.description,
          iconCode: w.icon,
          lat: coord.lat,
          lon: coord.lon,
          sunrise: formatTime(sys.sunrise),
          sunset: formatTime(sys.sunset)
        });
      } else {
        alert("City not found");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    search("New York");
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search..." />
        <img src={searchIcon} alt="search" onClick={() => search(inputRef.current.value)} />
      </div>

      {weatherData ? (
        <>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.iconCode}@2x.png`}
            alt="weather-icon"
            className="weather-icon"
          />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>
          <p className="description">{weatherData.description}</p>

          <div className="weather-grid">
            <div className="col"><b>Feels Like:</b> {weatherData.feelsLike}°C</div>
            <div className="col"><b>Pressure:</b> {weatherData.pressure} hPa</div>
            <div className="col"><b>Sea Level:</b> {weatherData.seaLevel} hPa</div>
            <div className="col"><b>Ground Level:</b> {weatherData.groundLevel} hPa</div>
            <div className="col"><b>Wind:</b> {weatherData.windSpeed} m/s</div>
            <div className="col"><b>Direction:</b> {weatherData.windDeg}°</div>
            <div className="col"><b>Gust:</b> {weatherData.windGust} m/s</div>
            <div className="col"><b>Humidity:</b> {weatherData.humidity} %</div>
            <div className="col"><b>Lat:</b> {weatherData.lat}</div>
            <div className="col"><b>Lon:</b> {weatherData.lon}</div>
            <div className="col"><b>Sunrise:</b> {weatherData.sunrise}</div>
            <div className="col"><b>Sunset:</b> {weatherData.sunset}</div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Weather;
