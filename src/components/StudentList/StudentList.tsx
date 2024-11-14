import React, { useState, useMemo } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    { name: "Dwight Farefield", email: "df91", timestamp: "2024-11-28", grade: "-20", feedback: "No submission" },
    { name: "Tim Qwerty", email: "tq78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" },
    { name: "Meg Thomas", email: "mt78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" },
    { name: "Spam Ham", email: "sh78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" },
    { name: "Tuna Mayo", email: "tm78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" },
    { name: "Peppers Nonion", email: "pn78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" },
    { name: "asdf asdf", email: "aa78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" },
    { name: "zxcvz xcvb", email: "zx78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" },
    { name: "qwerer ererre", email: "qe78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" },
    { name: "Tom Fissher", email: "tf78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" },
    { name: "Happy Molly", email: "hm78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" },
    { name: "Holden Caulfield", email: "hc78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" },
    { name: "Angular Angler", email: "aa78", timestamp: "2024-10-28", grade: "-20", feedback: "No submission" },
    // Additional students here...
  ]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const columns = useMemo<ColumnDef<Student>[]>(() => [
    { accessorKey: "name", header: "Name", cell: info => info.getValue() },
    { accessorKey: "email", header: "Email", cell: info => info.getValue() },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: info => info.getValue(),
      sortingFn: (rowA, rowB) =>
        new Date(rowA.original.timestamp) > new Date(rowB.original.timestamp) ? 1 : -1,
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: info => info.getValue(),
      sortingFn: (rowA, rowB) =>
        parseInt(rowA.original.grade) - parseInt(rowB.original.grade),
    },
    { accessorKey: "feedback", header: "Feedback", cell: info => info.getValue() },
  ], []);

  const table = useReactTable({
    data: students,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const toggleRowSelection = (name: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(name)) {
      newSelectedRows.delete(name);
    } else {
      newSelectedRows.add(name);
    }
    setSelectedRows(newSelectedRows);
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
          <div className="table-container">
            <Table>
              <TableCaption>A list of recent student submissions.</TableCaption>
                <TableHeader>
                    <TableRow className="header-row  sticky top-0 z-[10]">
                        {table.getHeaderGroups().map(headerGroup => (
                        <React.Fragment key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                            <TableHead
                                key={header.id}
                                onClick={header.column.getToggleSortingHandler()}
                                className="header-cell cursor-pointer"
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}{" "}
                                {header.column.getIsSorted() ? (header.column.getIsSorted() === "desc" ? "▲" : "▼") : "⇅"}
                            </TableHead>
                            ))}
                        </React.Fragment>
                        ))}
                    </TableRow>
                </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    className={selectedRows.has(row.original.name) ? 'selected' : ''}
                    onClick={() => toggleRowSelection(row.original.name)}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
