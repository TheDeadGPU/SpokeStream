
export const PRESET_CITIES = [
  { name: "Citi Bike (New York, NY)", url: "https://gbfs.citibikenyc.com/gbfs/gbfs.json" },
  { name: "Capital Bikeshare (Washington, DC)", url: "https://gbfs.capitalbikeshare.com/gbfs/gbfs.json" },
  { name: "Divvy (Chicago, IL)", url: "https://gbfs.divvybikes.com/gbfs/gbfs.json" },
  { name: "Bluebikes (Boston, MA)", url: "https://gbfs.bluebikes.com/gbfs/gbfs.json" },
  { name: "B-cycle (Austin, TX)", url: "https://gbfs.austinbcycle.com/gbfs/gbfs.json" },
  { name: "Santander Cycles (London, UK)", url: "https://gbfs.shared.bike/gbfs/gbfs.json" },
] as const;

interface Feed {
  name: string;
  url: string;
}

interface GBFSManifest {
  last_updated: number;
  ttl: number;
  version: string;
  data: Record<string, { feeds?: Feed[] }>;
}

export interface StationInformation {
  station_id: string;
  name: string;
  short_name?: string;
  lon?: number;
  lat?: number;
  region_id?: string;
  capacity?: number;
  has_kiosk?: boolean;
  station_type?: string;
  external_id?: string;
  is_installed?: boolean;
  is_renting?: boolean;
  is_returning?: boolean;
  last_reported?: number;
  legacy_id?: string;
  num_bikes_available?: number;
  num_bikes_disabled?: number;
  num_docks_available?: number;
  num_docks_disabled?: number;
  num_ebikes_available?: number;
}

export interface CompiledGBFSSystem {
  version: string;
  last_updated: number;
  stations: StationInformation[];
}

interface StationStatusData {
  last_updated: number;
  data: {
    stations: StationInformation[];
  };
}

export class GbfsClient {
  private async fetchJson<T>(url: string, label: string): Promise<T> {
    if (!url?.trim()) {
      throw new Error(`${label} URL is missing`);
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`${label} request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  }

  private getFeedUrl(feeds: Feed[], feedName: string): string {
    const matchingFeed = feeds.find(
      (feed) => feed.name.toLowerCase() === feedName.toLowerCase(),
    );

    if (!matchingFeed?.url) {
      throw new Error(`Missing "${feedName}" feed in GBFS manifest`);
    }

    return matchingFeed.url;
  }

  public async getGBFS(systemUrl: string): Promise<CompiledGBFSSystem> {
    const manifest = await this.fetchJson<GBFSManifest>(systemUrl, "GBFS manifest");

    if (
      typeof manifest?.last_updated !== "number" ||
      typeof manifest?.version !== "string" ||
      !manifest?.data
    ) {
      throw new Error("Invalid GBFS manifest format");
    }

    const feeds = Object.values(manifest.data).flatMap((section) =>
      Array.isArray(section?.feeds) ? section.feeds : [],
    );

    if (!feeds.length) {
      throw new Error("GBFS manifest does not contain any feed URLs");
    }


    // Get Station Status
    const stationStatusUrl = this.getFeedUrl(feeds, "station_status");
    const stationStatus = await this.fetchJson<StationStatusData>(
      stationStatusUrl,
      "station status",
    );

    // Get Station Information
    const stationInformationUrl = this.getFeedUrl(feeds, "station_information");
    const stationInformation = await this.fetchJson<StationStatusData>(
      stationInformationUrl,
      "station information",
    );

    // Merge Station Information with Station Status
    const mergedStations = stationStatus?.data?.stations.map((statusStation) => {
      const infoStation = stationInformation?.data?.stations.find(
        (info) => info.station_id === statusStation.station_id,
      );
      return {
        ...statusStation,
        ...infoStation,
      };
    }) ?? []; 



    return {
      version: manifest.version,
      last_updated: stationStatus?.last_updated ?? manifest.last_updated,
      stations: mergedStations as StationInformation[],
    };
  }

  public async GetGBFS(systemUrl: string): Promise<CompiledGBFSSystem> {
    return this.getGBFS(systemUrl);
  }
}