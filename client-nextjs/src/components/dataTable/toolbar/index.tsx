"use client"

import { CrossIcon } from "lucide-react"
import { Table } from "@tanstack/react-table"

import { Button } from "components/button"
import { Input } from "components/input"
import { TOP_LEVEL_CATEGORIES } from "types/transactions"
import { DataTableFacetedFilter } from "../facetedFilter"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const categories = TOP_LEVEL_CATEGORIES.map((category) => ({
        label: category,
        value: category,
    }));
    return (
        <div className="flex flex-1 items-center space-x-2">
            <Input
                placeholder="Filter transactions..."
                value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("description")?.setFilterValue(event.target.value)
                }
                className="h-8 w-[150px] lg:w-[250px]"
            />
            {table.getColumn("category") && (
                <DataTableFacetedFilter
                    column={table.getColumn("category")}
                    title="Category"
                    options={categories}
                />
            )}
            {isFiltered && (
                <Button
                    variant="ghost"
                    onClick={() => table.resetColumnFilters()}
                    className="h-8 px-2 lg:px-3"
                >
                    Reset
                    <CrossIcon className="ml-2 h-4 w-4" />
                </Button>
            )}
        </div>
    )
}