import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, User, Music4, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DummyCover from "@/public/dummy-cover.jpg";
import { Playlist } from "@/typings";
import PlaylistLoadingCard from "./loading/PlaylistLoadingCard";
import CategorizeButton from "./CategorizeButton";

const PlaylistCard = ({ playlist }: { playlist: Playlist }) => {
  return (
    <Card
      key={playlist.id}
      className="flex flex-col justify-between overflow-hidden h-full bg-gray-900 border-gray-800"
    >
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={playlist.image ?? DummyCover}
            alt={playlist.name}
            width={400}
            height={400}
            className="w-full h-96 object-cover"
          />
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-gray-900 text-gray-200 hover:bg-gray-800"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-gray-900 text-gray-200 border-gray-800"
              >
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem className="hover:bg-gray-800">
                  Edit Playlist
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800">
                  Share Playlist
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="text-red-400 hover:bg-gray-800">
                  Delete Playlist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-gray-100 mb-3">{playlist.name}</CardTitle>
        <CardDescription className="text-gray-400">
          {playlist.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col p-4 gap-4">
        <div className="flex justify-between items-center w-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-gray-300">
                  <Music4 className="w-4 h-4 mr-2" />
                  <span>{playlist.trackCount} tracks</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 text-gray-200">
                <p>Number of tracks in the playlist</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-gray-300">
                  <User className="w-4 h-4 mr-2" />
                  <span>{playlist.followers} followers</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 text-gray-200">
                <p>Number of followers for this playlist</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex justify-between w-full space-x-4">
          <Button
            asChild
            className="w-full bg-primary hover:bg-green-800 hover:text-gray-300 text-gray-800"
          >
            <Link href={playlist.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-3 h-4 w-4" />
              Open in Spotify
            </Link>
          </Button>
          <CategorizeButton playlistId={playlist.id} />
        </div>
      </CardFooter>
    </Card>
  );
};

const SpotifyPlaylists = ({ playlists }: { playlists: Playlist[] }) => {
  return (
    <div className="w-full mx-auto p-4 bg-black text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-100">
        Your Spotify Playlists
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {playlists.map((playlist: Playlist) => (
          <Suspense key={playlist.id} fallback={<PlaylistLoadingCard />}>
            <PlaylistCard playlist={playlist} />
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default SpotifyPlaylists;
