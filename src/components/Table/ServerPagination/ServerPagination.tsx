import React, { forwardRef } from 'react'
import {
	Paper,
	Pagination,
	Box,
	TextField,
	MenuItem,
	Typography,
	Grid,
	useTheme,
	useMediaQuery,
} from '@mui/material'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { drawerSelector } from '@/store/slices/drawer'

interface Props {
	currentPage: number
	totalPages: number
	totalRecords: number
	rowsPerPage: number
	handleChange: (page: number) => void
	handleRowsPerPageChange?: (rows: number) => void
}

const perPageOptions = [20, 50, 100, 200]

export const ServerPagination = forwardRef<HTMLDivElement, Props>(
	(
		{
			currentPage,
			totalPages,
			handleChange,
			handleRowsPerPageChange,
			rowsPerPage,
			totalRecords,
		},
		ref
	) => {
		const { open, drawerWidth } = useAppSelector(drawerSelector)
		const theme = useTheme()
		const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

		// Calculamos el ancho del contenedor teniendo en cuenta el drawer y el tamaño de pantalla.
		const width = fullScreen
			? '100%'
			: open && drawerWidth
			? `calc(100% - ${drawerWidth}px - 2.5em)`
			: 'calc(100% - 2.5em)'

		if (totalPages === 0) return null

		// Para el label, se asume que la paginación mostrada es 1-indexada.
		const actualPage = currentPage === 0 ? 1 : currentPage
		const firstRecord = (actualPage - 1) * rowsPerPage + 1
		const lastRecord = Math.min(actualPage * rowsPerPage, totalRecords)

		return (
			<Grid
				item
				xs
				sx={{ position: 'fixed', bottom: 5, zIndex: 1, width }}
				mx={fullScreen ? 0 : 4}
				ref={ref}
			>
				<Paper sx={{ border: 1, borderColor: '#a9a9a9' }} elevation={2}>
					<Box
						p={1}
						display="flex"
						flexDirection={fullScreen ? 'column' : 'row'}
						alignItems="center"
						justifyContent={
							rowsPerPage === 0 ? 'space-between' : 'flex-end'
						}
					>
						{/* Label con el rango de registros */}
						{rowsPerPage > 0 && (
							<Box
								flexGrow={1}
								ml={fullScreen ? 0 : 2}
								textAlign={fullScreen ? 'center' : 'left'}
							>
								<Typography variant="caption">
									Mostrando registros del {firstRecord} al{' '}
									{lastRecord} de un total de {totalRecords}{' '}
									registros
								</Typography>
							</Box>
						)}

						{/* Selector de filas por página */}
						{rowsPerPage && handleRowsPerPageChange && (
							<Box display="flex" alignItems="center">
								<Typography mx={2}>
									Filas por página:
								</Typography>
								<TextField
									select
									variant="standard"
									size="small"
									value={rowsPerPage}
									onChange={(e) =>
										handleRowsPerPageChange(
											Number(e.target.value)
										)
									}
								>
									{perPageOptions.map((value) => (
										<MenuItem key={value} value={value}>
											{value}
										</MenuItem>
									))}
								</TextField>
							</Box>
						)}

						{/* Paginación */}
						<Pagination
							page={actualPage}
							count={totalPages}
							onChange={(_, page) => handleChange(page)}
							showFirstButton
							showLastButton
							boundaryCount={1}
						/>
					</Box>
				</Paper>
			</Grid>
		)
	}
)

ServerPagination.displayName = 'ServerPagination'
