//Archivo que nos sirve para realizar las llamadas a la API general
const BASE_URL = import.meta.env.VITE_API_BASE_URL as string
//Función que nos permite realizar una llamada a la api general del clima
export const fetchAPI =  async (path: string) =>{
    try{
        const respuesta = await fetch(`${BASE_URL}${path}`); 
        if (!respuesta.ok){
            throw new Error("No se obtuvo respuesta de la api");
        }  
        return await respuesta.json();
    }
    catch(error){
        console.error("Ha ocurrido un error", error);
    }
}

