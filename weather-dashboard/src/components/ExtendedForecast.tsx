import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import WeatherIcon from './WeatherIcon';

interface ForecastDay {
  date: string;
  dayName: string;
  icon: string;
  tempMax: number;
  tempMin: number;
  rainChance: number;
  humidity: number;
  weatherCode: number;
}

interface ExtendedForecastProps {
  lat?: number;
  lon?: number;
  locationName?: string;
}

// Función para mapear códigos de clima a nombres de iconos
const getWeatherIconName = (weatherCode: number): string => {
  if (weatherCode === 0 || weatherCode === 1) {
    return 'WbSunny'; // Cielo despejado
  } else if (weatherCode === 2 || weatherCode === 3) {
    return 'PartlyCloudyDay'; // Parcialmente nublado
  } else if (weatherCode >= 45 && weatherCode <= 48) {
    return 'Foggy'; // Niebla
  } else if (weatherCode >= 51 && weatherCode <= 65) {
    return 'WaterDrop'; // Lluvia/llovizna
  } else if (weatherCode >= 66 && weatherCode <= 67) {
    return 'Grain'; // Lluvia helada
  } else if (weatherCode >= 71 && weatherCode <= 75) {
    return 'AcUnit'; // Nieve
  } else if (weatherCode >= 80 && weatherCode <= 82) {
    return 'LightMode'; // Chubascos (usando Umbrella)
  } else if (weatherCode >= 95 && weatherCode <= 99) {
    return 'Thunderstorm'; // Tormentas
  } else {
    return 'Cloud'; // Por defecto nublado
  }
};

// Función para obtener el color del icono según el código de clima
const getWeatherIconColor = (weatherCode: number): string => {
  if (weatherCode === 0 || weatherCode === 1) {
    return '#FFD700'; // Dorado para sol
  } else if (weatherCode === 2 || weatherCode === 3) {
    return '#87CEEB'; // Azul cielo para parcialmente nublado
  } else if (weatherCode >= 45 && weatherCode <= 48) {
    return '#B0C4DE'; // Gris azulado para niebla
  } else if (weatherCode >= 51 && weatherCode <= 67) {
    return '#4682B4'; // Azul para lluvia
  } else if (weatherCode >= 71 && weatherCode <= 75) {
    return '#B0E0E6'; // Azul claro para nieve
  } else if (weatherCode >= 80 && weatherCode <= 82) {
    return '#4169E1'; // Azul real para chubascos
  } else if (weatherCode >= 95 && weatherCode <= 99) {
    return '#FFD700'; // Dorado para tormentas (rayos)
  } else {
    return '#87CEEB'; // Por defecto azul cielo
  }
};

// Función para obtener nombres de días
const getDayName = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  
  if (date.toDateString() === today.toDateString()) {
    return 'Hoy';
  }
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Mañana';
  }
  
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[date.getDay()];
};

// Función para obtener pronóstico extendido de Open-Meteo
const fetchExtendedForecastData = async (latitude: number, longitude: number): Promise<ForecastDay[]> => {
  try {
    // Llamada a la API de Open-Meteo para pronóstico de 7 días
    const weatherPath = `/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_mean,relative_humidity_2m_mean&timezone=auto&forecast_days=7`;
    
    const weatherData = await fetchAPI(weatherPath);
    
    if (!weatherData || !weatherData.daily) {
      throw new Error('La API del clima no devolvió datos válidos para el pronóstico extendido');
    }
    
    const daily = weatherData.daily;
    const forecastDays: ForecastDay[] = [];
    
    // Procesar cada día del pronóstico
    for (let i = 0; i < daily.time.length; i++) {
      const forecastDay: ForecastDay = {
        date: daily.time[i],
        dayName: getDayName(daily.time[i]),
        icon: 'cloud', // Este campo no se usa realmente, el icono se determina por weatherCode
        tempMax: Math.round(daily.temperature_2m_max[i] || 0),
        tempMin: Math.round(daily.temperature_2m_min[i] || 0),
        rainChance: Math.round(daily.precipitation_probability_mean[i] || 0),
        humidity: Math.round(daily.relative_humidity_2m_mean[i] || 0),
        weatherCode: daily.weather_code[i] || 0
      };
      
      forecastDays.push(forecastDay);
    }
    
    return forecastDays;
    
  } catch (error) {
    console.error('Error al obtener pronóstico extendido:', error);
    throw new Error('No se pudo obtener el pronóstico extendido');
  }
};

