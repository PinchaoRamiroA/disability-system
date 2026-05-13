import React from 'react'
import MuiTable from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Paper from '@mui/material/Paper'
import Pagination from '@mui/material/Pagination'
import Box from '@mui/material/Box'

interface Column<T = unknown> {
	id: string
	label: string
	width?: number
	minWidth?: number
	render?: (row: T) => React.ReactNode
}

interface TableProps<T = unknown> {
	columns: Column<T>[]
	data: T[]
	loading?: boolean
	onRowClick?: (row: T) => void
	emptyMessage?: string
	pagination?: {
		page: number
		totalPages: number
		onPageChange: (page: number) => void
	}
}

export function Table<T = unknown>({
	columns,
	data,
	loading = false,
	onRowClick,
	emptyMessage = 'No hay datos',
	pagination,
}: TableProps<T>) {
	const isEmpty = data.length === 0

	const headers = columns.map((col) => ({
		propertyName: col.id,
		label: col.label,
	}))

	return (
		<Paper>
			<TableContainer>
				<MuiTable>
					<TableHead>
						<TableRow>
							{headers.map((header) => (
								<TableCell
									key={header.propertyName}
									style={{
										width: columns.find((c) => c.id === header.propertyName)?.width,
										minWidth:
											columns.find((c) => c.id === header.propertyName)
												?.minWidth || 'auto',
									}}
								>
									{header.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={columns.length} align="center">
									Cargando...
								</TableCell>
							</TableRow>
						) : isEmpty ? (
							<TableRow>
								<TableCell colSpan={columns.length} align="center">
									{emptyMessage}
								</TableCell>
							</TableRow>
						) : (
							data.map((item, index) => (
								<TableRow
									key={index}
									onClick={() => onRowClick?.(item)}
									style={{ cursor: onRowClick ? 'pointer' : 'default' }}
								>
									{columns.map((col) => (
										<TableCell key={col.id}>
											{col.render
												? col.render(item)
												: (item as Record<string, unknown>)[col.id]?.toString() || '-'}
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</MuiTable>
			</TableContainer>
			{pagination && (
				<Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
					<Pagination
						count={pagination.totalPages}
						page={pagination.page}
						onChange={(_, value) => pagination.onPageChange(value)}
						color="primary"
					/>
				</Box>
			)}
		</Paper>
	)
}