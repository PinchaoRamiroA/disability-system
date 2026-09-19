'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationProps {
    page: number
    limit: number
    total: number
    totalPages: number
    onPageChange: (newPage: number) => void
    onLimitChange?: (newLimit: number) => void
    limitOptions?: number[]
}

export function Pagination({
    page,
    limit,
    total,
    totalPages,
    onPageChange,
    onLimitChange,
    limitOptions = [10, 20, 50],
}: PaginationProps) {
    const from = total === 0 ? 0 : (page - 1) * limit + 1
    const to = Math.min(page * limit, total)

    // Generate page numbers with intelligent ellipsis
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            pages.push(1)
            if (page > 3) {
                pages.push('ellipsis')
            }

            const start = Math.max(2, page - 1)
            const end = Math.min(totalPages - 1, page + 1)

            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            if (page < totalPages - 2) {
                pages.push('ellipsis')
            }
            pages.push(totalPages)
        }

        return pages
    }

    if (total === 0) return null

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-[#111827] border-t border-[#334155] rounded-b-xl text-xs text-[#94a3b8] select-none">
            {/* Left: Range and total display */}
            <div className="flex items-center gap-4">
                <span>
                    Mostrando <strong className="text-white font-medium">{from}</strong> a{' '}
                    <strong className="text-white font-medium">{to}</strong> de{' '}
                    <strong className="text-white font-medium">{total}</strong> registros
                </span>

                {onLimitChange && (
                    <div className="flex items-center gap-1.5 pl-4 border-l border-[#334155]/60">
                        <span>Filas:</span>
                        <select
                            value={limit}
                            onChange={(e) => onLimitChange(Number(e.target.value))}
                            className="bg-[#0f172a] text-white border border-[#334155] rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                        >
                            {limitOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Right: Navigation buttons */}
            <div className="flex items-center gap-1">
                {/* First Page */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={page <= 1}
                    title="Primera página"
                    className="p-1.5 rounded-lg border border-[#334155] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </button>

                {/* Previous Page */}
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    title="Página anterior"
                    className="p-1.5 rounded-lg border border-[#334155] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page numbers */}
                <div className="hidden sm:flex items-center gap-1 px-1">
                    {getPageNumbers().map((item, index) => {
                        if (item === 'ellipsis') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-2 py-1 text-[#64748b]"
                                >
                                    …
                                </span>
                            )
                        }

                        const isCurrent = item === page
                        return (
                            <button
                                key={item}
                                onClick={() => onPageChange(item)}
                                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium transition ${
                                    isCurrent
                                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                                        : 'text-[#cbd5e1] hover:bg-[#1e293b] hover:text-white border border-[#334155]'
                                }`}
                            >
                                {item}
                            </button>
                        )
                    })}
                </div>

                {/* Next Page */}
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    title="Página siguiente"
                    className="p-1.5 rounded-lg border border-[#334155] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>

                {/* Last Page */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={page >= totalPages}
                    title="Última página"
                    className="p-1.5 rounded-lg border border-[#334155] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    <ChevronsRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

export default Pagination
