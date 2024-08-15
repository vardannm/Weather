import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hook.ts";
import {
  fetchWeather,
  fetchForecast,
  toggleUnit,
} from "./store/weatherSlice.ts";
import "./styles/weather.css";

const Weather = () => {
  const [city, setCity] = useState("Yerevan");
  const dispatch = useAppDispatch();
  const { currentWeather, dailyWeather, status, unit } = useAppSelector(
    (state) => state.weather
  );

  useEffect(() => {
    dispatch(fetchWeather({ city, unit }));
    dispatch(fetchForecast({ city, unit }));
  }, [dispatch, city, unit]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(fetchWeather({ city, unit }));
    dispatch(fetchForecast({ city, unit }));
  };

  const handleUnitToggle = () => {
    dispatch(toggleUnit());
    dispatch(
      fetchWeather({ city, unit: unit === "metric" ? "imperial" : "metric" })
    );
    dispatch(
      fetchForecast({ city, unit: unit === "metric" ? "imperial" : "metric" })
    );
  };

  return (
    <div className="app">
      <div className="search">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city"
          />
          <button type="submit" className="btn">
            Search City
          </button>
        </form>
        <button onClick={handleUnitToggle}>
          Switch to {unit === "metric" ? "Fahrenheit" : "Celsius"}
        </button>
      </div>

      {status === "loading" ? (
        <p>Loading...</p>
      ) : (
        <div>
          {currentWeather && (
            <div className="weather">
              <h1>{currentWeather.name}</h1>
              <h2>
                {currentWeather.main.temp}° {unit === "metric" ? "C" : "F"}
              </h2>
              <h2>{currentWeather.weather[0].description}</h2>
            </div>
          )}

          <div className="forecast">
            <h2>Next 5 Day Forecast</h2>
            {dailyWeather.map((day: any, index: number) => (
              <div key={index} className="day-forecast">
                <p>
                  {new Date(day.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className="temps">
                  <p className="max">
                    {(
                      day.temps.reduce((a: number, b: number) => a + b) /
                      day.temps.length
                    ).toFixed(2)}
                    °
                  </p>
                  <p>{day.weather}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
