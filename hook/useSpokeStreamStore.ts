import {create} from "zustand";
import type { StationInformation } from "@/libs/gbfs/gbfs-client";
import type { Map as LeafletMapInstance } from "leaflet";

interface SpokeStreamState {
    stations: StationInformation[];
    activeStation: StationInformation | null;
    mapRef: React.RefObject<LeafletMapInstance | null>;
    setStations: (stations: StationInformation[]) => void;
    addStation: (station: StationInformation) => void;
    setActiveStation: (station: StationInformation | null) => void;
    setMapRef: (mapRef: React.RefObject<LeafletMapInstance | null>) => void;
}

const useSpokeStreamStore = create<SpokeStreamState>((set) => ({
    stations: [],
    activeStation: null,
    mapRef: { current: null },
    setStations: (stations: StationInformation[]) => set({ stations }),
    addStation: (station: StationInformation) => set((state) => ({ stations: [...state.stations, station] })),
    setActiveStation: (station: StationInformation | null) => set({ activeStation: station }),
    setMapRef: (mapRef: React.RefObject<LeafletMapInstance | null>) => set({ mapRef }),
}));

export default useSpokeStreamStore;