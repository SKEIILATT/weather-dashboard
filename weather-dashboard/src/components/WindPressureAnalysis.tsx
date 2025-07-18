import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import AirIcon from '@mui/icons-material/Air';
import SpeedIcon from '@mui/icons-material/Speed';
import NavigationIcon from '@mui/icons-material/Navigation';

interface WindPressureAnalysisProps {
  weatherData?: {
    current: {
      wind_kph: number;
      wind_dir: string;
      pressure_mb: number;
    };
    location: {
      name: string;
    };
  };
}

const WindPressureAnalysis: React.FC<WindPressureAnalysisProps> = ({ weatherData }) => {
  
  // Datos simulados para análisis de viento en diferentes direcciones
  const generateWindData = () => {
    if (!weatherData) return [];
    
    const baseSpeed = weatherData.current.wind_kph;
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    
    return directions.map(dir => ({
      direction: dir,
      speed: Math.max(0, baseSpeed + Math.random() * 10 - 5),
      fullMark: 40
    }));
  };

  // Datos simulados para tendencia de presión
  const generatePressureData = () => {
    if (!weatherData) return [];
    
    const basePressure = weatherData.current.pressure_mb;
    
    return Array.from({ length: 12 }, (_, i) => ({
      time: `${(i * 2).toString().padStart(2, '0')}:00`,
      presion: basePressure + Math.sin(i * Math.PI / 6) * 8 + Math.random() * 4 - 2,
      tendencia: basePressure + Math.sin(i * Math.PI / 6) * 5
    }));
  };

  const windData = generateWindData();
  const pressureData = generatePressureData();

  // Función para convertir dirección del viento a grados
  const getWindAngle = (direction: string): number => {
    const directions: { [key: string]: number } = {
      'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
      'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
      'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
      'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
    };
    return directions[direction] || 0;
  };

  // Determinar la calidad del aire basada en la presión
  const getPressureQuality = (pressure: number) => {
    if (pressure > 1020) return { text: 'Alta presión - Clima estable', color: '#4caf50' };
    if (pressure > 1000) return { text: 'Presión normal', color: '#2196f3' };
    return { text: 'Baja presión - Posible mal tiempo', color: '#ff9800' };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ 
          p: 2, 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ color: entry.color }}
            >
              {entry.name}: {entry.value.toFixed(1)} 
              {entry.name.includes('resión') ? ' hPa' : ''}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  if (!weatherData) {
    return (
      <Paper sx={{
        p: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
        margin: '20px 0'
      }}>
        <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
          Selecciona una ubicación para ver el análisis de viento y presión
        </Typography>
      </Paper>
    );
  }

  const pressureQuality = getPressureQuality(weatherData.current.pressure_mb);
  const windAngle = getWindAngle(weatherData.current.wind_dir);

  return (
    <Paper sx={{
      p: 3,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: 2,
      margin: '20px 0',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        pb: 2,
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <AirIcon sx={{ color: '#81c784', mr: 1, fontSize: 28 }} />
        <SpeedIcon sx={{ color: '#64b5f6', mr: 2, fontSize: 28 }} />
        <Box>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
            Análisis de Viento y Presión
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Condiciones atmosféricas en {weatherData.location.name}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3
      }}>
        {/* Gráfico Radar del Viento */}
        <Box sx={{ 
          flex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 2,
          p: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
            Rosa de Vientos
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={windData}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.3)" />
              <PolarAngleAxis 
                dataKey="direction" 
                tick={{ fill: 'rgba(255, 255, 255, 0.8)', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 40]}
                tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 10 }}
              />
              <Radar
                name="Velocidad del viento (km/h)"
                dataKey="speed"
                stroke="#81c784"
                fill="rgba(129, 199, 132, 0.3)"
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Box>

        {/* Gráfico de Tendencia de Presión */}
        <Box sx={{ 
          flex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 2,
          p: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
            Tendencia de Presión (24h)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={pressureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
              <XAxis 
                dataKey="time" 
                stroke="rgba(255, 255, 255, 0.8)"
                fontSize={10}
              />
              <YAxis 
                stroke="rgba(255, 255, 255, 0.8)"
                fontSize={10}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="presion"
                stroke="#64b5f6"
                fill="rgba(100, 181, 246, 0.3)"
                strokeWidth={2}
                name="Presión atmosférica"
              />
              <Line
                type="monotone"
                dataKey="tendencia"
                stroke="#ff7043"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Tendencia"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>

        {/* Estadísticas actuales */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 2,
          mt: 3
        }}>
          {/* Velocidad del viento */}
          <Box sx={{ 
            textAlign: 'center',
            backgroundColor: 'rgba(129, 199, 132, 0.1)',
            borderRadius: 2,
            p: 2,
            border: '1px solid rgba(129, 199, 132, 0.3)'
          }}>
            <AirIcon sx={{ color: '#81c784', fontSize: 32, mb: 1 }} />
            <Typography variant="h4" sx={{ color: '#81c784', fontWeight: 'bold' }}>
              {weatherData.current.wind_kph}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              km/h - Velocidad del viento
            </Typography>
          </Box>

          {/* Dirección del viento */}
          <Box sx={{ 
            textAlign: 'center',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            borderRadius: 2,
            p: 2,
            border: '1px solid rgba(255, 193, 7, 0.3)'
          }}>
            <NavigationIcon 
              sx={{ 
                color: '#ffc107', 
                fontSize: 32, 
                mb: 1,
                transform: `rotate(${windAngle}deg)`,
                transition: 'transform 0.3s ease'
              }} 
            />
            <Typography variant="h4" sx={{ color: '#ffc107', fontWeight: 'bold' }}>
              {weatherData.current.wind_dir}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Dirección del viento
            </Typography>
          </Box>

          {/* Presión atmosférica */}
          <Box sx={{ 
            textAlign: 'center',
            backgroundColor: 'rgba(100, 181, 246, 0.1)',
            borderRadius: 2,
            p: 2,
            border: '1px solid rgba(100, 181, 246, 0.3)'
          }}>
            <SpeedIcon sx={{ color: '#64b5f6', fontSize: 32, mb: 1 }} />
            <Typography variant="h4" sx={{ color: '#64b5f6', fontWeight: 'bold' }}>
              {weatherData.current.pressure_mb}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              hPa - Presión atmosférica
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: pressureQuality.color,
                fontWeight: 'bold',
                display: 'block',
                mt: 1
              }}
            >
              {pressureQuality.text}
            </Typography>
          </Box>
        </Box>
    </Paper>
  );
};

export default WindPressureAnalysis;
