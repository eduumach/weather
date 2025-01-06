import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ForecastInfo.css';

const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

export const ForecastInfo = ({ city }) => {
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForecast = async (query) => {
            try {
                setError(null);
                const response = await axios.get(
                    `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=6&aqi=no&alerts=no&lang=pt`
                );
               
                const futureForecast = response.data.forecast.forecastday.slice(1);
                setForecast(futureForecast);
            } catch (err) {
                setError('Não foi possível obter a previsão. Verifique o nome da cidade ou a permissão de localização.');
            }
        };

        if (city) {
            fetchForecast(city);
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchForecast(`${latitude},${longitude}`);
                },
                () => {
                    setError('Permissão de localização negada ou indisponível.');
                }
            );
        }
    }, [city]);

    const formatDayOfWeek = (date) => {
        const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        const [year, month, day] = date.split('-');
        const dayOfWeek = new Date(year, month - 1, day).getDay();  // getDay() retorna o índice do dia da semana (0 = Domingo, 6 = Sábado)
        return daysOfWeek[dayOfWeek];
    };

    return (
        <div className="forecast-info">
            {error && <p className="error-message">{error}</p>}
            {forecast && (
                <div>
                    <h2>Previsão para os próximos 5 dias</h2>
                    <ul>
                        {forecast.map((day) => (
                            <li key={day.date} className="forecast-day">
                                <p> {formatDayOfWeek(day.date)}</p>
                                <img
                                    src={day.day.condition.icon}
                                    alt={day.day.condition.text}
                                />
                                <p>Máx: {day.day.maxtemp_c}°C / Mín: {day.day.mintemp_c}°C</p>
                                <p>Condição: {day.day.condition.text}</p>
                                
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
