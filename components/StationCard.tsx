import { useEffect, useState } from "react";
import type { StationInformation } from "../libs/gbfs/gbfs-client";
import useSpokeStreamStore from "@/hook/useSpokeStreamStore";
import { calculateDistance } from "@/libs/helper-functions";

interface StationCardProps {
    station: StationInformation;
    cardRef: (element: HTMLDivElement | null) => void;
    onClick: (station: StationInformation) => void;
}

export default function StationCard({ station, cardRef, onClick }: StationCardProps) {
    const stationAvailabilityPercent = station.capacity && station.capacity > 0
        ? Math.round(((station.num_bikes_available ?? 0) / station.capacity) * 100)
        : null;
    const { activeStation, userLocation } = useSpokeStreamStore();
    const [distance, setDistance] = useState(0);
    
    useEffect(() => {
        if(station.lat && station.lon && userLocation)
        {
            setDistance(calculateDistance(station.lat, station.lon,userLocation.lat, userLocation.lon));
        }
    },[userLocation])
    return (
        <div
            key={station.station_id}
            ref={cardRef}
            className={`rounded-2xl border ${station.station_id == activeStation?.station_id ? "border-emerald-800" : "border-slate-800"} p-4 transition hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:cursor-pointer`}
            onClick={() => onClick(station)}
        >
            <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${station.is_installed == false ? "bg-red-500" : "bg-emerald-500"} shrink-0`} />
                    <p className="text-sm font-medium text-white">
                        {station.name || "Unnamed station"}
                    </p>
                </div>
                <div>
                    {userLocation && (<span className="rounded-full text-sm">{distance.toFixed(1)} miles</span>)}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm text-slate-300">
                <div className="rounded-xl bg-slate-800/80 p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                        Bikes
                    </p>
                    <p className="mt-2 text-xl font-semibold text-cyan-300">
                        {station.num_bikes_available ?? 0}
                    </p>
                </div>
                <div className="rounded-xl bg-slate-800/80 p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                        Docks
                    </p>
                    <p className="mt-2 text-xl font-semibold text-emerald-300">
                        {station.num_docks_available ?? 0}
                    </p>
                </div>

                <div className="rounded-xl bg-slate-800/80 p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                        Ebikes
                    </p>
                    <p className="mt-2 text-xl font-semibold text-yellow-300">
                        {station.num_ebikes_available ?? 0}
                    </p>
                </div>
            </div>
        </div>
    )
}