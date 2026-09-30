"use client";

import { StationInformation } from "@/libs/gbfs/gbfs-client";
import useSpokeStreamStore from "@/hook/useSpokeStreamStore";
import StationCard from "./StationCard";
import { useEffect, useMemo, useRef, useState } from "react";
import { IconMapPin, IconSearch } from "@tabler/icons-react";
import LocateButton from "./LocateButton";

export default function StationList() {

    const {
        stations,
        activeStation,
        setActiveStation,
        mapRef
    } = useSpokeStreamStore();
    const stationCardRefs = useRef(new Map<string, HTMLDivElement>());
    const [searchQuery, setSearchQuery] = useState("");

    function mapPanToStation(station: StationInformation | null) {
        if (mapRef.current && station && typeof station.lat === 'number' && typeof station.lon === 'number') {
            mapRef.current.flyTo([station.lat, station.lon], 18);
        }
    }
    function scrollToStation(station: StationInformation | null) {
        if (station) {
            console.log("Going to station");
            const card = stationCardRefs.current.get(station.station_id) ?? null;
            //activeStationRef.current = card;
            card?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    useEffect(() => {
        mapPanToStation(activeStation);
        scrollToStation(activeStation);
    }, [activeStation])

    const normalizedQuery = searchQuery.toLowerCase();
    const filteredStations = useMemo(() => {
        if (!normalizedQuery) return stations;
        return stations.filter((station) => station.name.toLowerCase().includes(normalizedQuery));
    }, [stations, normalizedQuery]);
    return (
        <div className="flex w-[350px] shrink-0 flex-col">
            <div>
                <div className="relative flex-1">
                    <IconSearch className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search station by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <LocateButton/>
                </div>
            </div>
            <div className="grid gap-4 grid-cols-1 h-[100vh] overflow-y-auto">
                {filteredStations && filteredStations.map((station) => (
                    <StationCard
                        station={station}
                        key={station.station_id}
                        cardRef={(element) => {
                            if (element) stationCardRefs.current.set(station.station_id, element);
                            else stationCardRefs.current.delete(station.station_id);
                        }}
                        onClick={() => setActiveStation(station)}
                    />
                ))}
                {filteredStations.length == 0 && (
                    <div>
                        <p className="text-center">No stations match your criteria</p>
                    </div>
                )}
            </div>
        </div>
    )
}