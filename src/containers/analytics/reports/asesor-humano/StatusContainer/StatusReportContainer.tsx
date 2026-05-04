import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	estadoHistoricoSelector,
	getDescargaHistorico,
	getEstadoHistorico,
} from '@/store/slices/reports/humanAgent/estadoHistorico'
import { filterSelector } from '@/store/slices/Filter'
import { GridContainer } from '@/components/GridContainer'
import { FilterContainer } from '@/containers/FilterContainer'
import { Button, Grid } from '@mui/material'
import { Table } from '@/components/Table'
import { LogEventoPausa } from '@/types/HumanAgent/EstadoAsesores'
import moment from 'moment'
import { useLoading } from '@/hooks/useLoading'
import { SubtableHeader, TableHeader } from '@/types/Table'
import { ServerPagination } from '@/components/Table/ServerPagination'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useRowsPerPage } from '@/hooks/paginacion/useRowsPerPage'
import { useResizeDetector } from 'react-resize-detector'

interface StatusData {
	fechaConexion: string
	fechaDesconexion: string
	id: number | string
	idAsesor: number
	idLogConexion: number
	logEventoPausa: LogEventoPausa[]
	nombreAsesor: string
	email: string
	pausas: number
}

const tableHeaders: TableHeader[] = [
	{
		label: '',
		propertyName: '',
		type: 'expand',
	},
	{
		label: 'Id asesor',
		propertyName: 'idAsesor',
		align: 'center',
	},
	{
		label: 'Nombre asesor',
		propertyName: 'nombreAsesor',
	},
	{
		label: 'Usuario',
		propertyName: 'email',
	},
	{ label: '# Eventos pausa', propertyName: 'pausas', align: 'center' },
	{
		label: 'Fecha conexión',
		propertyName: 'fechaConexion',
	},
	{
		label: 'Fecha desconexión',
		propertyName: 'fechaDesconexion',
	},
]

const subtableHeaders: SubtableHeader[] = [
	{
		label: 'Motivo',
		propertyName: 'pauseEventName',
		align: 'right',
	},
	{
		label: 'Fecha inicio',
		propertyName: 'startTime',
		align: 'right',
	},
	{
		label: 'Fecha fin',
		propertyName: 'endTime',
		align: 'right',
	},
]

export const StatusReportContainer = () => {
	const dispatch = useAppDispatch()
	const { startLoading, stopLoading } = useLoading()
	const { idOrg } = useCompanyAndIdVa()
	const { resource, getStatus } = useAppSelector(estadoHistoricoSelector)
	const { start, end, agents, splits } = useAppSelector(filterSelector)

	const { handleRowsPerPageChange, rowsPerPage } = useRowsPerPage()
	const { ref: paginationRef, height: paginationHeight } = useResizeDetector()

	const [formatedData, setFormatedData] = useState<StatusData[]>([])

	const callGetEstadoHistorico = (page: number) => {
		if (idOrg && start && end) {
			dispatch(
				getEstadoHistorico({
					idOrg,
					agents,
					splits,
					end,
					start,
					page,
					perPage: rowsPerPage,
				})
			)
		}
	}

	// Descargar reporte
	const handleDownload = () => {
		startLoading()
		dispatch(
			getDescargaHistorico({
				idOrg,
				agents,
				end,
				splits,
				start,
			})
		).then(stopLoading)
	}

	// Llamar servicio al navegar por la paginación
	const handlePageChange = (page: number) => {
		callGetEstadoHistorico(page)
	}

	useEffect(() => {
		callGetEstadoHistorico(1)
	}, [start, end, agents?.toString(), splits?.toString(), idOrg, rowsPerPage])

	useEffect(() => {
		const conexionLog: number[] = []
		const newEstado: StatusData[] = []

		resource.connections.forEach((item, index) => {
			if (conexionLog.includes(item.idLogConexion)) {
				const log = newEstado.filter(
					(e) => e.idLogConexion === item.idLogConexion
				)[0]

				if (item.logEventoPausa) {
					log.pausas += 1
					log.logEventoPausa.push({
						...item.logEventoPausa,
						startTime: moment(item.logEventoPausa.startTime).format(
							'DD/MM/YYYY, HH:mm A'
						),
						endTime: moment(item.logEventoPausa.endTime).format(
							'DD/MM/YYYY, HH:mm A'
						),
					})
				}
			} else {
				const {
					fechaConexion,
					fechaDesconexion,
					idAsesor,
					idLogConexion,
					logEventoPausa,
					nombreAsesor,
					email,
				} = item

				newEstado.push({
					id: index,
					fechaConexion: moment(fechaConexion).format(
						'DD/MM/YYYY, HH:mm A'
					),
					fechaDesconexion: fechaDesconexion
						? moment(fechaDesconexion).format('DD/MM/YYYY, HH:mm A')
						: '',
					idAsesor,
					idLogConexion,
					logEventoPausa: logEventoPausa
						? [
								{
									...logEventoPausa,
									startTime: moment(
										logEventoPausa.startTime
									).format('DD/MM/YYYY, HH:mm A'),
									endTime: logEventoPausa.endTime
										? moment(logEventoPausa.endTime).format(
												'DD/MM/YYYY, HH:mm A'
										  )
										: 'No registra',
								},
						  ]
						: [],
					nombreAsesor,
					email,
					pausas: logEventoPausa ? 1 : 0,
				})
				conexionLog.push(idLogConexion)
			}
		})

		setFormatedData(newEstado)
	}, [resource])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<GridContainer>
			<FilterContainer
				filters={{ dates: true, agents: true, splits: true }}
			/>

			<Grid item xs={12}>
				<Button
					variant="contained"
					onClick={handleDownload}
					disabled={formatedData.length === 0}
				>
					Descargar reporte
				</Button>
			</Grid>

			<Grid item xs={12} mb={`${paginationHeight}px`}>
				<Table
					headers={tableHeaders}
					data={formatedData.map((item) => ({ ...item }))}
					status={getStatus}
					pagination={false}
					subtableColumn="logEventoPausa"
					subtableHeaders={subtableHeaders}
				/>
			</Grid>

			<ServerPagination
				currentPage={resource.currentPage}
				totalRecords={resource.totalResult}
				handleChange={handlePageChange}
				totalPages={resource.totalPages}
				handleRowsPerPageChange={handleRowsPerPageChange}
				rowsPerPage={rowsPerPage}
				ref={paginationRef}
			/>
		</GridContainer>
	)
}
