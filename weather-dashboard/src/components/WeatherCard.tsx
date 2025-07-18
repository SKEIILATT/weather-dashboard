// components/WeatherCard.tsx
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { type WeatherData } from '../services/weatherService';

interface WeatherCardProps {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, loading, error }) => {

  if (loading) {
    return (
      <Card sx={{ 
        margin: '20px 10px', 
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '8px'
      }}>
        <CardContent sx={{ textAlign: 'center', padding: '40px' }}>
          <CircularProgress sx={{ color: 'white' }} />
          <Typography variant="body1" sx={{ color: 'white', marginTop: '16px' }}>
            Cargando datos del clima...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ 
        margin: '20px 10px', 
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '8px'
      }}>
        <CardContent sx={{ textAlign: 'center', padding: '40px' }}>
          <Typography variant="h6" sx={{ color: '#ff6b6b' }}>
            Error al cargar el clima
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', marginTop: '8px' }}>
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData || !weatherData.location) {
    return (
      <Card sx={{ 
        margin: '20px 10px', 
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '8px'
      }}>
        <CardContent sx={{ textAlign: 'center', padding: '40px' }}>
          <Typography variant="h6" sx={{ color: 'white' }}>
            {!weatherData ? 'Selecciona una ubicación para ver el clima' : 'Datos incompletos'}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      margin: '20px 10px', 
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '8px'
    }}>
      <CardContent>
        {/* Título y ubicación */}
        <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            {weatherData.location.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {weatherData.location.region}, {weatherData.location.country}
          </Typography>
        </Box>

        {/* Temperatura principal */}
        <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <img 
              src={weatherData.current.condition.icon} 
              alt={weatherData.current.condition.text}
              style={{ width: '64px', height: '64px' }}
            />
            <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
              {Math.round(weatherData.current.temp_c)}°C
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {weatherData.current.condition.text}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Sensación térmica: {Math.round(weatherData.current.feelslike_c)}°C
          </Typography>
        </Box>

        {/* Detalles adicionales */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '16px' 
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Humedad
            </Typography>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {weatherData.current.humidity}%
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Viento
            </Typography>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {weatherData.current.wind_kph} km/h
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {weatherData.current.wind_dir}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Presión
            </Typography>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {weatherData.current.pressure_mb} mb
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              UV
            </Typography>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {weatherData.current.uv}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Visibilidad
            </Typography>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {weatherData.current.vis_km} km
            </Typography>
          </Box>
        </Box>

        {/* Hora local */}
        <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Última actualización: {new Date(weatherData.location.localtime).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;