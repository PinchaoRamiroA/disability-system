import React, { useEffect, useState } from 'react'
import MuiTable from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import {
	NoDataText,
	RowAction,
	RowSwitchAction,
	SubtableHeader,
	TableAction,
	TableHeader,
} from '@/types/Table'
import { Status } from '@/types/status'
import { GenericObject } from '@/types/GenericObject'
import { Row } from './Row'
import { Body } from './Body'
import { FixedPagination } from './FixedPagination'
import { useRowsPerPage } from '@/hooks/paginacion/useRowsPerPage'
import { Grid } from '@mui/material'
import { useResizeDetector } from 'react-resize-detector'

interface Props<T> {
	headers: TableHeader[]
	status: Status
	data: T[]
	noDataText?: NoDataText
	tableAction?: TableAction
	rowActions?: RowAction<T>[]
	rowButtonActions?: RowAction<T>[]
	unlockButton?: RowAction<T>[]
	minWidth?: number | string
	defaultRowsPerPage?: 20 | 50 | 100 | 200
	badges?: {
		values: string[]
		colors: string[]
		badgeColumn: string
		badgeText?: boolean
	}
	switchAction?: RowSwitchAction<T>
	activeColumn?: string
	actionAlign?:
		| 'left'
		| 'center'
		| 'right'
		| 'justify'
		| 'inherit'
		| undefined
	actionButtonCenter?: boolean
	pagination?: boolean
	serverPagination?: boolean
	serverPaginationChange?: () => void
	linkColumn?: string
	hoverEffect?: boolean
	subtableColumn?: string
	subtableColumns?: string[]
	cellSubtable?: boolean
	subtableHeaders?: SubtableHeader[]
	toggleActionVisibilityColumn?: string
	disableWordbreak?: string[] | '*'
	tooltip?: {
		rowId: number
		text: string
	}
}

/**
 * Generic table, it receives table body rows as its children
 * @param children <TableRow>{...}</TableRow> [] array of tableRows
 * @returns a pretty table
 */
export const Table = <T extends GenericObject>({
	headers,
	status,
	data,
	noDataText,
	rowActions,
	rowButtonActions,
	minWidth = 450,
	defaultRowsPerPage = 20,
	badges,
	switchAction,
	activeColumn,
	actionAlign,
	actionButtonCenter,
	pagination = true,
	linkColumn,
	toggleActionVisibilityColumn,
	hoverEffect = true,
	subtableColumn,
	subtableColumns,
	cellSubtable,
	subtableHeaders,
	disableWordbreak,
	tooltip,
}: Props<T>) => {
	const [page, setPage] = useState(0)
	const [tableData, setTableData] = useState<T[]>([])
	const { handleRowsPerPageChange, rowsPerPage } =
		useRowsPerPage(defaultRowsPerPage)

	const { ref: paginationRef, height: paginationHeight } = useResizeDetector()

	const handleChangePage = (_event: unknown, newPage: number) => {
		setPage(newPage)
	}

	const isEmpty = data.length === 0

	const getBadgeColor = (value: string) => {
		if (badges) {
			const index = badges.values.indexOf(value)

			if (index > -1) {
				return badges.colors[index]
			} // Toma último color ya que se envía null (ver StatusContainer)
			else {
				return badges.colors[badges.colors.length - 1]
			}
		}
		return 'default'
	}

	// Sobreescribe el array de acciones de la fila si el valor del campo correspondiente a 'toggleActionVisibilityColumn' no es true
	const validateRowButtonActions = (columnValue?: string) => {
		const actions: RowAction<T>[] = []

		rowButtonActions?.forEach((action) => {
			// La acción es de tipo lock (visible siempre)
			if (action.lock) {
				// El valor de la columna que corresponde a 'toggleActionVisibilityColumn' indica que la acción se debe mostrar
				if (columnValue === 'true') {
					actions.push(action)
				}
				// La acción tipo lock no se va a mostrar
			}
			// La acción
			else {
				actions.push(action)
			}
		})

		return actions
	}

	useEffect(() => {
		setPage(0)
	}, [rowsPerPage])

	useEffect(() => {
		setPage(0)
	}, [data.length])

	useEffect(() => {
		if (pagination) {
			// Corrección en cálculo, ya que el componente de paginación está corrido en 1
			const pivot = page === 0 ? 0 : page - 1

			setTableData(
				data.slice(
					pivot * rowsPerPage,
					pivot * rowsPerPage + rowsPerPage
				)
			)
		} else {
			setTableData(data)
		}
	}, [data, page, rowsPerPage, pagination])

	return (
		<Grid container justifyContent={'center'}>
			<Grid item xs={12} mb={pagination ? `${paginationHeight}px` : 0}>
				<Paper>
					<TableContainer>
						<MuiTable sx={{ minWidth }} aria-label="simple table">
							<TableHead>
								<TableRow>
									{headers.map((header) => (
										<TableCell
											key={header.propertyName}
											align={header.align}
											width={2}
											sx={{
												fontWeight: 'bold',
											}}
										>
											{header.label}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<Body
								headers={headers}
								status={status}
								noDataText={noDataText}
								isEmpty={isEmpty}
							>
								{tableData.map((element) => (
									<Row<T>
										key={element.id}
										data={element}
										actions={rowActions}
										buttonActions={
											toggleActionVisibilityColumn
												? validateRowButtonActions(
														element[
															toggleActionVisibilityColumn
														]?.toString()
												  )
												: rowButtonActions
										}
										headers={headers}
										{...(badges && {
											badgeColor: getBadgeColor(
												element[
													badges.badgeColumn
												]?.toString() ?? ''
											),
											badgeText:
												badges.badgeText !== false,
										})}
										{...(subtableColumn && {
											subtableData: element[
												subtableColumn
											] as T[],
											subtableColumns,
											cellSubtable,
										})}
										{...(tooltip &&
											element.id === tooltip.rowId && {
												tooltip: tooltip.text,
											})}
										subtableHeaders={subtableHeaders}
										switchAction={switchAction}
										{...(linkColumn && {
											linkText:
												element[linkColumn]?.toString(),
										})}
										activeRow={
											activeColumn
												? Boolean(element[activeColumn])
												: true
										}
										actionAlign={actionAlign}
										actionButtonCenter={actionButtonCenter}
										hoverEffect={hoverEffect}
										disableWordbreak={disableWordbreak}
									/>
								))}
							</Body>
						</MuiTable>
					</TableContainer>
				</Paper>
			</Grid>
			{pagination && status !== 'pending' && status !== 'rejected' && (
				<FixedPagination
					currentPage={page}
					handleChange={handleChangePage}
					totalPages={Math.ceil(data.length / rowsPerPage)}
					handleRowsPerPageChange={handleRowsPerPageChange}
					rowsPerPage={rowsPerPage}
					totalRecords={data.length}
					ref={paginationRef}
				/>
			)}
		</Grid>
	)
}
