import { useState,useEffect } from "react"
import {fetchAPI} from '../services/api';

interface WeatherData{
    
    
}

interface CardInfoProps{
    lat?:number;
    lon?:number;
}

const CardInfo = ({lat, lon}:CardInfoProps)=>{
    console.log(lat,lon)
    const[weatherData, setWeatherData] = useState<WeatherData| null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error,setError] = useState<string| null>(null);
}