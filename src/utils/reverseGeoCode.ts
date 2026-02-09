import axios from "axios";

export const reverseGeocode = async (
  latitude: number,
  longitude: number,
): Promise<string> => {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/reverse",
    {
      params: {
        lat: latitude,
        lon: longitude,
        format: "json",
      },
      headers: {
        "User-Agent": "vehicle-tracking-app",
      },
    },
  );

  const address = response.data.address;

  return (
    address?.road ||
    address?.suburb ||
    address?.city ||
    address?.town ||
    address?.village ||
    "Unknown location"
  );
};
