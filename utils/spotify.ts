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

export const handleSpotifyApiError = (error: any) => {
  if (error?.response?.status === 401) {
    console.error("Unauthorized error: Spotify token expired", error);
    throw new Error("Unauthorized: Spotify token expired.");
  }
  if (error?.response?.status === 429) {
    console.error("Rate limit hit, please try again later.", error);
    throw new Error("Spotify rate limit exceeded, please try again later.");
  }
  console.error("Error fetching Spotify data:", error);
  throw new Error(`Failed to fetch Spotify data: ${error.message || error}`);
};
