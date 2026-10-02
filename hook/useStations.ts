import { useEffect, useState } from "react";
import useSpokeStreamStore from "./useSpokeStreamStore";
import { GbfsClient } from "@/libs/gbfs/gbfs-client";

export default function useStations(cityUrl: string)
{
    const setStations = useSpokeStreamStore((state) => state.setStations);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let ignore = false;

        async function loadStations()
        {
            setLoading(true);
            setError(null);

            try
            {
                const client = new GbfsClient();
                const data = await client.getGBFS(cityUrl);

                if(!ignore)
                {
                    setStations(data.stations);
                }
            } 
            catch (err)
            {
                if(!ignore)
                {
                    setError(err instanceof Error ? err.message : "Unable to load bike share data right now.");
                    setStations([]);
                    
                }
            }
            finally
            {
                if(!ignore)
                {
                    setLoading(false);
                }
            }
        }

        loadStations();

        return () => {
            ignore = true;
        };
    },[cityUrl, setStations]);

    return { loading, error };
}