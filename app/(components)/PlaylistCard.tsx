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
import Categorize from "./Buttons/CategorizeButton";
import UnfollowPlaylist from "./Buttons/UnfollowPlaylist";

const PlaylistCard = ({ playlist }: { playlist: Playlist }) => {
  return (
    <>
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
              <DropdownMenu modal={true}>
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
                  {/* <DropdownMenuSeparator className="bg-gray-800" /> */}
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
          <div className="grid grid-cols-3 gap-2 w-full">
            <Button
              asChild
              className="bg-primary hover:bg-primary/75 text-gray-800 flex flex-col items-center justify-center h-auto py-2 px-1 sm:flex-row sm:py-2 sm:px-3"
            >
              <Link
                href={playlist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col sm:flex-row items-center"
              >
                <ExternalLink className="w-4 h-4 mb-1 sm:mr-2 sm:mb-0" />
                <span className="text-xs sm:text-sm">Open in Spotify</span>
              </Link>
            </Button>
            <Categorize playlistId={playlist.id} />
            <UnfollowPlaylist
              playlistId={playlist.id}
              playlistName={playlist.name}
              totalTracks={playlist.trackCount}
            />
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default PlaylistCard;
