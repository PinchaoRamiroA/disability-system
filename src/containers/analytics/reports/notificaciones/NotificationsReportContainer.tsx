import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import {
	getNotifLogs,
	notifLogsSelector,
} from '@/store/slices/reports/notifications'
import { GridContainer } from '@/components/GridContainer'
import { FilterContainer } from '@/containers/FilterContainer'
import { Button, Grid } from '@mui/material'
import { Table } from '@/components/Table'
import fileDownload from 'js-file-download'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useLoading } from '@/hooks/useLoading'

export const NotificationsReportContainer = () => {
	const dispatch = useAppDispatch()

	const { end, start } = useAppSelector(filterSelector)

	const { resource, getStatus } = useAppSelector(notifLogsSelector)
	const { idOrg } = useCompanyAndIdVa()
	const { stopLoading } = useLoading()

	// Crear y descargar CSV
	const handleDownload = () => {
		let csvLines =
			'Evento,Rol,Tipo de notificación,Destinatario,Status,Error,Fecha\n'

		resource.notificationsLog.forEach((notif) => {
			csvLines += `${notif.event},${notif.role},${notif.notificationType},${notif.to},${notif.status},${notif.error},${notif.date}\n`
		})
		fileDownload(csvLines, 'notificaciones.csv')
	}

	useEffect(() => {
		if (idOrg && start && end) {
			dispatch(
				getNotifLogs({
					params: {
						end,
						start,
					},
					idOrg,
				})
			)
		}
	}, [start, end, idOrg])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<GridContainer>
			<FilterContainer filters={{ dates: true }} />

			{/* Descarga */}
			<Grid item xs={12}>
				<Button
					variant="contained"
					onClick={handleDownload}
					disabled={resource.notificationsLog.length === 0}
				>
					Descargar reporte
				</Button>
			</Grid>

			<Grid item xs={12}>
				<Table
					data={resource.notificationsLog.map((item, index) => ({
						...item,
						id: index,
						error: item.error ?? '',
					}))}
					headers={[
						{
							label: 'Evento',
							propertyName: 'event',
						},
						{
							label: 'Rol',
							propertyName: 'role',
						},
						{
							label: 'Canal',
							propertyName: 'notificationType',
						},
						{
							label: 'Destinatario',
							propertyName: 'to',
						},
						{
							label: 'Estado',
							propertyName: 'status',
						},
						{
							label: 'Error',
							propertyName: 'error',
						},
						{
							label: 'Fecha',
							propertyName: 'date',
						},
					]}
					status={getStatus}
				/>
			</Grid>
		</GridContainer>
	)
}
