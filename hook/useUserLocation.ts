"use client";

import { useState } from "react";
import useSpokeStreamStore from "./useSpokeStreamStore";

export default function useUserLocation()
{
    const setUserLocation = useSpokeStreamStore((state) => state.setUserLocation);
    const [isLocating, setIsLocating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    function requestLocation()
    {
        if(typeof navigator === "undefined" || !navigator.geolocation)
        {
            setError("Cannot get geolocation from this browser.");
            return;
        }

        setIsLocating(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            ({coords}) => {
                setUserLocation({lat: coords.latitude, lon: coords.longitude});
                setIsLocating(false)
            },
            (geolocationError) => {
                setError(geolocationError.message || "Unable to get your location.");
                setIsLocating(false);
            },
        );
    }

    return { isLocating, error, requestLocation };
}