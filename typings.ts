export type SpotifyPlaylist = {
  id: string;
  name: string;
  description: string | null;
  external_urls: {
    spotify: string;
  };
  images: SpotifyApi.ImageObject[];
  tracks: {
    total: number;
  };
  followers?: {
    total: number;
  };
  collaborative: boolean;
};

export type Playlist = {
  id: string;
  name: string;
  description: string;
  url: string;
  image: string | null;
  trackCount: number;
  followers: number;
  collaborative: boolean;
};

export type InputSongAudioFeatures = {
  danceability: number;
  energy: number;
  acousticness: number;
  valence: number;
  tempo: number;
};

export type Song = {
  image: string;
  name: string;
  url: string;
  artist: string;
  album: string;
  duration: string;
  category:
    | "Happy"
    | "Sad"
    | "Calm"
    | "Energetic"
    | "Confident"
    | "Instrumental";
};

export type Category =
  | "happy"
  | "sad"
  | "energetic"
  | "calm"
  | "confident"
  | "instrumental";

export type TrackWithCategory = {
  track: SpotifyApi.TrackObjectFull;
  category: Category;
};
