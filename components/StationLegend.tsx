import L from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function StationLegend() {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const legend = new L.Control({ position: 'bottomright' });

        legend.onAdd = () => {
            const container = L.DomUtil.create('div', 'station-legend');
            container.innerHTML = `
                <h2>Availability Legend</h2>
                <div><span class="station-legend__swatch station-legend__swatch--installed"></span> Installed</div>
                <div><span class="station-legend__swatch station-legend__swatch--not-installed"></span> Not installed</div>
            `;
            L.DomEvent.disableClickPropagation(container);
            return container;
        };

        legend.addTo(map);

        return () => {
            legend.remove();
        };
    }, [map]);

    return null;
}