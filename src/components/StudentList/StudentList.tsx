import React, { useState, useMemo } from "react";
import { ColumnDef, SortingState, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parse } from "csv-parse/browser/esm";
import './StudentList.css';

interface Student {
  name: string;
  email: string;
  timestamp: string;
  grade: string;
  feedback: string;
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string>("");

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
    console.log(newSelectedRows);
    setSelectedRows(newSelectedRows);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStudents([]);
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const text = event.target?.result as string;
        validateCSV(text);
      };
      fileReader.readAsText(file);
    }
  };

  // Validate the CSV file's headers and rows
const validateCSV = (csvString: string) => {
  parse(csvString, { delimiter: "," }, (err, output: string[][]) => {
    if (err) {
      setError("Error parsing the CSV file.");
      return;
    }

    const headerRow: string[] = output[0];
    console.log("Parsed Headers:", headerRow);

    const requiredHeaders: string[] = ["Name", "Email", "Timestamp", "Grade", "Feedback"];
    
    const missingHeaders: string[] = requiredHeaders.filter(header => !headerRow.includes(header));
    if (missingHeaders.length > 0) {
      setError(`Missing required columns: ${missingHeaders.join(", ")}`);
      return;
    }

    const parsedStudents = output.slice(1).map((row: string[]) => {
      const student: Record<string, string> = {};
      headerRow.forEach((header: string, index: number) => {
        student[header] = row[index] || "";
      });
      return student;
    });

    const invalidStudents = parsedStudents.filter((student: Record<string, string>) =>
      !student["Name"] || !student["Email"] || !student["Timestamp"]
    );

    if (invalidStudents.length > 0) {
      setError("Some rows contain missing or invalid data.");
      return;
    }

    setStudents(parsedStudents.map((student: Record<string, string>) => ({
      name: student["Name"] || "",
      email: student["Email"] || "",
      timestamp: student["Timestamp"] || "",
      grade: student["Grade"] || "",
      feedback: student["Feedback"] || "",
    })));
    setError("");
  });
};


  return (
    <div className="layout">
      <div className="listSection">
        <div className="buttons">
          <form>
            <label htmlFor="csvFileInput" className="import-file-label">
              Import File (exported from Moodle)
            </label>
            <input
              type="file"
              id="csvFileInput"
              accept=".csv"
              onChange={handleOnChange}
              className="import-file-input"
            />
          </form>
          <button className="studentBtn">Export for Moodle</button>
          <button className="studentBtn">Save Progress</button>
          <button className="studentBtn">Load Progress</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="rounded-md border">
          <div className="table-container">
            <Table>
              <TableCaption>A list of recent student submissions.</TableCaption>
              <TableHeader>
                <TableRow className="header-row sticky top-0 z-[10]">
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
