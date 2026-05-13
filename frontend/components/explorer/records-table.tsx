"use client";

import { useMemo } from "react";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import type { RecordRow } from "@/types/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type RecordsTableProps = {
  data: RecordRow[];
  onSort: (sort: string, order: "asc" | "desc") => void;
  currentSort: string;
  currentOrder: "asc" | "desc";
};

function SortLabel({ id, label, onSort, currentSort, currentOrder }: { id: string; label: string; onSort: RecordsTableProps["onSort"]; currentSort: string; currentOrder: "asc" | "desc" }) {
  const nextOrder = currentSort === id && currentOrder === "asc" ? "desc" : "asc";
  return (
    <button className="text-left hover:text-foreground" onClick={() => onSort(id, nextOrder)}>
      {label} {currentSort === id ? (currentOrder === "asc" ? "↑" : "↓") : ""}
    </button>
  );
}

export function RecordsTable({ data, onSort, currentSort, currentOrder }: RecordsTableProps) {
  const columns = useMemo<ColumnDef<RecordRow>[]>(
    () => [
      { accessorKey: "age", header: () => <SortLabel id="age" label="Age" onSort={onSort} currentSort={currentSort} currentOrder={currentOrder} /> },
      { accessorKey: "workclass", header: () => <SortLabel id="workclass" label="Workclass" onSort={onSort} currentSort={currentSort} currentOrder={currentOrder} /> },
      { accessorKey: "education_level", header: "Education" },
      { accessorKey: "occupation", header: "Occupation" },
      {
        accessorKey: "income",
        header: "Income",
        cell: ({ row }) => <Badge variant={String(row.getValue("income")) === ">80K" ? "success" : "default"}>{String(row.getValue("income"))}</Badge>
      },
      { accessorKey: "hours-per-week", header: "Hours/Week" }
    ],
    [currentOrder, currentSort, onSort]
  );

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader className="sticky top-0 bg-card">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
