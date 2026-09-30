"use client";

import useSpokeStreamStore from "@/hook/useSpokeStreamStore";
import { IconMapPin } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function LocateButton() {
    const [locatingUser, setLocatingUser] = useState(false);
    const {
        mapRef,
        userLocation,
        setUserLocation,
    } = useSpokeStreamStore();

    function handleRequestLocation() {
        if (!navigator.geolocation) {
            console.warn('Geolocation is not supported by your browser');
            return;
        }
        setLocatingUser(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setUserLocation({ lat: latitude, lon: longitude });
                //setSortBy('distance');
                setLocatingUser(false);
            },
            (err) => {
                console.warn('Geolocation error:', err);
                setLocatingUser(false);
            }
        );
    }

    useEffect(() => {
        if (userLocation) {
            mapRef.current?.flyTo([userLocation?.lat, userLocation?.lon], 13)
        }
    }, [userLocation])

    return (
        <button
            onClick={handleRequestLocation}
            disabled={locatingUser}
            title="Sort by proximity to my location"
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${userLocation ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
        >
            <IconMapPin className={`w-4 h-4 ${locatingUser ? 'text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">{userLocation ? 'Near Me' : 'Locate'}</span>
        </button>
    )
}