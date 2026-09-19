'use client'

import React from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, Inbox } from 'lucide-react'

export interface Column<T> {
    key: string
    header: string | React.ReactNode
    width?: string
    align?: 'left' | 'center' | 'right'
    sortable?: boolean
    className?: string
    render?: (row: T, index: number) => React.ReactNode
}

interface TableProps<T> {
    data: T[]
    columns: Column<T>[]
    keyExtractor: (row: T, index: number) => string | number
    isLoading?: boolean
    loadingRows?: number
    emptyMessage?: string
    emptySubMessage?: string
    onRowClick?: (row: T) => void
    sortColumn?: string
    sortDirection?: 'asc' | 'desc'
    onSort?: (columnKey: string) => void
    selectedRowId?: string | number | null
    className?: string
}

export function Table<T>({
    data,
    columns,
    keyExtractor,
    isLoading = false,
    loadingRows = 5,
    emptyMessage = 'No se encontraron registros',
    emptySubMessage = 'Intenta ajustar los filtros de búsqueda.',
    onRowClick,
    sortColumn,
    sortDirection,
    onSort,
    selectedRowId,
    className = '',
}: TableProps<T>) {
    const handleSort = (column: Column<T>) => {
        if (!column.sortable || !onSort) return
        onSort(column.key)
    }

    const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
        if (align === 'center') return 'text-center'
        if (align === 'right') return 'text-right'
        return 'text-left'
    }

    return (
        <div
            className={`w-full overflow-hidden rounded-xl border border-[#334155] bg-[#111827] shadow-sm ${className}`}
        >
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    {/* Table Header */}
                    <thead>
                        <tr className="bg-[#0b1324] border-b border-[#334155]">
                            {columns.map((col) => {
                                const isSorted = sortColumn === col.key
                                const isSortable = Boolean(col.sortable && onSort)

                                return (
                                    <th
                                        key={col.key}
                                        style={{ width: col.width }}
                                        onClick={() => handleSort(col)}
                                        className={`px-4 py-3 text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider select-none ${getAlignmentClass(
                                            col.align
                                        )} ${
                                            isSortable
                                                ? 'cursor-pointer hover:text-white hover:bg-[#1e293b]/60 transition'
                                                : ''
                                        } ${col.className || ''}`}
                                    >
                                        <div
                                            className={`inline-flex items-center gap-1.5 ${
                                                col.align === 'center'
                                                    ? 'justify-center'
                                                    : col.align === 'right'
                                                    ? 'justify-end'
                                                    : 'justify-start'
                                            }`}
                                        >
                                            <span>{col.header}</span>
                                            {isSortable && (
                                                <span className="text-[#64748b]">
                                                    {isSorted ? (
                                                        sortDirection === 'asc' ? (
                                                            <ArrowUp className="h-3 w-3 text-blue-400" />
                                                        ) : (
                                                            <ArrowDown className="h-3 w-3 text-blue-400" />
                                                        )
                                                    ) : (
                                                        <ArrowUpDown className="h-3 w-3 opacity-60" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-[#1e293b]">
                        {isLoading ? (
                            // Skeleton loading rows
                            Array.from({ length: loadingRows }).map((_, rIndex) => (
                                <tr key={`skeleton-${rIndex}`} className="animate-pulse">
                                    {columns.map((col, cIndex) => (
                                        <td key={`skeleton-cell-${cIndex}`} className="px-4 py-3.5">
                                            <div className="h-4 bg-[#1e293b] rounded-md w-3/4"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            // Empty state row
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-14 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="h-12 w-12 rounded-xl bg-[#1e293b] border border-[#334155] flex items-center justify-center text-[#64748b]">
                                            <Inbox className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-semibold text-white">
                                                {emptyMessage}
                                            </h4>
                                            <p className="text-xs text-[#94a3b8]">
                                                {emptySubMessage}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            // Data rows
                            data.map((row, index) => {
                                const rowKey = keyExtractor(row, index)
                                const isSelected = selectedRowId === rowKey

                                return (
                                    <tr
                                        key={rowKey}
                                        onClick={() => onRowClick && onRowClick(row)}
                                        className={`transition-colors text-xs text-[#cbd5e1] ${
                                            onRowClick ? 'cursor-pointer' : ''
                                        } ${
                                            isSelected
                                                ? 'bg-blue-600/15 text-white'
                                                : 'hover:bg-[#1e293b]'
                                        }`}
                                    >
                                        {columns.map((col) => {
                                            const cellContent = col.render
                                                ? col.render(row, index)
                                                : (row as Record<string, unknown>)[col.key]

                                            return (
                                                <td
                                                    key={col.key}
                                                    className={`px-4 py-3.5 ${getAlignmentClass(
                                                        col.align
                                                    )} ${col.className || ''}`}
                                                >
                                                    {cellContent as React.ReactNode}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Table
