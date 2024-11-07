"use client";

import React, { useState, useMemo } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableHead, TableBody, TableCell, TableRow } from "./table";
import './StudentList.css';

// Define Student type
interface Student {
  name: string;
  email: string;
  timestamp: string;
  grade: string;
  feedback: string;
}

const StudentList: React.FC = () => {
  const [students] = useState<Student[]>([
    { name: "John Doe", email: "jd12", timestamp: "2024-10-31", grade: "-0", feedback: "Looks good!" },
    { name: "Jane Smith", email: "js34", timestamp: "2024-10-30", grade: "-2", feedback: "Poor indentation" },
    { name: "Alice Brown", email: "ab56", timestamp: "2024-10-29", grade: "-3", feedback: "Add more comments" },
    { name: "Bob White", email: "bw78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" },
    { name: "Dwight Farefield", email: "DF91", timestamp: "2024-11-28", grade: "-20", feedback: "No submission" },
    { name: "asdf White", email: "bw78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" },
    { name: "dfasdfa", email: "bw78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" },
    { name: "fasdfsdfdfd", email: "bw78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" },
    { name: "qwererererre", email: "bw78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" }
  ]);

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set()); // Track selected rows by name

  // Sorting state
  const [sorting, setSorting] = useState<SortingState>([]);

  // Define columns with sorting functions for timestamp and grade
  const columns = useMemo<ColumnDef<Student>[]>(() => [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: (info) => info.getValue(),
      sortingFn: (rowA, rowB) =>
        new Date(rowA.original.timestamp) > new Date(rowB.original.timestamp) ? 1 : -1,
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: (info) => info.getValue(),
      sortingFn: (rowA, rowB) =>
        parseInt(rowA.original.grade) - parseInt(rowB.original.grade),
    },
    {
      accessorKey: "feedback",
      header: "Feedback",
      cell: (info) => info.getValue(),
    },
  ], []);

  // Create table instance
  const table = useReactTable({
    data: students,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Function to toggle row selection and handle selection logic
  const toggleRowSelection = (name: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(name)) {
      newSelectedRows.delete(name);
    } else {
      newSelectedRows.add(name);
    }
    setSelectedRows(newSelectedRows);
    studentSelect(newSelectedRows); // Call the studentSelect function with new selected rows
  };

  // Function to handle actions when row is selected (e.g., logging or additional logic)
  const studentSelect = (selectedRows: Set<string>) => {
    console.log("This student is selected: ", Array.from(selectedRows)); // Log the selected rows
  };

  return (
    <div className="layout">
      <div className="listSection">
        <div className="buttons">
          <button className="studentBtn">Import File (exported from Moodle)</button>
          <button className="studentBtn">Export for Moodle</button>
          <button className="studentBtn">Save Progress</button>
          <button className="studentBtn">Load Progress</button>
        </div>
        <div className="rounded-md border">
          <Table>
            {/* Table Header */}
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(header.column.columnDef.header, header.getContext())}{" "}
                          {header.column.getIsSorted() ? (header.column.getIsSorted() === "desc" ? "▲" : "▼") : "⇅"}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>

            {/* Table Body with Scroll */}
            <div className="table-container">
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={selectedRows.has(row.original.name) ? 'selected' : ''}
                    onClick={() => toggleRowSelection(row.original.name)} // Toggle selection on click
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </div>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
