"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { columns } from "./columns";
import { Song } from "@/typings";

// const songs: Song[] = [
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Bohemian Rhapsody",
//     artist: "Queen",
//     album: "A Night at the Opera",
//     duration: "5:55",
//     category: "Energetic",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Billie Jean",
//     artist: "Michael Jackson",
//     album: "Thriller",
//     duration: "4:54",
//     category: "Confident",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Shape of You",
//     artist: "Ed Sheeran",
//     album: "÷",
//     duration: "3:53",
//     category: "Happy",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Stairway to Heaven",
//     artist: "Led Zeppelin",
//     album: "Led Zeppelin IV",
//     duration: "8:02",
//     category: "Calm",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Lose Yourself",
//     artist: "Eminem",
//     album: "8 Mile Soundtrack",
//     duration: "5:26",
//     category: "Instrumental",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Someone Like You",
//     artist: "Adele",
//     album: "21",
//     duration: "4:45",
//     category: "Sad",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Bohemian Rhapsody",
//     artist: "Queen",
//     album: "A Night at the Opera",
//     duration: "5:55",
//     category: "Energetic",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Billie Jean",
//     artist: "Michael Jackson",
//     album: "Thriller",
//     duration: "4:54",
//     category: "Confident",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Shape of You",
//     artist: "Ed Sheeran",
//     album: "÷",
//     duration: "3:53",
//     category: "Happy",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Stairway to Heaven",
//     artist: "Led Zeppelin",
//     album: "Led Zeppelin IV",
//     duration: "8:02",
//     category: "Calm",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Lose Yourself",
//     artist: "Eminem",
//     album: "8 Mile Soundtrack",
//     duration: "5:26",
//     category: "Instrumental",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Someone Like You",
//     artist: "Adele",
//     album: "21",
//     duration: "4:45",
//     category: "Sad",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Bohemian Rhapsody",
//     artist: "Queen",
//     album: "A Night at the Opera",
//     duration: "5:55",
//     category: "Energetic",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Billie Jean",
//     artist: "Michael Jackson",
//     album: "Thriller",
//     duration: "4:54",
//     category: "Confident",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Shape of You",
//     artist: "Ed Sheeran",
//     album: "÷",
//     duration: "3:53",
//     category: "Happy",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Stairway to Heaven",
//     artist: "Led Zeppelin",
//     album: "Led Zeppelin IV",
//     duration: "8:02",
//     category: "Calm",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Lose Yourself",
//     artist: "Eminem",
//     album: "8 Mile Soundtrack",
//     duration: "5:26",
//     category: "Instrumental",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Someone Like You",
//     artist: "Adele",
//     album: "21",
//     duration: "4:45",
//     category: "Sad",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Bohemian Rhapsody",
//     artist: "Queen",
//     album: "A Night at the Opera",
//     duration: "5:55",
//     category: "Energetic",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Billie Jean",
//     artist: "Michael Jackson",
//     album: "Thriller",
//     duration: "4:54",
//     category: "Confident",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Shape of You",
//     artist: "Ed Sheeran",
//     album: "÷",
//     duration: "3:53",
//     category: "Happy",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Stairway to Heaven",
//     artist: "Led Zeppelin",
//     album: "Led Zeppelin IV",
//     duration: "8:02",
//     category: "Calm",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Lose Yourself",
//     artist: "Eminem",
//     album: "8 Mile Soundtrack",
//     duration: "5:26",
//     category: "Instrumental",
//   },
//   {
//     image:
//       "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
//     name: "Someone Like You",
//     artist: "Adele",
//     album: "21",
//     duration: "4:45",
//     category: "Sad",
//   },
// ];

const CategorizedSongs = ({ songs }: { songs: Song[] }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: songs,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter songs..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border-gray-700"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-auto bg-transparent hover:bg-transparent border border-gray-700 hover:border-primary">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-black border border-gray-700"
            align="end"
          >
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-white hover:text-white"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border border-gray-700">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group hover:bg-primary/[0.13]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          className="bg-transparent border hover:bg-primary hover:text-black border-gray-700 "
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLeft className="mr-2" />
          <span>Previous</span>
        </Button>
        <Button
          className="bg-transparent border hover:bg-primary hover:text-black border-gray-700 "
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="mr-2">Next</span>
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default CategorizedSongs;