const ExtendedForecast: React.FC<ExtendedForecastProps> = ({ lat, lon, locationName }) => {
  const [forecastData, setForecastData] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForecastData = async () => {
      if (!lat || !lon) {
        setForecastData([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchExtendedForecastData(lat, lon);
        setForecastData(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar pronóstico extendido");
        console.error('Error cargando pronóstico:', err);
      } finally {
        setLoading(false);
      }
    };

    loadForecastData();
  }, [lat, lon]);

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '24px',
        margin: '20px 0',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        color: 'white'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: 'white'
        }}>
          Pronóstico Extendido (7 días)
        </h2>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Predicción detallada con probabilidades de precipitación
        </p>
        <div style={{ paddingTop: '32px', paddingBottom: '32px' }}>
          <div style={{
            display: 'inline-block',
            width: '32px',
            height: '32px',
            border: '2px solid transparent',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '16px', color: 'rgba(255, 255, 255, 0.8)' }}>
            Cargando pronóstico extendido...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '24px',
        margin: '20px 0',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 107, 107, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: 'white'
        }}>
          Pronóstico Extendido (7 días)
        </h2>
        <div style={{ paddingTop: '32px', paddingBottom: '32px', color: '#ff6b6b' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <p style={{ fontSize: '16px', marginBottom: '16px' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '12px 24px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!forecastData.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '24px',
        margin: '20px 0',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: 'white'
        }}>
          Pronóstico Extendido (7 días)
        </h2>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Predicción detallada con probabilidades de precipitación
        </p>
        <div style={{ paddingTop: '32px', paddingBottom: '32px', color: 'rgba(255, 255, 255, 0.6)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
          <p>Selecciona una ubicación para ver el pronóstico extendido</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '24px',
      margin: '20px 0',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        paddingBottom: '16px'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: 'white'
        }}>
          Pronóstico Extendido (7 días)
        </h2>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          margin: '0',
          fontSize: '16px'
        }}>
          Predicción detallada con probabilidades de precipitación
        </p>
      </div>
      
      {/* Grid de días */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
        gap: '16px',
        marginBottom: '20px'
      }}>
        {forecastData.map((day, index) => (
          <div
            key={day.date}
            style={{
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              border: index === 0 ? '2px solid rgba(255, 215, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.15)',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Nombre del día */}
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '14px', 
              marginBottom: '12px',
              color: index === 0 ? '#FFD700' : 'rgba(255, 255, 255, 0.9)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {day.dayName}
            </div>
            
            {/* Icono del clima */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: '16px',
              height: '40px',
              alignItems: 'center'
            }}>
              <WeatherIcon 
                iconName={getWeatherIconName(day.weatherCode)}
                size="large"
                color={getWeatherIconColor(day.weatherCode)}
              />
            </div>
            
            {/* Temperaturas */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '4px'
              }}>
                {day.tempMax}°
              </div>
              <div style={{ 
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                {day.tempMin}°
              </div>
            </div>
            
            {/* Información adicional */}
            <div style={{ 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '12px',
              fontSize: '12px'
            }}>
              <div style={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}>
                <span>💧</span>
                <span>{day.rainChance}%</span>
              </div>
              
              <div style={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}>
                <span>💨</span>
                <span>{day.humidity}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer con información */}
      <div style={{ 
        textAlign: 'center',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <p style={{ 
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          margin: '0'
        }}>
          Actualizado hace unos minutos • {locationName || 'Ubicación actual'}
        </p>
      </div>
    </div>
  );
};

export default ExtendedForecast;