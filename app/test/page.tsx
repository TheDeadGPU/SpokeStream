"use client";

import { GbfsClient } from "@/libs/gbfs/gbfs-client";
import { useEffect } from "react";

export default function TestPage() {
  async function fetchGBFSData() {
    const client = new GbfsClient();
    await client.getGBFS("https://gbfs.citibikenyc.com/gbfs/gbfs.json");
  }

  useEffect(() => {
    void fetchGBFSData();
  }, []);

  return (
    <div>
      <h1>Test Page</h1>
    </div>
  );
}