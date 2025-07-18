import { useState, useEffect } from "react";
import { getWeatherByCoordinates, type WeatherData } from '../services/weatherService';
import WeatherIcon from './WeatherIcon';

interface CardInfoProps {
    lat?: number;
    lon?: number;
    locationName?: string;
    onWeatherDataUpdate?: (data: any) => void;
}

const CardInfo = ({ lat, lon, locationName, onWeatherDataUpdate }: CardInfoProps) => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadWeatherData = async () => {
            if (!lat || !lon) {
                setWeatherData(null);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const data = await getWeatherByCoordinates(lat, lon);
                // Si tenemos un nombre de ubicación, lo usamos en lugar del por defecto
                if (locationName && data) {
                    data.location.name = locationName;
                }
                setWeatherData(data);
                
                // Pasar los datos al componente padre para los gráficos
                if (onWeatherDataUpdate) {
                    onWeatherDataUpdate(data);
                }
            } catch (err: any) {
                setError(err.message || "Error al cargar datos del clima");
            } finally {
                setLoading(false);
            }
        };

        loadWeatherData();
    }, [lat, lon]);

    if (loading) {
        return (
            <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                margin: '20px 0',
                backdropFilter: 'blur(10px)'
            }}>
                Cargando datos del clima...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                color: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderRadius: '12px',
                margin: '20px 0',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 107, 107, 0.3)'
            }}>
                ⚠️ {error}
            </div>
        );
    }

    if (!weatherData) {
        return (
            <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                color: 'rgba(255, 255, 255, 0.7)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                margin: '20px 0',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                Selecciona una ubicación para ver el clima
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
            {/* Header con ubicación y condición principal */}
            <div style={{ 
                textAlign: 'center', 
                marginBottom: '24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                paddingBottom: '16px'
            }}>
                <h2 style={{ 
                    color: 'white', 
                    margin: '0 0 8px 0',
                    fontSize: '24px',
                    fontWeight: 'bold'
                }}>
                    {weatherData.location.name}
                </h2>
                
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                }}>
                    <WeatherIcon 
                        iconName={weatherData.current.condition.icon} 
                        size="large" 
                        color="white" 
                    />
                    <span style={{ 
                        fontSize: '48px', 
                        fontWeight: 'bold', 
                        color: 'white' 
                    }}>
                        {Math.round(weatherData.current.temp_c)}°C
                    </span>
                </div>
                
                <p style={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    margin: 0,
                    fontSize: '18px',
                    textTransform: 'capitalize'
                }}>
                    {weatherData.current.condition.text}
                </p>
            </div>

            {/* Grid con información detallada */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px' 
            }}>
                {/* Sensación térmica */}
                <div style={{ 
                    padding: '16px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <h4 style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 8px 0' }}>
                        🌡️ Sensación térmica
                    </h4>
                    <p style={{ fontSize: '20px', margin: 0, color: 'white', fontWeight: 'bold' }}>
                        {Math.round(weatherData.current.feelslike_c)}°C
                    </p>
                </div>

                {/* Humedad */}
                <div style={{ 
                    padding: '16px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <h4 style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 8px 0' }}>
                        💧 Humedad
                    </h4>
                    <p style={{ fontSize: '20px', margin: 0, color: 'white', fontWeight: 'bold' }}>
                        {weatherData.current.humidity}%
                    </p>
                </div>

                {/* Viento */}
                <div style={{ 
                    padding: '16px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <h4 style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 8px 0' }}>
                        💨 Viento
                    </h4>
                    <p style={{ fontSize: '20px', margin: 0, color: 'white', fontWeight: 'bold' }}>
                        {Math.round(weatherData.current.wind_kph)} km/h
                    </p>
                    <p style={{ fontSize: '14px', margin: '4px 0 0 0', color: 'rgba(255, 255, 255, 0.7)' }}>
                        {weatherData.current.wind_dir}
                    </p>
                </div>

                {/* Presión */}
                <div style={{ 
                    padding: '16px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <h4 style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 8px 0' }}>
                        📊 Presión
                    </h4>
                    <p style={{ fontSize: '20px', margin: 0, color: 'white', fontWeight: 'bold' }}>
                        {Math.round(weatherData.current.pressure_mb)} hPa
                    </p>
                </div>
            </div>

            {/* Footer con última actualización */}
            <div style={{ 
                textAlign: 'center', 
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                <p style={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    margin: 0,
                    fontSize: '12px'
                }}>
                    Última actualización: {new Date(weatherData.current.last_updated).toLocaleString('es-ES')}
                </p>
            </div>
        </div>
    );
};

export default CardInfo;
