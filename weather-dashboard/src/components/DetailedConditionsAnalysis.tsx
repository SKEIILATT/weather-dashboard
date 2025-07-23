import { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';

interface WeatherParameter {
  name: string;
  value: string;
  unit: string;
  status: 'Normal' | 'Atención' | 'Alerta';
  trend: 'Subiendo' | 'Bajando' | 'Estable';
  recentChange: string;
  description: string;
  icon: string;
}

interface DetailedConditionsProps {
  lat?: number;
  lon?: number;
  locationName?: string;
}

// Función para determinar el estado basado en el valor
const getParameterStatus = (parameter: string, value: number): 'Normal' | 'Atención' | 'Alerta' => {
  switch (parameter) {
    case 'uv':
      if (value >= 8) return 'Alerta';
      if (value >= 6) return 'Atención';
      return 'Normal';
    case 'humidity':
      if (value >= 80 || value <= 20) return 'Atención';
      return 'Normal';
    case 'windSpeed':
      if (value >= 25) return 'Alerta';
      if (value >= 15) return 'Atención';
      return 'Normal';
    case 'pressure':
      if (value <= 1000 || value >= 1030) return 'Atención';
      return 'Normal';
    default:
      return 'Normal';
  }
};

// Función para determinar la tendencia (simulada para el ejemplo)
const getTrend = (): 'Subiendo' | 'Bajando' | 'Estable' => {
  const trends = ['Subiendo', 'Bajando', 'Estable'] as const;
  return trends[Math.floor(Math.random() * trends.length)];
};

// Función para generar cambio reciente simulado
const getRecentChange = (): string => {
  const changes = [
    '+2°C en 2h', '-5% en 1h', '+3 km/h', 'Sin cambio', 
    '+5% en 1h', '-2°C en 3h', '+1 hPa', '+3 km/h'
  ];
  return changes[Math.floor(Math.random() * changes.length)];
};

// Función para obtener datos detallados del clima
const fetchDetailedWeatherData = async (latitude: number, longitude: number): Promise<WeatherParameter[]> => {
  try {
    
    const weatherPath = `/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index&hourly=dew_point_2m,visibility&timezone=auto&forecast_days=1`;
    
    const weatherData = await fetchAPI(weatherPath);
    
    if (!weatherData || !weatherData.current) {
      throw new Error('La API del clima no devolvió datos válidos');
    }
    
    const current = weatherData.current;
    const hourly = weatherData.hourly;
    
    const parameters: WeatherParameter[] = [
      {
        name: 'Temperatura',
        value: Math.round(current.temperature_2m || 0).toString(),
        unit: '°C',
        status: getParameterStatus('temperature', current.temperature_2m || 0),
        trend: getTrend(),
        recentChange: getRecentChange(),
        description: 'Temperatura ambiente actual',
        icon: '🌡️'
      },
      {
        name: 'Sensación térmica',
        value: Math.round(current.apparent_temperature || 0).toString(),
        unit: '°C',
        status: getParameterStatus('apparent', current.apparent_temperature || 0),
        trend: getTrend(),
        recentChange: getRecentChange(),
        description: 'Temperatura percibida por el cuerpo',
        icon: '🌡️'
      },
      {
        name: 'Humedad',
        value: Math.round(current.relative_humidity_2m || 0).toString(),
        unit: '%',
        status: getParameterStatus('humidity', current.relative_humidity_2m || 0),
        trend: getTrend(),
        recentChange: getRecentChange(),
        description: 'Humedad relativa del aire',
        icon: '💧'
      },
      {
        name: 'Viento',
        value: `${Math.round(current.wind_speed_10m || 0)} km/h`,
        unit: getWindDirection(current.wind_direction_10m || 0),
        status: getParameterStatus('windSpeed', current.wind_speed_10m || 0),
        trend: getTrend(),
        recentChange: getRecentChange(),
        description: 'Velocidad y dirección del viento',
        icon: '💨'
      },
      {
        name: 'Visibilidad',
        value: Math.round((hourly?.visibility?.[0] || 10000) / 1000).toString(),
        unit: 'km',
        status: 'Normal',
        trend: getTrend(),
        recentChange: getRecentChange(),
        description: 'Distancia de visibilidad atmosférica',
        icon: '👁️'
      },
      {
        name: 'Presión',
        value: Math.round(current.surface_pressure || 1013).toString(),
        unit: 'hPa',
        status: getParameterStatus('pressure', current.surface_pressure || 1013),
        trend: getTrend(),
        recentChange: getRecentChange(),
        description: 'Presión atmosférica a nivel del mar',
        icon: '📊'
      },
      {
        name: 'Índice UV',
        value: Math.round(current.uv_index || 0).toString(),
        unit: '',
        status: getParameterStatus('uv', current.uv_index || 0),
        trend: getTrend(),
        recentChange: getRecentChange(),
        description: 'Intensidad de radiación ultravioleta',
        icon: '☀️'
      },
      {
        name: 'Punto de rocío',
        value: Math.round(hourly?.dew_point_2m?.[0] || 0).toString(),
        unit: '°C',
        status: 'Normal',
        trend: getTrend(),
        recentChange: getRecentChange(),
        description: 'Temperatura de condensación del vapor',
        icon: '💧'
      }
    ];
    
    return parameters;
    
  } catch (error) {
    console.error('Error al obtener datos detallados del clima:', error);
    throw new Error('No se pudieron obtener los datos detallados del clima');
  }
};

// Función para convertir grados a dirección del viento
const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

const DetailedConditionsAnalysis: React.FC<DetailedConditionsProps> = ({ lat, lon, locationName }) => {
  const [parametersData, setParametersData] = useState<WeatherParameter[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDetailedData = async () => {
      if (!lat || !lon) {
        setParametersData([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchDetailedWeatherData(lat, lon);
        setParametersData(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar análisis detallado");
        console.error('Error cargando análisis:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDetailedData();
  }, [lat, lon]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Normal':
        return '#4CAF50';
      case 'Atención':
        return '#FF9800';
      case 'Alerta':
        return '#f44336';
      default:
        return '#4CAF50';
    }
  };

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'Subiendo':
        return '↗️';
      case 'Bajando':
        return '↘️';
      case 'Estable':
        return '➡️';
      default:
        return '➡️';
    }
  };

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
          Análisis Detallado de Condiciones
        </h2>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Monitoreo completo con tendencias y cambios recientes
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
            Cargando análisis detallado...
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
          Análisis Detallado de Condiciones
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

  if (!parametersData.length) {
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
          Análisis Detallado de Condiciones
        </h2>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Monitoreo completo con tendencias y cambios recientes
        </p>
        <div style={{ paddingTop: '32px', paddingBottom: '32px', color: 'rgba(255, 255, 255, 0.6)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
          <p>Selecciona una ubicación para ver el análisis detallado</p>
        </div>
      </div>
    );
  }

  return (
  <div style={{
    background: 'linear-gradient(135deg, rgba(139, 69, 219, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%)',
    borderRadius: '16px',
    padding: '32px',
    margin: '20px 0',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 12px 40px rgba(139, 69, 219, 0.3)'
  }}>
    {/* Header */}
    <div style={{ 
      textAlign: 'center', 
      marginBottom: '32px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      paddingBottom: '24px'
    }}>
      <h2 style={{ 
        fontSize: '28px', 
        fontWeight: 'bold', 
        marginBottom: '8px',
        color: 'white',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      }}>
        Análisis Detallado de Condiciones
      </h2>
      <p style={{ 
        color: 'rgba(255, 255, 255, 0.8)', 
        margin: '0',
        fontSize: '16px'
      }}>
        Monitoreo completo con tendencias y cambios recientes
      </p>
    </div>
    
    
    <div style={{ overflowX: 'auto' }}>
      <div style={{ 
        minWidth: '900px'  // 
      }}>
        {/* Tabla de parámetros */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          {/* Header de la tabla */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 120px 100px 120px 140px 200px',
            gap: '16px',
            padding: '20px 24px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'rgba(255, 255, 255, 0.9)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <div>Parámetro</div>
            <div style={{ textAlign: 'center' }}>Valor Actual</div>
            <div style={{ textAlign: 'center' }}>Estado</div>
            <div style={{ textAlign: 'center' }}>Tendencia</div>
            <div style={{ textAlign: 'center' }}>Cambio Reciente</div>
            <div>Descripción</div>
          </div>
          
          {/* Filas de datos */}
          {parametersData.map((param, index) => (
            <div
              key={param.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 100px 120px 140px 200px',
                gap: '16px',
                padding: '20px 24px',
                borderBottom: index < parametersData.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                transition: 'all 0.2s ease',
                alignItems: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent';
              }}
            >
              {/* Parámetro */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                color: 'white',
                fontWeight: '500'
              }}>
                <span style={{ fontSize: '20px' }}>{param.icon}</span>
                <span>{param.name}</span>
              </div>
              
              {/* Valor */}
              <div style={{ 
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {param.value}
                {param.unit && <span style={{ fontSize: '14px', marginLeft: '2px' }}>{param.unit}</span>}
              </div>
              
              {/* Estado */}
              <div style={{ textAlign: 'center' }}>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: getStatusColor(param.status),
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {param.status}
                </span>
              </div>
              
              {/* Tendencia */}
              <div style={{ 
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px'
              }}>
                <span style={{ fontSize: '16px' }}>{getTrendIcon(param.trend)}</span>
                <span>{param.trend}</span>
              </div>
              
              {/* Cambio reciente */}
              <div style={{ 
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {param.recentChange}
              </div>
              
              {/* Descripción */}
              <div style={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '13px',
                lineHeight: '1.4'
              }}>
                {param.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Footer */}
    <div style={{ 
      textAlign: 'center',
      paddingTop: '24px',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      marginTop: '24px'
    }}>
      <p style={{ 
        fontSize: '13px',
        color: 'rgba(255, 255, 255, 0.6)',
        margin: '0'
      }}>
        Actualizado hace unos minutos • {locationName || 'Ubicación actual'} • Datos en tiempo real
      </p>
    </div>
  </div>
);
}
export default DetailedConditionsAnalysis;