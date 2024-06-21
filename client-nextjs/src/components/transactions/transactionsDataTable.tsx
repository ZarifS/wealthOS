import {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    flexRender,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import Button from "components/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "components/table"
import { DataTableToolbar } from "components/dataTable/toolbar"
import { ArrowUpDown } from "lucide-react"
import { useState } from "react"
import { Transaction } from "types/transactions"

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <div className="flex items-center">
                    <span>Amount</span>
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="ml-2 p-1.5"
                    >
                        <ArrowUpDown className="h-4 w-4" />
                    </Button>
                </div>

            )
        },
        cell: ({ row }) => {
            const { type, amount } = row.original;
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)
            return (
                <div className={`font-medium ${type === "expense" ? "text-red-400" : "text-green-400"}`}>
                    {formatted}
                </div>
            )
        },
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.getValue("category") as string[]
            return <div className="font-medium">{category?.join(", ")}</div>
        },
        filterFn: (row, columnId, filterValue: string[]) => {
            const category = row.getValue("category") as string[]
            // Check if any of the categories match the filter value
            return filterValue.some((value) => category.includes(value))
        },
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <div className="flex items-center">
                    <span>Date</span>
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="ml-2 p-1.5"
                    >
                        <ArrowUpDown className="h-4 w-4" />
                    </Button>
                </div>

            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("date"))
            return <div className="font-medium">{date.toDateString()}</div>
        },
    },
]

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        state: {
            sorting,
            columnFilters,
        },
    })

    return (
        <>
            <div className="flex items-center py-4">
                <DataTableToolbar table={table} />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="px-0">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
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
                                    )
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
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}