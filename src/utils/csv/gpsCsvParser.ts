export type ParsedGPSRow = {
  latitude: number;
  longitude: number;
  timestamp: Date;
  ignition: "on" | "off";
};

export function parseRow(row: string): ParsedGPSRow | null {
  const parts = row.split(",");

  if (parts.length !== 4) return null;

  const latitude = Number(parts[0]);
  const longitude = Number(parts[1]);
  const timestamp = new Date(parts[2]);
  const ignition = parts[3] as "on" | "off";

  if (
    Number.isNaN(latitude) ||
    Number.isNaN(longitude) ||
    isNaN(timestamp.getTime()) ||
    !["on", "off"].includes(ignition)
  ) {
    return null;
  }

  return { latitude, longitude, timestamp, ignition };
}
