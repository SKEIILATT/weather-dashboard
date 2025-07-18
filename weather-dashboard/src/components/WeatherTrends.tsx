import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';

interface WeatherTrendsProps {
  weatherData?: {
    current: {
      temp_c: number;
      humidity: number;
      feelslike_c: number;
    };
    location: {
      name: string;
    };
  };
}

const WeatherTrends: React.FC<WeatherTrendsProps> = ({ weatherData }) => {
  const generateTrendData = () => {
    if (!weatherData) return [];
    
    const baseTemp = weatherData.current.temp_c;
    const baseHumidity = weatherData.current.humidity;
    
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${i.toString().padStart(2, '0')}:00`,
      temperatura: Math.round(baseTemp + Math.sin(i * Math.PI / 12) * 5 + Math.random() * 2 - 1),
      humedad: Math.round(baseHumidity + Math.cos(i * Math.PI / 8) * 10 + Math.random() * 5 - 2.5),
      sensacion: Math.round(baseTemp + Math.sin(i * Math.PI / 12) * 4 + Math.random() * 1.5 - 0.75)
    }));
  };

  const data = generateTrendData();

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
            Hora: {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ color: entry.color }}
            >
              {entry.name}: {entry.value}
              {entry.name.includes('emperatura') || entry.name.includes('ensación') ? '°C' : '%'}
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
          Selecciona una ubicación para ver las tendencias climáticas
        </Typography>
      </Paper>
    );
  }

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
        <ThermostatIcon sx={{ color: '#ff6b6b', mr: 1, fontSize: 28 }} />
        <OpacityIcon sx={{ color: '#4ecdc4', mr: 2, fontSize: 28 }} />
        <Box>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
            Tendencias Climáticas - 24h
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Análisis de temperatura y humedad para {weatherData.location.name}
          </Typography>
        </Box>
      </Box>

      {/* Gráfico */}
      <Box sx={{ height: 400, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255, 255, 255, 0.8)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="temp"
              orientation="left"
              stroke="rgba(255, 255, 255, 0.8)"
              fontSize={12}
              label={{ 
                value: 'Temperatura (°C)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: 'rgba(255, 255, 255, 0.8)' }
              }}
            />
            <YAxis 
              yAxisId="humidity"
              orientation="right"
              stroke="rgba(255, 255, 255, 0.8)"
              fontSize={12}
              label={{ 
                value: 'Humedad (%)', 
                angle: 90, 
                position: 'insideRight',
                style: { textAnchor: 'middle', fill: 'rgba(255, 255, 255, 0.8)' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: 'rgba(255, 255, 255, 0.8)' }}
            />
            
            {/* Barras de humedad */}
            <Bar 
              yAxisId="humidity"
              dataKey="humedad" 
              fill="rgba(78, 205, 196, 0.6)"
              name="Humedad"
              radius={[2, 2, 0, 0]}
            />
            
            {/* Líneas de temperatura */}
            <Line 
              yAxisId="temp"
              type="monotone" 
              dataKey="temperatura" 
              stroke="#ff6b6b"
              strokeWidth={3}
              dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 4 }}
              name="Temperatura"
            />
            <Line 
              yAxisId="temp"
              type="monotone" 
              dataKey="sensacion" 
              stroke="#ffa726"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#ffa726', strokeWidth: 2, r: 3 }}
              name="Sensación térmica"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>

      {/* Estadísticas actuales */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 2, 
        mt: 3,
        pt: 2,
        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
            {weatherData.current.temp_c}°C
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Temperatura actual
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
            {weatherData.current.humidity}%
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Humedad actual
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
            {weatherData.current.feelslike_c}°C
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Sensación térmica
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default WeatherTrends;
