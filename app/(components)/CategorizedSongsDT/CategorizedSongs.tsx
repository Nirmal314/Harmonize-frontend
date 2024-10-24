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
import { ChevronDown } from "lucide-react";

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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

  React.useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const newPageSize = isMobile ? 5 : 7;
      table.setPageSize(newPageSize);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [table]);

  return (
    <div className="w-full rounded-md py-1.5 px-4 md:py-4 md:px-14 shadow-spotify">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter songs..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border-gray-700 mr-2"
          aria-label="Filter songs"
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
      <div className="rounded-md border border-gray-700 overflow-x-auto">
        <Table className="min-w-full">
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
                  onClick={() => window.open(row.original.url, "_blank")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
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
      <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2 py-4">
        <Pagination>
          <PaginationContent className="flex-wrap justify-center hidden md:flex">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className={`rounded-full hover:text-primary hover:bg-primary/15 border border-transparent hover:border-primary ${
                  !table.getCanPreviousPage()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.preventDefault();
                  if (table.getCanPreviousPage()) table.previousPage();
                }}
                aria-disabled={!table.getCanPreviousPage()}
              />
            </PaginationItem>

            {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    className={`border-primary bg-primary/15 rounded-full text-primary hover:bg-bg-primary/15 hover:text-primary ${
                      table.getState().pagination.pageIndex === page - 1
                        ? "font-bold"
                        : ""
                    }`}
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      e.preventDefault();
                      table.setPageIndex(page - 1);
                    }}
                    isActive={
                      table.getState().pagination.pageIndex === page - 1
                    }
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                className={`rounded-full hover:text-primary hover:bg-primary/15 border border-transparent hover:border-primary ${
                  !table.getCanNextPage() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.preventDefault();
                  if (table.getCanNextPage()) table.nextPage();
                }}
                aria-disabled={!table.getCanNextPage()}
              />
            </PaginationItem>
          </PaginationContent>

          <PaginationContent className="flex md:hidden items-center justify-between w-full">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className={`rounded-full hover:text-primary hover:bg-primary/15 border border-transparent hover:border-primary ${
                  !table.getCanPreviousPage()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.preventDefault();
                  if (table.getCanPreviousPage()) table.previousPage();
                }}
                aria-disabled={!table.getCanPreviousPage()}
              />
            </PaginationItem>

            <span className="text-sm text-gray-100 border-b border-b-primary">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>

            <PaginationItem>
              <PaginationNext
                href="#"
                className={`rounded-full hover:text-primary hover:bg-primary/15 border border-transparent hover:border-primary ${
                  !table.getCanNextPage() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.preventDefault();
                  if (table.getCanNextPage()) table.nextPage();
                }}
                aria-disabled={!table.getCanNextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default CategorizedSongs;
