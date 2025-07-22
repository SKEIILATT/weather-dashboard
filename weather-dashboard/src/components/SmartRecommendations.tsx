import { useState, useEffect } from 'react';
import { getWeatherByCoordinates, type WeatherData } from '../services/weatherService';

interface WeatherCondition {
  temperature: number;
  humidity: number;
  weatherCode: number;
  windSpeed: number;
  precipitation: number;
}

interface Recommendation {
  category: string;
  title: string;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

interface SmartRecommendationsProps {
  lat?: number;
  lon?: number;
  locationName?: string;
}

// Función para generar recomendaciones basadas en el clima
const generateRecommendations = (weather: WeatherCondition): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  // Recomendaciones de vestimenta
  if (weather.temperature < 15) {
    recommendations.push({
      category: 'clothing',
      title: 'Vestimenta Óptima',
      description: 'Ropa de temporada con opción de capa adicional',
      icon: '🧥',
      priority: 'high'
    });
  } else if (weather.temperature > 25) {
    recommendations.push({
      category: 'clothing',
      title: 'Vestimenta Óptima',
      description: 'Ropa ligera y transpirable, protección solar',
      icon: '👕',
      priority: 'high'
    });
  } else {
    recommendations.push({
      category: 'clothing',
      title: 'Vestimenta Óptima',
      description: 'Ropa de temporada con opción de capa adicional',
      icon: '👔',
      priority: 'medium'
    });
  }

  // Recomendaciones de actividades
  if (weather.precipitation < 20 && weather.windSpeed < 15) {
    recommendations.push({
      category: 'activities',
      title: 'Actividades Recomendadas',
      description: 'Buenas condiciones para caminar o actividades ligeras',
      icon: '🚶',
      priority: 'high'
    });
  } else if (weather.precipitation > 60) {
    recommendations.push({
      category: 'activities',
      title: 'Actividades Recomendadas',
      description: 'Mejor permanecer en interiores o actividades cubiertas',
      icon: '🏠',
      priority: 'medium'
    });
  } else {
    recommendations.push({
      category: 'activities',
      title: 'Actividades Recomendadas',
      description: 'Buenas condiciones para caminar o actividades ligeras',
      icon: '🚶',
      priority: 'medium'
    });
  }

  // Recomendaciones de salud y bienestar
  if (weather.humidity > 70) {
    recommendations.push({
      category: 'health',
      title: 'Salud y Bienestar',
      description: 'Alta humedad: mantente hidratado y busca ambientes frescos',
      icon: '💧',
      priority: 'high'
    });
  } else if (weather.humidity < 30) {
    recommendations.push({
      category: 'health',
      title: 'Salud y Bienestar',
      description: 'Baja humedad: usa crema hidratante y bebe más agua',
      icon: '🧴',
      priority: 'medium'
    });
  } else {
    recommendations.push({
      category: 'health',
      title: 'Salud y Bienestar',
      description: 'Condiciones de humedad normales',
      icon: '💚',
      priority: 'low'
    });
  }

  // Recomendaciones de transporte
  if (weather.precipitation > 50 || weather.windSpeed > 20) {
    recommendations.push({
      category: 'transport',
      title: 'Transporte y Movilidad',
      description: 'Condiciones adversas de transporte',
      icon: '⚠️',
      priority: 'high'
    });
  } else {
    recommendations.push({
      category: 'transport',
      title: 'Transporte y Movilidad',
      description: 'Condiciones normales de transporte',
      icon: '🚗',
      priority: 'low'
    });
  }

  return recommendations;
};

// Función para convertir WeatherData a WeatherCondition
const convertWeatherData = (weatherData: WeatherData): WeatherCondition => {
  // Extraer código del clima del texto de condición si está disponible
  let weatherCode = 0;
  const conditionText = weatherData.current.condition.text.toLowerCase();
  
  // Mapeo básico de texto a código (puedes expandir esto)
  if (conditionText.includes('despejado')) weatherCode = 0;
  else if (conditionText.includes('nublado')) weatherCode = 3;
  else if (conditionText.includes('lluvia')) weatherCode = 63;
  else if (conditionText.includes('nieve')) weatherCode = 73;
  else if (conditionText.includes('tormenta')) weatherCode = 95;

  return {
    temperature: weatherData.current.temp_c,
    humidity: weatherData.current.humidity,
    weatherCode: weatherCode,
    windSpeed: weatherData.current.wind_kph / 3.6, // Convertir km/h a m/s
    precipitation: 0 // Open-meteo no devuelve precipitación en current, usar 0 por defecto
  };
};

