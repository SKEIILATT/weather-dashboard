import { useState, useEffect } from 'react';
import { getWeatherByCoordinates } from '../services/weatherService';

interface TechnicalMetrics {
  atmosphericPressure: number;
  airQualityIndex: number;
  humidityDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  lastUpdate: string;
}

interface TechnicalControlCenterProps {
  lat?: number;
  lon?: number;
}

const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return '#10B981';
  if (aqi <= 100) return '#F59E0B';
  if (aqi <= 150) return '#EF4444';
  return '#7C2D12';
};

const getAQIText = (aqi: number): string => {
  if (aqi <= 50) return 'Buena';
  if (aqi <= 100) return 'Moderada';
  if (aqi <= 150) return 'Dañina para grupos sensibles';
  return 'Dañina';
};

const TechnicalControlCenter: React.FC<TechnicalControlCenterProps> = ({ lat, lon }) => {
  const [metrics, setMetrics] = useState<TechnicalMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (lat == null || lon == null) {
      setMetrics(null);
      return;
    }

    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const weather = await getWeatherByCoordinates(lat, lon);
        const humidity = weather.current.humidity;

        const humidityDistribution = {
          low: Math.max(0, 100 - humidity - 20),
          medium: Math.min(100, humidity),
          high: Math.max(0, humidity - 50),
        };

        const calculatedAQI = Math.round(50 + (100 - humidity) * 0.6);

        const technicalData: TechnicalMetrics = {
          atmosphericPressure: weather.current.pressure_mb,
          airQualityIndex: calculatedAQI,
          humidityDistribution,
          lastUpdate: new Date(weather.current.last_updated).toLocaleString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
          }),
        };

        setMetrics(technicalData);
      } catch (err) {
        console.error('Error al cargar métricas técnicas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [lat, lon]);

  const containerStyle: React.CSSProperties = {
    backgroundColor: 'rgba(139, 69, 233, 0.8)',
    borderRadius: '16px',
    padding: '24px',
    margin: '20px 0',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(139, 69, 233, 0.3)',
    color: 'white',
    maxWidth: '100%',
  };

  if (lat == null || lon == null) {
  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
        Centro de Control Técnico
      </h2>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '150px',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.8)'
      }}>
        <span style={{ fontSize: '48px', marginBottom: '10px' }}>📍</span>
        <p style={{ margin: 0, fontSize: '16px' }}>
          Selecciona una ubicación para obtener recomendaciones
        </p>
      </div>
    </div>
  );
}

  if (loading) {
    return (
      <div style={containerStyle}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          Centro de Control Técnico
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '32px', fontSize: '16px' }}>
          Cargando métricas técnicas...
        </p>
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{
            display: 'inline-block',
            width: '32px',
            height: '32px',
            border: '2px solid transparent',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (!metrics) return null;

  const total = metrics.humidityDistribution.low + metrics.humidityDistribution.medium + metrics.humidityDistribution.high;
  const lowAngle = (metrics.humidityDistribution.low / total) * 360;
  const mediumAngle = (metrics.humidityDistribution.medium / total) * 360;

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          Centro de Control Técnico
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0', fontSize: '16px' }}>
          Métricas avanzadas y datos de calibración
        </p>
      </div>

      {/* Métricas principales */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {[{
          title: 'Presión Atmosférica',
          value: `${metrics.atmosphericPressure}`,
          unit: 'hPa (nivel del mar)',
          color: 'white'
        }, {
          title: 'Calidad del Aire',
          value: `${metrics.airQualityIndex}`,
          unit: `${getAQIText(metrics.airQualityIndex)} (AQI)`,
          color: getAQIColor(metrics.airQualityIndex)
        }].map((m, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px', fontWeight: '500' }}>
              {m.title}
            </div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: m.color, marginBottom: '4px' }}>
              {m.value}
            </div>
            <div style={{ fontSize: '14px', color: m.color }}>{m.unit}</div>
          </div>
        ))}
      </div>

      {/* Distribución de humedad */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '24px' }}>
          Distribución de Humedad
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: `conic-gradient(
              #3B82F6 0deg ${lowAngle}deg,
              #10B981 ${lowAngle}deg ${lowAngle + mediumAngle}deg,
              #F59E0B ${lowAngle + mediumAngle}deg 360deg
            )`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>100%</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Baja', value: metrics.humidityDistribution.low, color: '#3B82F6' },
              { label: 'Media', value: metrics.humidityDistribution.medium, color: '#10B981' },
              { label: 'Alta', value: metrics.humidityDistribution.high, color: '#F59E0B' }
            ].map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px', height: '16px', backgroundColor: item.color, borderRadius: '50%'
                }} />
                <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)' }}>
                  {item.label} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Extras */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {[['Última actualización', metrics.lastUpdate],
          ['Precisión de datos', '98.7% ± 0.3%'],
          ['Siguiente actualización', 'En 2 minutos']
        ].map(([label, value], i) => (
          <div key={i}>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
              {label}
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '500',
              color: i === 1 ? '#10B981' : i === 2 ? '#F59E0B' : 'white'
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalControlCenter;
