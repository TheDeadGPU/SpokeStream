"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
// Source - https://stackoverflow.com/a/74443999
// Posted by Disco
// Retrieved 2026-09-29, License - CC BY-SA 4.0

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import { StationInformation } from '@/libs/gbfs/gbfs-client';

interface LeafletMapProps
{
    stations: StationInformation[];
    onMarkerClick?: (station: StationInformation) => void;
}

export default function LeafletMap({ stations, onMarkerClick }: LeafletMapProps) {
    return (
        <div className='flex w-[100%] rounded-xl'>
            <MapContainer center={[40.730610, -73.935242]} zoom={13} style={{ height: '100vh', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={[1.3521, 103.8198]}>
                    <Popup>Singapore Center</Popup>
                </Marker>
                {stations?.map((station) => {
                    if (typeof station.lat !== 'number' || typeof station.lon !== 'number') {
                        return null;
                    }

                    return (
                        <Marker 
                            key={station.station_id} 
                            position={[station.lat, station.lon]}
                            eventHandlers={{ click: () => onMarkerClick?.(station) }}
                        >
                            <Popup>{station.name}</Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    )
}