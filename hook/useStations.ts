import { useEffect, useState } from "react";
import useSpokeStreamStore from "./useSpokeStreamStore";
import { GbfsClient } from "@/libs/gbfs/gbfs-client";

export default function useStations(cityUrl: string)
{
    const setStations = useSpokeStreamStore((state) => state.setStations);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        let ignore = false;
        let hasLoaded = false;

        async function fetchStations()
        {
            if (!hasLoaded) {
                setLoading(true);
            }
            try
            {
                const client = new GbfsClient();
                const data = await client.getGBFS(cityUrl);

                if(!ignore)
                {
                    setStations(data.stations);
                    setLastUpdated(new Date());
                    setError(null);
                }
            } 
            catch (err)
            {
                if(!ignore)
                {
                    setError(err instanceof Error ? err.message : "Unable to load bike share data right now."); 
                }
            }
            finally
            {
                if(!ignore)
                {
                    hasLoaded = true;
                    setLoading(false);
                }
            }
        }

        fetchStations();

        const interval = setInterval(fetchStations, 60000);

        return () => {
            ignore = true;
            clearInterval(interval);
        };
    },[cityUrl, setStations]);

    return { loading, error, lastUpdated };
}