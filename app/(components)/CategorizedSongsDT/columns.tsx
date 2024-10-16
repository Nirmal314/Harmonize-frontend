import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { Song } from "@/typings";
import { Button } from "@/components/ui/button";

const getCategoryColor = (category: string) => {
  switch (category.toUpperCase()) {
    case "HAPPY":
      return "border bg-yellow-400/15 border-yellow-500 text-yellow-500";
    case "SAD":
      return "border bg-blue-400/15 border-blue-500 text-blue-500";
    case "ENERGETIC":
      return "border bg-red-400/15 border-red-500 text-red-500";
    case "CONFIDENT":
      return "border bg-purple-400/15 border-purple-500 text-purple-500";
    case "CALM":
      return "border bg-green-400/15 border-green-500 text-green-500";
    case "INSTRUMENTAL":
      return "border bg-gray-400/15 border-gray-400 text-gray-400";
    default:
      return "bg-primary/10 text-primary";
  }
};

export const columns: ColumnDef<Song, any>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:text-primary hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center space-x-2 max-w-[300px]">
        <Image
          src={row.original.image}
          alt={`${row.getValue("name")} album cover`}
          height={40}
          width={40}
          className="rounded-sm hover:shadow-md transition-shadow flex-shrink-0"
        />
        <div className="flex flex-col min-w-0">
          <div className="font-semibold truncate group-hover:text-primary group-hover:underline cursor-pointer transition-colors">
            {row.getValue("name")}
          </div>
          <div className="text-sm text-muted-foreground truncate">
            {row.original.artist}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "album",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:text-primary hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Album
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className="capitalize truncate max-w-[200px]"
        title={row.getValue("album")}
      >
        {row.getValue("album")}
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:text-primary hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Duration
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("duration")}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:text-primary hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
          row.getValue("category")
        )} hover:opacity-80 transition-opacity`}
      >
        {row.getValue("category")}
      </span>
    ),
    size: 120,
  },
];
