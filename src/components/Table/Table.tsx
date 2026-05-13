import React from 'react'
import MuiTable from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Paper from '@mui/material/Paper'
import {
	NoDataText,
	TableHeader,
} from '@/types/Table'
import { Status } from '@/types/status'

interface Props<T> {
	headers: TableHeader[]
	status: Status
	data: T[]
	noDataText?: NoDataText
	renderRow?: (item: T) => React.ReactNode
}

export function Table<T>({
	headers,
	status,
	data,
	noDataText,
	renderRow,
}: Props<T>) {
	const isLoading = status === 'pending' || status === 'loading'
	const isEmpty = data.length === 0

	return (
		<Paper>
			<TableContainer>
				<MuiTable>
					<TableHead>
						<TableRow>
							{headers.map((header) => (
								<TableCell key={header.propertyName}>
									{header.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={headers.length} align="center">
									Cargando...
								</TableCell>
							</TableRow>
						) : isEmpty ? (
							<TableRow>
								<TableCell colSpan={headers.length} align="center">
									{noDataText?.title || 'No hay datos'}
								</TableCell>
							</TableRow>
						) : (
							data.map((item, index) => (
								<TableRow key={index}>
									{renderRow ? (
										renderRow(item)
									) : (
										<TableCell colSpan={headers.length}>
											{JSON.stringify(item)}
										</TableCell>
									)}
								</TableRow>
							))
						)}
					</TableBody>
				</MuiTable>
			</TableContainer>
		</Paper>
	)
}