// Función para obtener datos del clima 
const fetchCurrentWeatherDataWithService = async (latitude: number, longitude: number): Promise<WeatherCondition> => {
  try {
    const weatherData = await getWeatherByCoordinates(latitude, longitude);
    return convertWeatherData(weatherData);
  } catch (error) {
    console.error('Error al obtener datos del clima con servicio:', error);
    throw new Error('No se pudo obtener información del clima');
  }
};

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ lat, lon, locationName }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!lat || !lon) {
        setRecommendations([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        
        const weatherData = await fetchCurrentWeatherDataWithService(lat, lon);
        const generatedRecommendations = generateRecommendations(weatherData);
        setRecommendations(generatedRecommendations);
      } catch (err: any) {
        setError(err.message || "Error al cargar recomendaciones");
        console.error('Error cargando recomendaciones:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [lat, lon]);

  
  if (loading) {
    return (
      <div style={{
        backgroundColor: 'rgba(139, 69, 233, 0.8)',
        borderRadius: '16px',
        padding: '24px',
        margin: '20px 0',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(139, 69, 233, 0.3)',
        color: 'white'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: 'white'
        }}>
          Recomendaciones Inteligentes
        </h2>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.8)', 
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Sugerencias personalizadas basadas en IA climática
        </p>
        <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
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
            Generando recomendaciones...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: 'rgba(139, 69, 233, 0.8)',
        borderRadius: '16px',
        padding: '24px',
        margin: '20px 0',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 107, 107, 0.3)',
        boxShadow: '0 8px 32px rgba(139, 69, 233, 0.3)',
        color: 'white'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: 'white'
        }}>
          Recomendaciones Inteligentes
        </h2>
        <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px', color: '#ff6b6b' }}>
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
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(139, 69, 233, 0.8)',
        borderRadius: '16px',
        padding: '24px',
        margin: '20px 0',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(139, 69, 233, 0.3)',
        color: 'white'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: 'white'
        }}>
          Recomendaciones Inteligentes
        </h2>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.8)', 
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Sugerencias personalizadas basadas en IA climática
        </p>
        <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px', color: 'rgba(255, 255, 255, 0.6)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
          <p>Selecciona una ubicación para obtener recomendaciones</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'rgba(139, 69, 233, 0.8)',
      borderRadius: '16px',
      padding: '24px',
      margin: '20px 0',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(139, 69, 233, 0.3)',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '24px',
        paddingBottom: '16px'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: 'white'
        }}>
          Recomendaciones Inteligentes
        </h2>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.8)', 
          margin: '0',
          fontSize: '16px'
        }}>
          Sugerencias personalizadas basadas en IA climática
        </p>
        {locationName && (
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.6)', 
            margin: '4px 0 0 0',
            fontSize: '14px'
          }}>
            📍 {locationName}
          </p>
        )}
      </div>
      
      {/* Lista de recomendaciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {recommendations.map((recommendation, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            {/* Icono e indicador de prioridad */}
            <div style={{ 
              marginRight: '16px',
              position: 'relative'
            }}>
              <div style={{ 
                fontSize: '24px',
                marginBottom: '4px'
              }}>
                {recommendation.icon}
              </div>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: recommendation.priority === 'high' ? '#10B981' : 
                                recommendation.priority === 'medium' ? '#F59E0B' : '#6B7280',
                margin: '0 auto'
              }}></div>
            </div>
            
            {/* Contenido */}
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '4px'
              }}>
                {recommendation.title}
              </h3>
              <p style={{ 
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '0',
                lineHeight: '1.4'
              }}>
                {recommendation.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartRecommendations;