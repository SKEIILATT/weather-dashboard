const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const fetchAPI = async (path: string) => {
    try {
        const url = `${BASE_URL}${path}`;
        console.log('Llamando a URL:', url); 
        
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            
            throw new Error(`API respondió con status ${respuesta.status}: ${respuesta.statusText}`);
        }
        
        const data = await respuesta.json();
        console.log('Respuesta de API:', data); 
        return data;
    } catch (error) {
        console.error("Error en fetchAPI:", error);
        throw error;
    }
}
