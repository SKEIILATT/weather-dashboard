import {useState} from "react";
import fetchAPIGEO, { type GeocodeResults } from "../services/apiGeo";
import "../stylesheet/input.css";
const Input = () =>{
    const[query, setQuery] = useState("");
    const[coords, setCoords] = useState<{lat:number; lon:number} | null>(null);
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState<string|null>(null);
    const[label,setLabel]=useState<string|null>(null);
    const[timestamp,setTimestamp]=useState<string>("");

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
            setTimestamp(`${date}, ${time}`);
        }
        catch(err:any){
            setError(err.message || "Error desconocido al obtener coordenadas");
        }finally{
            setLoading(false);
        }
    };
    return(
        <div>
            {label && (
                <div className="input-container">
                    <span>📍</span>
                    <span> {label} </span>
                    <span>⭐</span>
                    <span>{timestamp}</span>
                </div>
            )}


            <form onSubmit={handleSubmit}>
                <input type="text" value={query} onChange={(e)=>{
                    setQuery(e.target.value);
                }} placeholder="Escriba tu pais o ciudad"/>
                <button type="submit" disabled={loading} > {loading? "Buscando": "Buscar"}  </button>
            
            </form>
            {error && <p className="mt-4 text-red-500">⚠️ {error}</p>}

            {coords && (
                <div>
                    <h3> Coordenadas encontradas </h3>
                    <ul>
                        <li>Latitud  {coords.lat} </li>
                        <li>Longitud {coords.lon} </li>
                    </ul>
                </div>
            )}
        </div>
    );
};
export default Input;
