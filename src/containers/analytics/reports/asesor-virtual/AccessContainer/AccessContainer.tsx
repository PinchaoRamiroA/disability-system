import React, { useEffect } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { Table } from '@/components/Table'
import { FilterContainer } from '@/containers/FilterContainer'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import {
	accessSelector,
	getAccessLog,
	getCsvFile,
} from '@/store/slices/reports/humanAgent/access'
import { Button, Grid } from '@mui/material'
import { locationsFilters } from '@/utils/helpers/locationsFilters'
import { useLoading } from '@/hooks/useLoading'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { ServerPagination } from '@/components/Table/ServerPagination'
import { useRowsPerPage } from '@/hooks/paginacion/useRowsPerPage'
import { useResizeDetector } from 'react-resize-detector'

export const AccessContainer = () => {
	const dispatch = useAppDispatch()
	const { startLoading, stopLoading } = useLoading()

	const {
		start,
		end,
		channels,
		regionals,
		departments,
		cities,
		id,
		idType,
		since,
		until,
	} = useAppSelector(filterSelector)
	const { idOrg, idVa } = useCompanyAndIdVa()
	const { resource: accesos, getStatus } = useAppSelector(accessSelector)

	// Paginación
	const { handleRowsPerPageChange, rowsPerPage } = useRowsPerPage()
	const { ref: paginationRef, height: paginationHeight } = useResizeDetector()

	const handleDownload = () => {
		startLoading()
		const { idCities, idDepartments, idRegionals } = locationsFilters(
			regionals,
			departments,
			cities
		)
		dispatch(
			getCsvFile({
				idOrg,
				idVa,
				channels,
				end,
				start,
				id,
				idCities,
				idDepartments,
				idRegionals,
				idType,
				since,
				until,
			})
		).then(stopLoading)
	}

	const callGetAccessLog = (page: number) => {
		if (end && start && idVa && idOrg) {
			const { idCities, idDepartments, idRegionals } = locationsFilters(
				regionals,
				departments,
				cities
			)

			dispatch(
				getAccessLog({
					idOrg,
					filters: {
						start,
						end,
						idVa,
						channels,
						id,
						idType,
						idRegionals,
						idDepartments,
						idCities,
						since,
						until,
						page,
						perPage: rowsPerPage,
					},
				})
			)
		}
	}

	// Llamar servicio al navegar por la paginación
	const handleChangePage = (page: number) => {
		callGetAccessLog(page)
	}

	// Effect para aplicar filtros
	useEffect(() => {
		callGetAccessLog(1)
	}, [
		idOrg,
		start,
		end,
		idVa,
		channels?.toString(),
		regionals?.toString(),
		departments?.toString(),
		cities?.toString(),
		id,
		idType,
		since,
		until,
		rowsPerPage,
	])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<GridContainer>
			<FilterContainer
				filters={{
					channels: true,
					locations: true,
					locationsCities: true,
					user: true,
					range: true,
					virtualAgent: true,
				}}
			/>

			{/* Descarga */}
			<Grid item xs={12}>
				<Button
					variant="contained"
					onClick={handleDownload}
					disabled={accesos.totalResult === 0}
				>
					Descargar reporte
				</Button>
			</Grid>

			<Grid item xs={12} mb={`${paginationHeight}px`}>
				<Table
					headers={[
						{
							label: 'Identificación',
							propertyName: 'endCustIdNumber',
						},
						{
							label: 'Tipo identificación',
							propertyName: 'endCustIdType',
						},
						{ label: 'Correo', propertyName: 'endCustMail' },
						{ label: 'Celular', propertyName: 'endCustPhone' },
						{ label: 'Ciudad', propertyName: 'endCustCity' },
						{
							label: 'Departamento',
							propertyName: 'endCustDepartment',
						},
						{ label: 'Región', propertyName: 'endCustRegional' },
						{
							label: 'Conversaciones',
							propertyName: 'countEntries',
						},
					]}
					data={accesos.entriesConsumers.map((item, index) => ({
						id: index,
						...item,
					}))}
					status={getStatus}
					pagination={false}
				/>
			</Grid>

			<ServerPagination
				currentPage={accesos.currentPage}
				handleChange={handleChangePage}
				totalPages={accesos.totalPages}
				totalRecords={accesos.totalResult}
				handleRowsPerPageChange={handleRowsPerPageChange}
				rowsPerPage={rowsPerPage}
				ref={paginationRef}
			/>
		</GridContainer>
	)
}
