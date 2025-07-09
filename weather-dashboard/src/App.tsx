import Input from "./components/Input.tsx";
import LocationDisplay from "./components/LocationDisplay.tsx";
import "./index.css";
import Paper from '@mui/material/Paper';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { useState } from 'react';
import cloud from "./assets/cloud.svg"

export const App = () => {
    const [locationLabel, setLocationLabel] = useState<string | null>(null);
    const [locationTimestamp, setLocationTimestamp] = useState<string>("");

    const handleLocationChange = (label: string | null, timestamp: string) => {
        setLocationLabel(label);
        setLocationTimestamp(timestamp);
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
        </div>
    )


}
