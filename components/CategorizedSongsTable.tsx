"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const CategorizedSongsTable = () => {
  const songs = [
    {
      index: 1,
      image:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      name: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      duration: "5:55",
      category: "Energetic",
    },
    {
      index: 2,
      image:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      name: "Billie Jean",
      artist: "Michael Jackson",
      album: "Thriller",
      duration: "4:54",
      category: "Confident",
    },
    {
      index: 3,
      image:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      name: "Shape of You",
      artist: "Ed Sheeran",
      album: "÷",
      duration: "3:53",
      category: "Happy",
    },
    {
      index: 4,
      image:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      name: "Stairway to Heaven",
      artist: "Led Zeppelin",
      album: "Led Zeppelin IV",
      duration: "8:02",
      category: "Calm",
    },
    {
      index: 5,
      image:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      name: "Lose Yourself",
      artist: "Eminem",
      album: "8 Mile Soundtrack",
      duration: "5:26",
      category: "Instrumental",
    },
    {
      index: 6,
      image:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      name: "Someone Like You",
      artist: "Adele",
      album: "21",
      duration: "4:45",
      category: "Sad",
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category.toUpperCase()) {
      case "HAPPY":
        return "bg-yellow-100 text-yellow-800";
      case "SAD":
        return "bg-blue-100 text-blue-800";
      case "ENERGETIC":
        return "bg-red-100 text-red-800";
      case "CONFIDENT":
        return "bg-purple-100 text-purple-800";
      case "CALM":
        return "bg-green-100 text-green-800";
      case "INSTRUMENTAL":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <div className="w-full mx-auto p-4 bg-black text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-100">
        Your songs with categories
      </h1>
      <div className="overflow-x-auto">
        <Table className="bg-gray-900 border-gray-800">
          <TableHeader>
            <TableRow className="hover:bg-muted/50 transition-colors">
              <TableHead className="w-[50px]">Index</TableHead>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Song</TableHead>
              <TableHead className="hidden md:table-cell">Album</TableHead>
              <TableHead className="hidden sm:table-cell">Duration</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {songs.map((song) => (
              <TableRow
                key={song.index}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium">{song.index}</TableCell>
                <TableCell>
                  <Image
                    src={song.image}
                    alt={`${song.name} album cover`}
                    width={60}
                    height={60}
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
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                      song.category
                    )} hover:opacity-80 transition-opacity`}
                  >
                    {song.category}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategorizedSongsTable;
