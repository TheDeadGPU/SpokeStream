import type { StationInformation } from "../libs/gbfs/gbfs-client";

interface StationCardProps {
    station: StationInformation;
    cardRef: (element: HTMLDivElement | null) => void;
    onClick: (station: StationInformation) => void;
}

export default function StationCard({ station, cardRef, onClick }: StationCardProps) {
    const stationAvailabilityPercent = station.capacity && station.capacity > 0
        ? Math.round(((station.num_bikes_available ?? 0) / station.capacity) * 100)
        : null;
    return (
        <div
            key={station.station_id}
            ref={cardRef}
            className="rounded-2xl border border-slate-800 p-4 transition hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:cursor-pointer"
            onClick={() => onClick(station)}
        >
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-white">
                        {station.name || "Unnamed station"}
                    </p>
                </div>
                <span
                    className={`rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] ${station.is_installed == false
                            ? "bg-rose-500/10 text-rose-300"
                            : "bg-emerald-500/10 text-emerald-300"
                        }`}
                >
                    {station.is_installed == false ? "Offline" : "Open"}
                    {station.is_installed == true && ` · ${stationAvailabilityPercent !== null ? `${stationAvailabilityPercent}%` : ""}`}
                </span>
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