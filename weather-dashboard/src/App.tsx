import Input from "./components/Input.tsx";
import "./index.css"; 

import cloud from "./assets/cloud.svg"
export const App = () =>{
    return(
        <div className="contenedor-principal">
            <header className="header-css">
                <img src= {cloud} alt="icono de nube" className="nube-icono" />
                <div>
                    <h1>Dashboard Meteorológico</h1>
                    <p className="texto-header">Monitoreo avanzado en tiempo real con análisis predictivo e inteligencia climática</p>
                </div>                
            </header>
            <section className="seccion-input">
                <h2>Seleccionar Ubicación</h2>
                <Input/>
            </section>
        </div>
    )


}
