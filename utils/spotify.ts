import { SpotifyPlaylist } from "@/typings";

export const msToMinutesAndSeconds = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, "0")}`;
};

export const formatPlaylistData = (playlist: SpotifyPlaylist) => ({
  id: playlist.id,
  name: playlist.name,
  description: playlist.description || "No description available",
  url: playlist.external_urls.spotify,
  image: playlist.images[0]?.url || null,
  trackCount: playlist.tracks.total,
  followers: playlist.followers?.total || 0,
  collaborative: playlist.collaborative,
});

export const formatDuration = (seconds: number) => {
  let days = Math.floor(seconds / 86400);
  seconds %= 86400;
  let hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;

  let result = [];
  if (days > 0) result.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) result.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  if (seconds > 0 || result.length === 0)
    result.push(`${seconds} second${seconds > 1 ? "s" : ""}`);

  return result.join(", ");
};

export const handleSpotifyApiError = (error: any) => {
  let message = "Error fetching Spotify data";

  switch (error.statusCode || error.status) {
    case 400:
      message = "Bad Request: Invalid request made to Spotify API.";
      break;
    case 401:
      message = "Unauthorized";
      break;
    case 403:
      message =
        "Forbidden: You do not have permission to access this resource.";
      break;
    case 404:
      message = "Not Found: The requested resource could not be found.";
      break;
    case 429:
      const retryAfter = formatDuration(Number(error.headers["retry-after"]));
      message = `Rate limit hit, please try again after ${retryAfter}.`;
      break;
    case 500:
      message = "Internal Server Error: Spotify is currently unavailable.";
      break;
    case 502:
      message = "Bad Gateway: Invalid response from an upstream server.";
      break;
    case 503:
      message = "Service Unavailable: Spotify servers are temporarily offline.";
      break;
    case 504:
      message =
        "Gateway Timeout: Spotify servers are taking too long to respond.";
      break;
  }

  console.error({ message, error });

  return message;
};
