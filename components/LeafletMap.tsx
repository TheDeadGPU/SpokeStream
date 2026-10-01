"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Map as LeafletMapInstance } from "leaflet";
// Source - https://stackoverflow.com/a/74443999
// Posted by Disco
// Retrieved 2026-09-29, License - CC BY-SA 4.0

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import { StationInformation } from '@/libs/gbfs/gbfs-client';
import useSpokeStreamStore from '@/hook/useSpokeStreamStore';
import StationLegend from './StationLegend';


interface LeafletMapProps {
    onMarkerClick?: (station: StationInformation) => void;
}



export default function LeafletMap({ onMarkerClick }: LeafletMapProps) {

    const icons = {
        redIcon: new L.Icon({
            iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }),
        green: new L.Icon({
            iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }),
        blue: new L.Icon({
            iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    };

    const {
        stations,
        activeStation,
        setActiveStation,
        mapRef,
    } = useSpokeStreamStore();

    return (
        <div className='flex w-[100%] rounded-xl'>
            <MapContainer ref={mapRef} center={[40.730610, -73.935242]} zoom={13} style={{ height: '100vh', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <StationLegend />
                {stations?.map((station) => {
                    if (typeof station.lat !== 'number' || typeof station.lon !== 'number') {
                        return null;
                    }

                    return (
                        <Marker
                            key={station.station_id}
                            position={[station.lat, station.lon]}
                            eventHandlers={{ click: () => setActiveStation(station) }}
                            icon={station.is_installed ? icons.green : icons.redIcon}
                        >
                            <Popup>
                                <strong>{station.name}</strong>
                                <div className='flex gap-1'>
                                    <p className="text-xs font-bold">🚴 Bikes Available:</p>
                                    <p className="text-xs"> {station.num_bikes_available}</p>
                                </div>
                                <div className='flex gap-1'>
                                    <p className="text-xs font-bold">⚡ E-Bikes Available:</p>
                                    <p className="text-xs"> {station.num_ebikes_available}</p>
                                </div>
                                <div className='flex gap-1'>
                                    <p className="text-xs font-bold">🅿️ Docks Available:</p>
                                    <p className="text-xs"> {station.num_docks_available}</p>
                                </div>
                                <div className='flex gap-1'>
                                    <p className="text-xs font-bold">Capacity:</p>
                                    <p className="text-xs"> {station.capacity}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    )
}