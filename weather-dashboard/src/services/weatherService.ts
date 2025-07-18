// services/weatherService.ts
import { fetchAPI } from './api';
import fetchAPIGEO, { type GeocodeResults } from './apiGeo';

// Interfaces para los datos del clima (adaptadas a Open-Meteo)
export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    wind_dir: string;
    pressure_mb: number;
    feelslike_c: number;
    uv: number;
    vis_km: number;
    last_updated: string;
  };
}

// Función para convertir código WMO a descripción del clima
const getWeatherCondition = (weatherCode: number): { text: string; icon: string } => {
  const weatherConditions: { [key: number]: { text: string; icon: string } } = {
    0: { text: 'Cielo despejado', icon: 'WbSunny' },
    1: { text: 'Principalmente despejado', icon: 'WbSunny' },
    2: { text: 'Parcialmente nublado', icon: 'PartlyCloudyDay' },
    3: { text: 'Nublado', icon: 'Cloud' },
    45: { text: 'Niebla', icon: 'Foggy' },
    48: { text: 'Niebla con escarcha', icon: 'Foggy' },
    51: { text: 'Llovizna ligera', icon: 'Grain' },
    53: { text: 'Llovizna moderada', icon: 'Grain' },
    55: { text: 'Llovizna intensa', icon: 'Grain' },
    61: { text: 'Lluvia ligera', icon: 'LightMode' },
    63: { text: 'Lluvia moderada', icon: 'WaterDrop' },
    65: { text: 'Lluvia intensa', icon: 'WaterDrop' },
    71: { text: 'Nieve ligera', icon: 'AcUnit' },
    73: { text: 'Nieve moderada', icon: 'AcUnit' },
    75: { text: 'Nieve intensa', icon: 'AcUnit' },
    80: { text: 'Chubascos ligeros', icon: 'Grain' },
    81: { text: 'Chubascos moderados', icon: 'Grain' },
    82: { text: 'Chubascos intensos', icon: 'WaterDrop' },
    95: { text: 'Tormenta', icon: 'Thunderstorm' },
    96: { text: 'Tormenta con granizo ligero', icon: 'Thunderstorm' },
    99: { text: 'Tormenta con granizo intenso', icon: 'Thunderstorm' }
  };
  
  return weatherConditions[weatherCode] || { text: 'Desconocido', icon: 'Help' };
};

// Función para obtener el clima actual usando Open-Meteo
export const getCurrentWeather = async (locationName: string): Promise<WeatherData> => {
  try {
    // Paso 1: Obtener coordenadas usando el API de geocodificación
    const geocodeData: GeocodeResults = await fetchAPIGEO(locationName);
    console.log('Geocode data:', geocodeData);
    
    // Paso 2: Obtener datos del clima usando las coordenadas con Open-Meteo
    
    const weatherPath = `/forecast?latitude=${geocodeData.lat}&longitude=${geocodeData.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&timezone=auto`;
    console.log('Weather path:', weatherPath);
    
    const weatherData = await fetchAPI(weatherPath);
    console.log('Weather API response:', weatherData);
    
    // Verificar que weatherData no sea undefined
    if (!weatherData || !weatherData.current) {
      throw new Error('La API del clima no devolvió datos válidos');
    }
    
    const current = weatherData.current;
    const condition = getWeatherCondition(current.weather_code);
    
    // Paso 3: Formatear los datos para que coincidan con nuestra interfaz
    const formattedData: WeatherData = {
      location: {
        name: geocodeData.name,
        region: '',
        country: '',
        localtime: current.time || new Date().toISOString(),
        lat: geocodeData.lat,
        lon: geocodeData.lon
      },
      current: {
        temp_c: current.temperature_2m || 0,
        temp_f: current.temperature_2m ? (current.temperature_2m * 9/5) + 32 : 0,
        condition: condition,
        humidity: current.relative_humidity_2m || 0,
        wind_kph: current.wind_speed_10m ? current.wind_speed_10m * 3.6 : 0, // m/s a km/h
        wind_dir: current.wind_direction_10m ? `${current.wind_direction_10m}°` : '',
        pressure_mb: current.surface_pressure || 0,
        feelslike_c: current.apparent_temperature || current.temperature_2m || 0,
        uv: 0, 
        vis_km: 0, 
        last_updated: current.time || new Date().toISOString()
      }
    };
    
    return formattedData;
  } catch (error) {
    console.error('Error en getCurrentWeather:', error);
    throw error;
  }
};

// Función adicional para obtener clima por coordenadas directamente
export const getWeatherByCoordinates = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const weatherPath = `/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&timezone=auto`;
    const weatherData = await fetchAPI(weatherPath);
    
    if (!weatherData || !weatherData.current) {
      throw new Error('La API del clima no devolvió datos válidos');
    }
    
    const current = weatherData.current;
    const condition = getWeatherCondition(current.weather_code);
    
    const formattedData: WeatherData = {
      location: {
        name: 'Ubicación desconocida',
        region: '',
        country: '',
        localtime: current.time || new Date().toISOString(),
        lat: lat,
        lon: lon
      },
      current: {
        temp_c: current.temperature_2m || 0,
        temp_f: current.temperature_2m ? (current.temperature_2m * 9/5) + 32 : 0,
        condition: condition,
        humidity: current.relative_humidity_2m || 0,
        wind_kph: current.wind_speed_10m ? current.wind_speed_10m * 3.6 : 0,
        wind_dir: current.wind_direction_10m ? `${current.wind_direction_10m}°` : '',
        pressure_mb: current.surface_pressure || 0,
        feelslike_c: current.apparent_temperature || current.temperature_2m || 0,
        uv: 0,
        vis_km: 0,
        last_updated: current.time || new Date().toISOString()
      }
    };
    
    return formattedData;
  } catch (error) {
    console.error('Error en getWeatherByCoordinates:', error);
    throw error;
  }
};