"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Song = {
  id: number;
  image: string;
  name: string;
  artist: string;
  album: string;
  duration: string;
  spotifyLink: string;
};

type Category = {
  name: string;
  color: string;
  songs: Song[];
};

type SortKey = "name" | "album" | "duration";

const CategorizedSongsDropdown = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>(null);

  const categories: Category[] = [
    {
      name: "Happy",
      color: "bg-yellow-100 text-yellow-800",
      songs: [
        {
          id: 1,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Happy",
          artist: "Pharrell Williams",
          album: "G I R L",
          duration: "3:53",
          spotifyLink: "https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH",
        },
        {
          id: 2,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Good Vibrations",
          artist: "The Beach Boys",
          album: "Smiley Smile",
          duration: "3:39",
          spotifyLink: "https://open.spotify.com/track/5t9KYe0Fhd5cW6UYT4qP8F",
        },
        {
          id: 3,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Walking on Sunshine",
          artist: "Katrina and The Waves",
          album: "Katrina and The Waves",
          duration: "3:58",
          spotifyLink: "https://open.spotify.com/track/05wIrZSwuaVWhcv5FfqeH0",
        },
      ],
    },
    {
      name: "Sad",
      color: "bg-blue-100 text-blue-800",
      songs: [
        {
          id: 4,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Someone Like You",
          artist: "Adele",
          album: "21",
          duration: "4:45",
          spotifyLink: "https://open.spotify.com/track/1T4Y1S1n9RXQOOAue9eVsL",
        },
        {
          id: 5,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Hurt",
          artist: "Johnny Cash",
          album: "American IV: The Man Comes Around",
          duration: "3:38",
          spotifyLink: "https://open.spotify.com/track/28cnXtME493VX9NOw9cIUh",
        },
        {
          id: 6,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "The Sound of Silence",
          artist: "Simon & Garfunkel",
          album: "Wednesday Morning, 3 A.M.",
          duration: "3:05",
          spotifyLink: "https://open.spotify.com/track/3YRCqOhFifThpSRFJ1VWFM",
        },
        {
          id: 4,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Someone Like You",
          artist: "Adele",
          album: "21",
          duration: "4:45",
          spotifyLink: "https://open.spotify.com/track/1T4Y1S1n9RXQOOAue9eVsL",
        },
        {
          id: 5,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Hurt",
          artist: "Johnny Cash",
          album: "American IV: The Man Comes Around",
          duration: "3:38",
          spotifyLink: "https://open.spotify.com/track/28cnXtME493VX9NOw9cIUh",
        },
        {
          id: 6,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "The Sound of Silence",
          artist: "Simon & Garfunkel",
          album: "Wednesday Morning, 3 A.M.",
          duration: "3:05",
          spotifyLink: "https://open.spotify.com/track/3YRCqOhFifThpSRFJ1VWFM",
        },
        {
          id: 4,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Someone Like You",
          artist: "Adele",
          album: "21",
          duration: "4:45",
          spotifyLink: "https://open.spotify.com/track/1T4Y1S1n9RXQOOAue9eVsL",
        },
        {
          id: 5,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Hurt",
          artist: "Johnny Cash",
          album: "American IV: The Man Comes Around",
          duration: "3:38",
          spotifyLink: "https://open.spotify.com/track/28cnXtME493VX9NOw9cIUh",
        },
        {
          id: 6,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "The Sound of Silence",
          artist: "Simon & Garfunkel",
          album: "Wednesday Morning, 3 A.M.",
          duration: "3:05",
          spotifyLink: "https://open.spotify.com/track/3YRCqOhFifThpSRFJ1VWFM",
        },
      ],
    },
    {
      name: "Energetic",
      color: "bg-red-100 text-red-800",
      songs: [
        {
          id: 7,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Don't Stop Me Now",
          artist: "Queen",
          album: "Jazz",
          duration: "3:29",
          spotifyLink: "https://open.spotify.com/track/5T8EDUDqKcs6OSOwEsfqG7",
        },
        {
          id: 8,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Uptown Funk",
          artist: "Mark Ronson ft. Bruno Mars",
          album: "Uptown Special",
          duration: "4:30",
          spotifyLink: "https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS",
        },
        {
          id: 7,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Don't Stop Me Now",
          artist: "Queen",
          album: "Jazz",
          duration: "3:29",
          spotifyLink: "https://open.spotify.com/track/5T8EDUDqKcs6OSOwEsfqG7",
        },
        {
          id: 8,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Uptown Funk",
          artist: "Mark Ronson ft. Bruno Mars",
          album: "Uptown Special",
          duration: "4:30",
          spotifyLink: "https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS",
        },
        {
          id: 7,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Don't Stop Me Now",
          artist: "Queen",
          album: "Jazz",
          duration: "3:29",
          spotifyLink: "https://open.spotify.com/track/5T8EDUDqKcs6OSOwEsfqG7",
        },
        {
          id: 8,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Uptown Funk",
          artist: "Mark Ronson ft. Bruno Mars",
          album: "Uptown Special",
          duration: "4:30",
          spotifyLink: "https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS",
        },
        {
          id: 7,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Don't Stop Me Now",
          artist: "Queen",
          album: "Jazz",
          duration: "3:29",
          spotifyLink: "https://open.spotify.com/track/5T8EDUDqKcs6OSOwEsfqG7",
        },
        {
          id: 8,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Uptown Funk",
          artist: "Mark Ronson ft. Bruno Mars",
          album: "Uptown Special",
          duration: "4:30",
          spotifyLink: "https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS",
        },
        {
          id: 9,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Can't Hold Us",
          artist: "Macklemore & Ryan Lewis",
          album: "The Heist",
          duration: "4:18",
          spotifyLink: "https://open.spotify.com/track/3bidbhpOYeV4knp8AIu8Xn",
        },
      ],
    },
    {
      name: "Confident",
      color: "bg-purple-100 text-purple-800",
      songs: [
        {
          id: 10,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Confident",
          artist: "Demi Lovato",
          album: "Confident",
          duration: "3:25",
          spotifyLink: "https://open.spotify.com/track/1yfyIdEw5U2bD5I6gxQCxW",
        },
        {
          id: 11,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Roar",
          artist: "Katy Perry",
          album: "Prism",
          duration: "3:42",
          spotifyLink: "https://open.spotify.com/track/27tNWlWRYqxvd4IiYQP0Uo",
        },
        {
          id: 10,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Confident",
          artist: "Demi Lovato",
          album: "Confident",
          duration: "3:25",
          spotifyLink: "https://open.spotify.com/track/1yfyIdEw5U2bD5I6gxQCxW",
        },
        {
          id: 11,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Roar",
          artist: "Katy Perry",
          album: "Prism",
          duration: "3:42",
          spotifyLink: "https://open.spotify.com/track/27tNWlWRYqxvd4IiYQP0Uo",
        },
        {
          id: 10,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Confident",
          artist: "Demi Lovato",
          album: "Confident",
          duration: "3:25",
          spotifyLink: "https://open.spotify.com/track/1yfyIdEw5U2bD5I6gxQCxW",
        },
        {
          id: 11,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Roar",
          artist: "Katy Perry",
          album: "Prism",
          duration: "3:42",
          spotifyLink: "https://open.spotify.com/track/27tNWlWRYqxvd4IiYQP0Uo",
        },
        {
          id: 10,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Confident",
          artist: "Demi Lovato",
          album: "Confident",
          duration: "3:25",
          spotifyLink: "https://open.spotify.com/track/1yfyIdEw5U2bD5I6gxQCxW",
        },
        {
          id: 11,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Roar",
          artist: "Katy Perry",
          album: "Prism",
          duration: "3:42",
          spotifyLink: "https://open.spotify.com/track/27tNWlWRYqxvd4IiYQP0Uo",
        },
        {
          id: 10,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Confident",
          artist: "Demi Lovato",
          album: "Confident",
          duration: "3:25",
          spotifyLink: "https://open.spotify.com/track/1yfyIdEw5U2bD5I6gxQCxW",
        },
        {
          id: 11,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Roar",
          artist: "Katy Perry",
          album: "Prism",
          duration: "3:42",
          spotifyLink: "https://open.spotify.com/track/27tNWlWRYqxvd4IiYQP0Uo",
        },
        {
          id: 10,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Confident",
          artist: "Demi Lovato",
          album: "Confident",
          duration: "3:25",
          spotifyLink: "https://open.spotify.com/track/1yfyIdEw5U2bD5I6gxQCxW",
        },
        {
          id: 11,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Roar",
          artist: "Katy Perry",
          album: "Prism",
          duration: "3:42",
          spotifyLink: "https://open.spotify.com/track/27tNWlWRYqxvd4IiYQP0Uo",
        },
        {
          id: 12,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Stronger",
          artist: "Kelly Clarkson",
          album: "Stronger",
          duration: "3:41",
          spotifyLink: "https://open.spotify.com/track/6W9qtKwk2Z2nfwMeVoPwPp",
        },
      ],
    },
    {
      name: "Calm",
      color: "bg-green-100 text-green-800",
      songs: [
        {
          id: 13,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Weightless",
          artist: "Marconi Union",
          album: "Weightless",
          duration: "8:04",
          spotifyLink: "https://open.spotify.com/track/1ZemPoaj7LBj1RAQrb89EC",
        },
        {
          id: 14,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Clair de Lune",
          artist: "Claude Debussy",
          album: "Suite bergamasque",
          duration: "5:00",
          spotifyLink: "https://open.spotify.com/track/2YarjDYjBJuH63dUIh9OWv",
        },
        {
          id: 15,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "The Girl from Ipanema",
          artist: "Stan Getz & João Gilberto",
          album: "Getz/Gilberto",
          duration: "5:22",
          spotifyLink: "https://open.spotify.com/track/3qZ0LSHhGHNSRNNbbj3Msu",
        },
      ],
    },
    {
      name: "Instrumental",
      color: "bg-gray-100 text-gray-800",
      songs: [
        {
          id: 16,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "The Entertainer",
          artist: "Scott Joplin",
          album: "Ragtime",
          duration: "3:01",
          spotifyLink: "https://open.spotify.com/track/2GjBZzJdAqrAW6ChnxS4XC",
        },
        {
          id: 17,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Flight of the Bumblebee",
          artist: "Nikolai Rimsky-Korsakov",
          album: "The Tale of Tsar Saltan",
          duration: "1:17",
          spotifyLink: "https://open.spotify.com/track/6t1FIJlZWTQfIZhsGjaulM",
        },
        {
          id: 18,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          name: "Für Elise",
          artist: "Ludwig van Beethoven",
          album: "Beethoven: Piano Sonatas",
          duration: "2:55",
          spotifyLink: "https://open.spotify.com/track/7xPBvKwPwLj0ALhOZzLpKs",
        },
      ],
    },
  ];

  const toggleCategory = (categoryName: string) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  const sortedSongs = (songs: Song[]) => {
    if (!sortConfig) return songs;

    return [...songs].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  const requestSort = (key: SortKey) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Decided categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <>
                  <TableRow
                    key={category.name}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell
                      className="font-medium p-5"
                      onClick={() => toggleCategory(category.name)}
                    >
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${category.color}`}
                      >
                        {category.name}
                      </span>
                    </TableCell>
                    <TableCell
                      className="text-right p-5"
                      onClick={() => toggleCategory(category.name)}
                    >
                      {openCategory === category.name ? (
                        <ChevronUp className="inline-block w-4 h-4" />
                      ) : (
                        <ChevronDown className="inline-block w-4 h-4" />
                      )}
                    </TableCell>
                  </TableRow>
                  <AnimatePresence>
                    {openCategory === category.name && (
                      <TableRow>
                        <TableCell colSpan={2} className="p-0">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="max-h-[400px] overflow-y-auto scrollbar-hide"
                          >
                            <Table>
                              <TableHeader className="sticky top-0 bg-background z-10">
                                <TableRow>
                                  <TableHead className="w-[100px]">
                                    Image
                                  </TableHead>
                                  <TableHead>
                                    <Button
                                      variant="ghost"
                                      onClick={() => requestSort("name")}
                                    >
                                      Song{" "}
                                      <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                  </TableHead>
                                  <TableHead className="hidden md:table-cell">
                                    <Button
                                      variant="ghost"
                                      onClick={() => requestSort("album")}
                                    >
                                      Album{" "}
                                      <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                  </TableHead>
                                  <TableHead className="hidden sm:table-cell">
                                    <Button
                                      variant="ghost"
                                      onClick={() => requestSort("duration")}
                                    >
                                      Duration{" "}
                                      <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                  </TableHead>
                                  <TableHead className="w-[100px]">
                                    Spotify
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {sortedSongs(category.songs).map((song) => (
                                  <TableRow
                                    key={song.id}
                                    className="hover:bg-muted/50 transition-colors"
                                  >
                                    <TableCell>
                                      <Image
                                        src={song.image}
                                        alt={`${song.name} album cover`}
                                        width={40}
                                        height={40}
                                        className="rounded-md hover:shadow-md transition-shadow"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <div className="font-semibold hover:text-primary transition-colors">
                                        {song.name}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {song.artist}
                                      </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {song.album}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                      {song.duration}
                                    </TableCell>
                                    <TableCell>
                                      <Link
                                        href={song.spotifyLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Button variant="ghost" size="sm">
                                          <ExternalLink className="h-4 w-4" />
                                          <span className="sr-only">
                                            Open on Spotify
                                          </span>
                                        </Button>
                                      </Link>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategorizedSongsDropdown;
