import {useState} from "react";
import fetchAPIGEO, { type GeocodeResults } from "../services/apiGeo";

interface InputProps {
    onLocationChange?: (label: string | null, timestamp: string, coords?: {lat: number, lon: number}) => void;
}

const Input = ({ onLocationChange }: InputProps) =>{
    const[query, setQuery] = useState("");
    // @ts-ignore - Used in handleSubmit
    const[coords, setCoords] = useState<{lat:number; lon:number} | null>(null);
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState<string|null>(null);
    // @ts-ignore - Used in handleSubmit
    const[label, setLabel] = useState<string|null>(null);
    // @ts-ignore - Used in handleSubmit
    const[timestamp, setTimestamp] = useState<string>("");

    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        const name = query.trim();
        if(!name){
            return;
        }
        setLoading(true);
        setCoords(null);
        setError(null);

        try{
            const result: GeocodeResults = await fetchAPIGEO(name);
            setCoords({lat:result.lat , lon:result.lon});
            setLabel(result.name);
            const now = new Date();
            const date =now.toLocaleDateString("es-ES");
            const time = now.toLocaleTimeString("es-ES");
            const newTimestamp = `${date}, ${time}`;
            setTimestamp(newTimestamp);
            
            // Enviar los datos al componente padre
            if (onLocationChange) {
                onLocationChange(result.name, newTimestamp, {lat: result.lat, lon: result.lon});
            }
        }
        catch(err:any){
            setError(err.message || "Error desconocido al obtener coordenadas");
        }finally{
            setLoading(false);
        }
    };
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input className="input-busqueda" type="text" value={query} onChange={(e)=>{
                    setQuery(e.target.value);
                }} placeholder="Escriba tu pais o ciudad"/>
                <button type="submit" disabled={loading}> {loading ? "Buscando" : "Buscar"}  </button>
            
            </form>
            {error && <p className="mt-4 text-red-500">⚠️ {error}</p>}
        </div>
    );
};
export default Input;
