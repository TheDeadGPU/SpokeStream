"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { GbfsClient, PRESET_CITIES, StationInformation } from "@/libs/gbfs/gbfs-client";
import StationCard from "@/components/StationCard";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-[100vh] w-full" />,
});

type CityOption = (typeof PRESET_CITIES)[number];

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<CityOption>(PRESET_CITIES[0]);
  const [stations, setStations] = useState<
    Awaited<ReturnType<GbfsClient["getGBFS"]>>["stations"]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadStations() {
      setLoading(true);
      setError(null);

      try {
        const client = new GbfsClient();
        const data = await client.getGBFS(selectedCity.url);

        if (!ignore) {
          setStations(data.stations);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load bike share data right now.",
          );
          setStations([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadStations();

    return () => {
      ignore = true;
    };
  }, [selectedCity]);

  const summary = useMemo(() => {
    const totalBikes = stations.reduce(
      (sum, station) => sum + (station.num_bikes_available ?? 0),
      0,
    );
    const totalDocks = stations.reduce(
      (sum, station) => sum + (station.num_docks_available ?? 0),
      0,
    );

    const totalEbikes = stations.reduce(
      (sum, station) => sum + (station.num_ebikes_available ?? 0),
      0,
    );
    const activeStations = stations.filter(
      (station) => station.is_installed !== false,
    ).length;

    return {
      totalBikes,
      totalDocks,
      activeStations,
      totalEbikes,
    };
  }, [stations]);

  const activeStationRef = useRef<HTMLDivElement | null>(null);
  const stationCardRefs = useRef(new Map<string, HTMLDivElement>());

  function scrollToStation(station: StationInformation) {
    const card = stationCardRefs.current.get(station.station_id) ?? null;
    activeStationRef.current = card;
    card?.scrollIntoView({behavior:"smooth", block:"start"});
  }

  return (
    <main className="min-h-screen bg-[#050816] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-5 shadow-[0_0_30px_rgba(34,211,238,0.15)] backdrop-blur-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-cyan-300/80">
              SpokeStream
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Live bike network status
            </h1>
          </div>

          <label className="flex min-w-0 flex-col gap-2 text-sm text-slate-300">
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
              City feed
            </span>
            <select
              value={selectedCity.name}
              onChange={(event) => {
                const city = PRESET_CITIES.find(
                  (option) => option.name === event.target.value,
                );

                if (city) {
                  setSelectedCity(city);
                }
              }}
              className="rounded-xl border border-cyan-400/30 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 shadow-inner shadow-cyan-500/10 outline-none transition focus:border-cyan-300"
            >
              {PRESET_CITIES.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          {[
            { label: "Available bikes", value: summary.totalBikes.toLocaleString(), accent: "cyan" },
            { label: "Available e-bikes", value: summary.totalEbikes.toLocaleString(), accent: "yellow" },
            { label: "Open docks", value: summary.totalDocks.toLocaleString(), accent: "emerald" },
            { label: "Active stations", value: summary.activeStations.toLocaleString(), accent: "violet" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-[0_0_20px_rgba(15,23,42,0.8)]"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {item.label}
              </p>
              <p
                className={`mt-4 text-3xl font-semibold text-${item.accent}-300`}
              >
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-[0_0_20px_rgba(15,23,42,0.8)] sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Network overview
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                {selectedCity.name}
              </h2>
            </div>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
              {loading ? "Syncing" : "Live"}
              {!loading && (
                <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              )}
            </span>
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
              {error}
            </div>
          ) : loading ? (
            <div className="grid gap-4 grid-cols-1">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/80"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-row gap-4">
              <div className="grid gap-4 grid-cols-1 h-[100vh] overflow-y-auto">
                {stations.map((station) => (
                  <StationCard 
                  station={station} 
                  key={station.station_id}
                  cardRef={(element) => {
                    if(element) stationCardRefs.current.set(station.station_id, element);
                    else stationCardRefs.current.delete(station.station_id);
                  }} />
                ))}
              </div>
              <div className="flex w-full">
                <LeafletMap stations={stations} onMarkerClick={scrollToStation} />
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
