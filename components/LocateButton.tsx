"use client";

import useSpokeStreamStore from "@/hook/useSpokeStreamStore";
import useUserLocation from "@/hook/useUserLocation";
import { IconMapPin } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function LocateButton() {
    const { userLocation } = useSpokeStreamStore();
    const { isLocating, error, requestLocation } = useUserLocation();

    return (
        <button
            onClick={requestLocation}
            disabled={isLocating}
            title="Sort by proximity to my location"
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${userLocation ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
        >
            <IconMapPin className={`w-4 h-4 ${isLocating ? 'text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">{userLocation ? 'Near Me' : 'Locate'}</span>
        </button>
    )
}