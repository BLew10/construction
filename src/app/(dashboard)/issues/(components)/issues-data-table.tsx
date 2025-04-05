"use client";

import * as React from "react";
import {
  ColumnDef,
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

import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Badge } from "@/components/ui/badge";
import { Issue, issuePrioritySchema, issueStatusSchema } from "@/types/issue";
import { format } from "date-fns";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

// Helper function for priority badge variant
const getPriorityVariant = (
  priority: Issue["priority"]
): "destructive" | "warning" | "default" | "outline" => {
  switch (priority) {
    case "Critical":
      return "destructive";
    case "High":
      return "warning";
    case "Medium":
      return "default";
    case "Low":
      return "outline";
    default:
      return "default";
  }
};

// Helper function for status badge variant
const getStatusVariant = (
  status: Issue["status"]
): "success" | "secondary" | "outline" | "default" => {
  switch (status) {
    case "Closed":
    case "Resolved":
      return "success";
    case "InProgress":
      return "secondary";
    case "Open":
      return "default";
    default:
      return "outline";
  }
};

export const columns: ColumnDef<Issue>[] = [
  // Add Checkbox column if needed for bulk actions
  // {
  //   id: "select",
  //   header: ({ table }) => ( ... ),
  //   cell: ({ row }) => ( ... ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="whitespace-nowrap"
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        <Link href={`/issues/${row.original.id}`} className="hover:underline break-words line-clamp-2">
          {row.getValue("title")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "projectName", // Use the joined name
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="whitespace-nowrap"
      >
        Project
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const issue = row.original;
      // Link to the project's specific issues page (or overview)
      return (
        <Link
          href={`/projects/${issue.projectId}/issues`}
          className="hover:underline whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px] block"
        >
          {issue.projectName}
        </Link>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.getValue("status"))}>
        {row.getValue("status")}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <Badge variant={getPriorityVariant(row.getValue("priority")) as any}>
        {row.getValue("priority")}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "assigneeName",
    header: "Assignee",
    cell: ({ row }) =>
      row.getValue("assigneeName") || (
        <span className="text-muted-foreground italic">Unassigned</span>
      ),
    filterFn: (row, id, value) => {
      const assignee = row.getValue(id) as string | undefined;
      if (!assignee && value.includes("unassigned")) return true;
      return assignee ? value.includes(assignee) : false;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="whitespace-nowrap"
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      format(new Date(row.getValue("createdAt")), "MMM d, yyyy"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const issue = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(issue.id!)}
            >
              Copy issue ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href={`/issues/${issue.id}`} className="w-full">
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" /> Edit Issue
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" /> Delete Issue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface IssuesDataTableProps {
  data: Issue[];
  isLoading: boolean;
  // Add onCreateNew prop
  onCreateNew: () => void;
}

export function IssuesDataTable({
  data,
  isLoading,
  onCreateNew,
}: IssuesDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      projectName: true,
      assigneeName: true,
      createdAt: true,
    });
  const [rowSelection, setRowSelection] = React.useState({});

  // Hide less important columns on smaller screens
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  React.useEffect(() => {
    if (isMobile) {
      setColumnVisibility({
        title: true,
        status: true,
        priority: true,
        projectName: false,
        assigneeName: false,
        createdAt: false,
        actions: true,
      });
    } else {
      setColumnVisibility({
        title: true,
        status: true,
        priority: true,
        projectName: true,
        assigneeName: true,
        createdAt: true,
        actions: true,
      });
    }
  }, [isMobile]);

  const [filterMenuOpen, setFilterMenuOpen] = React.useState(false);
  const [searchInputVisible, setSearchInputVisible] = React.useState(false);

  const table = useReactTable({
    data,
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

  // Mobile Card View (instead of table rows)
  const MobileCardView = () => (
    <div className="space-y-3 md:hidden">
      {table.getRowModel().rows.length > 0 ? (
        table.getRowModel().rows.map((row) => (
          <Card key={row.id} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="font-medium break-words line-clamp-2 flex-1">
                  <Link href={`/issues/${row.original.id}`} className="hover:underline">
                    {row.getValue("title")}
                  </Link>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id!)}>
                      Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <Link href={`/issues/${row.original.id}`} className="w-full">
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="text-red-600 focus:text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm my-1">
                <div className="text-muted-foreground">Project:</div>
                <div className="truncate">
                  <Link href={`/projects/${row.original.projectId}/issues`} className="hover:underline">
                    {row.getValue("projectName")}
                  </Link>
                </div>
                
                <div className="text-muted-foreground">Status:</div>
                <div>
                  <Badge variant={getStatusVariant(row.getValue("status"))}>
                    {row.getValue("status")}
                  </Badge>
                </div>
                
                <div className="text-muted-foreground">Priority:</div>
                <div>
                  <Badge variant={getPriorityVariant(row.getValue("priority")) as any}>
                    {row.getValue("priority")}
                  </Badge>
                </div>
                
                <div className="text-muted-foreground">Assignee:</div>
                <div className="truncate">
                  {row.getValue("assigneeName") || (
                    <span className="text-muted-foreground italic">Unassigned</span>
                  )}
                </div>
                
                <div className="text-muted-foreground">Created:</div>
                <div>{format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}</div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center p-4 bg-muted/20 rounded-lg">
          {isLoading ? "Loading issues..." : "No issues found."}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-3 md:space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className={cn(
          "flex items-center gap-2",
          searchInputVisible ? "w-full sm:w-auto" : "w-auto"
        )}>
          {searchInputVisible ? (
            <Input
              placeholder="Filter by title..."
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
              className="max-w-full sm:max-w-xs"
            />
          ) : null}
          
          <Button 
            variant="outline" 
            size="sm"
            className={searchInputVisible ? "sm:hidden" : ""}
            onClick={() => setSearchInputVisible(!searchInputVisible)}
          >
            <Search className="h-4 w-4 mr-2" />
            {!searchInputVisible && <span className="hidden sm:inline">Search</span>}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <DropdownMenu open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              {issueStatusSchema.options.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  className="capitalize"
                  // Add state management as needed
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Priority</DropdownMenuLabel>
              {issuePrioritySchema.options.map((priority) => (
                <DropdownMenuCheckboxItem
                  key={priority}
                  className="capitalize"
                  // Add state management as needed
                >
                  {priority}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <span className="hidden sm:inline">Columns</span>
                <ChevronDown className="h-4 w-4 sm:ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "assigneeName" ? "Assignee" : 
                       column.id === "projectName" ? "Project" : 
                       column.id === "createdAt" ? "Created" : 
                       column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Create Issue</span>
          </Button>
        </div>
      </div>

      {/* Show cards on mobile, table on desktop */}
      <MobileCardView />

      <div className="rounded-md border hidden md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                  {isLoading ? "Loading issues..." : "No issues found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="text-xs text-muted-foreground hidden sm:block">
          {data.length} {data.length === 1 ? "issue" : "issues"} total
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 p-0 sm:w-auto sm:px-3"
          >
            <span className="sr-only sm:not-sr-only sm:inline-block">Previous</span>
            <span className="sm:hidden">&lt;</span>
          </Button>
          <div className="text-xs sm:text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 p-0 sm:w-auto sm:px-3"
          >
            <span className="sr-only sm:not-sr-only sm:inline-block">Next</span>
            <span className="sm:hidden">&gt;</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
