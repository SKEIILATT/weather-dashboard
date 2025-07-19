import Input from "./components/Input";
import LocationDisplay from "./components/LocationDisplay";
import CardInfo from "./components/CardInfo";
import WeatherTrends from "./components/WeatherTrends";
import WindPressureAnalysis from "./components/WindPressureAnalysis";
import ExtendedForecast from "./components/ExtendedForecast";
import DetailedConditionsAnalysis from "./components/DetailedConditionsAnalysis";
import "./index.css";
import Paper from '@mui/material/Paper';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { useState } from 'react';
import cloud from "./assets/cloud.svg"

export const App = () => {
    const [locationLabel, setLocationLabel] = useState<string | null>(null);
    const [locationTimestamp, setLocationTimestamp] = useState<string>("");
    const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);
    const [weatherData, setWeatherData] = useState<any>(null);

    const handleLocationChange = (label: string | null, timestamp: string, coordinates?: {lat: number, lon: number}) => {
        setLocationLabel(label);
        setLocationTimestamp(timestamp);
        if (coordinates) {
            setCoords(coordinates);
        }
    };

    // Función para recibir datos del clima desde CardInfo
    const handleWeatherDataUpdate = (data: any) => {
        setWeatherData(data);
    };

    return (
        <div className="contenedor-principal">
            <header className="header-css">
                <img src={cloud} alt="icono de nube" className="nube-icono" />
                <div>
                    <h1>Dashboard Meteorológico</h1>
                    <p className="texto-header">Monitoreo avanzado en tiempo real con análisis predictivo e inteligencia climática</p>
                    <LocationDisplay label={locationLabel} timestamp={locationTimestamp} />
                </div>
            </header>
            <Paper
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    margin:'20px 10px 0px 10px',
                    borderRadius: '8px',
                    padding: '15px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AddLocationIcon sx={{
                        color:'white',
                        background: 'linear-gradient(to bottom right, #203de3, rgb(200, 18, 200))',
                        padding:'5px',
                        borderRadius:'10px'
                    }}  />
                    <h2 style={{
                        color:'white'
                    }}>Seleccionar Ubicación</h2>
                </div>
                <Input onLocationChange={handleLocationChange}></Input>
            </Paper>
            
            {/* Componente CardInfo para mostrar el clima */}
            <CardInfo 
                lat={coords?.lat} 
                lon={coords?.lon} 
                locationName={locationLabel || undefined}
                onWeatherDataUpdate={handleWeatherDataUpdate}
            />

            {/* Gráficos de análisis climático */}
            <WeatherTrends weatherData={weatherData} />
            <WindPressureAnalysis weatherData={weatherData} />

            {/*Componente ExtendedForecast para pronósticos extendidos*/}
            <ExtendedForecast 
                lat={coords?.lat} 
                lon={coords?.lon} 
                locationName={locationLabel || undefined}
            />

            {/*Componente DetailedConditionsAnalysis para mostrar un análisis detallado del clima*/}
            <DetailedConditionsAnalysis
                lat={coords?.lat} 
                lon={coords?.lon} 
                locationName={locationLabel || undefined}
            />




        </div>
    )
}
