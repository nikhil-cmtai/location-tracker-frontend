// components/JourneyReplayMap.tsx

"use client";
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
    journeyData: [number, number][];
    isPlaying: boolean;
    replaySpeed: number;
    replayKey: number;
}

const icon = L.icon({
    iconUrl: "/marker-icon.png",
    iconRetinaUrl: "/marker-icon-2x.png",
    shadowUrl: "/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function MapController({ position }: { position: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.panTo(position);
        }
    }, [position, map]);
    return null;
}

export default function JourneyReplayMap({ journeyData, isPlaying, replaySpeed, replayKey }: MapProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setCurrentIndex(0);
    }, [replayKey, journeyData]);

    useEffect(() => {
        if (!isPlaying || currentIndex >= journeyData.length - 1) {
            return;
        }

        const delay = 1000 / replaySpeed;
        const timer = setTimeout(() => {
            setCurrentIndex(prevIndex => prevIndex + 1);
        }, delay);

        return () => clearTimeout(timer);
    }, [isPlaying, currentIndex, journeyData, replaySpeed]);

    if (!journeyData || journeyData.length === 0) {
        return (
            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        );
    }
    
    const currentPosition: [number, number] = journeyData[currentIndex];

    return (
        <MapContainer center={currentPosition} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline pathOptions={{ color: 'blue' }} positions={journeyData} />
            <Marker position={currentPosition} icon={icon} />
            <MapController position={currentPosition} />
        </MapContainer>
    );
}