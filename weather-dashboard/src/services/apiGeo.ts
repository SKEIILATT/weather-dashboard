const BASE_URLGEO = import.meta.env.VITE_API_GEO_URL as string




interface GeocodeResults{
    name:string;
    lat:number;
    lon:number;
}

//Función que nos permite realizar una llamada general para la api de localizaciones
const fetchAPIGEO = async (name: string): Promise<GeocodeResults> =>{
    const url =
    `${BASE_URLGEO}` +
    `name=${encodeURIComponent(name)}` +
    `&count=1` +
    `&language=en` +
    `&format=json`;

    console.log("llamando a: ",url
    )
    const respuesta = await fetch(url);
    if(!respuesta.ok){
        throw new Error("Api no respondió con status $ {respuesta.status}");
    }
    const data = await respuesta.json();
    if(!data.results || data.results.length===0){
        throw new Error("No se encontraron resultados para esta busqueda");
    }
    const pais = data.results[0];
    return {
        name: pais.name,
        lat: pais.latitude,
        lon: pais.longitude
    };
};
export type { GeocodeResults };
export default fetchAPIGEO;
