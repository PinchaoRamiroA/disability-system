import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	deleteNotification,
	getNotificaciones,
	notificationsConfigSelector,
} from '@/store/slices/notifications' // Importar las acciones necesarias

import { Grid, Paper } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Table } from '@/components/Table/Table'
import { RowAction, TableHeader } from '@/types/Table'
import { EventsConfig } from '@/types/Notificaciones'
import { SearchInput } from '@/components/SearchInput'
import * as snackbars from '@/utils/constants/snackbars/user'
import { enqueueSnackbar } from '@/store/slices/notistack/actions'
import { addSnackbarKey } from '@/utils/helpers/enqueueSnackbar'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { GridContainer } from '@/components/GridContainer'
import { SUPERADMIN_ROLE } from '@/utils/constants/roles'
import { CompanyFilter } from '@/components/Filter/FilterDrawer/FilterItem/CompanyFilter'
import { userSelector } from '@/store/slices/authentication'
import { useLoading } from '@/hooks/useLoading'
import { ConfigNotificationForm, ConfigNotificationFormUpdate } from './Forms'

const actionsColumn: TableHeader = {
	propertyName: 'actions',
	label: '',
	align: 'right',
	type: 'actions',
}

const tableHeaders: TableHeader[] = [
	{ propertyName: 'type_event', label: 'Tipo Evento' },
	{ propertyName: 'code_template', label: 'Codigo Plantilla' },
	{ propertyName: 'type_notifications', label: 'Tipo Notificacion' },
	actionsColumn,
]

export const EventosContainer = () => {
	const dispatch = useAppDispatch()
	const { idOrg } = useCompanyAndIdVa()
	// Rol de usuario logueado
	const { role } = useAppSelector(userSelector)
	const { stopLoading } = useLoading()
	const [openUpdate, setOpenUpdate] = useState(false)
	const [selectedNotification, setSelectedNotification] =
		useState<EventsConfig | null>(null)
	const [notificacionesFiltradas, setNotificacionesFiltradas] = useState<
		EventsConfig[]
	>([])
	const { getStatus, resource } = useAppSelector(notificationsConfigSelector)

	const handleOpenUpdate = (param: EventsConfig) => {
		setSelectedNotification(param)
		setOpenUpdate(true)
	}

	const handleCloseUpdate = async () => {
		setSelectedNotification(null)
		setOpenUpdate(false)
		//await dispatch(getNotificaciones(idOrg))
	}

	const handleOpenDelete = async (param: EventsConfig) => {
		// Lógica para eliminar la notificación
		const idAsString = param.id.toString()
		await dispatch(deleteNotification(idAsString))
		await dispatch(getNotificaciones(idOrg))
		dispatch(enqueueSnackbar(addSnackbarKey(snackbars.DeleteEventSuccess)))
	}

	const rowActions: RowAction<EventsConfig>[] = [
		{
			id: 'handleOpenUpdate',
			icon: <EditIcon />,
			label: 'Actualizar',
			action: handleOpenUpdate,
		},
		{
			id: 'handleOpenDelete',
			icon: <DeleteIcon />,
			label: 'Eliminar',
			action: handleOpenDelete,
		},
	]

	const filterSplits = (result: EventsConfig[]) => {
		setNotificacionesFiltradas(result)
	}

	useEffect(() => {
		dispatch(getNotificaciones(idOrg))
	}, [dispatch, idOrg])

	useEffect(() => {
		setNotificacionesFiltradas(resource)
	}, [resource])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<GridContainer>
			{/* Filtro de organización */}
			{role === SUPERADMIN_ROLE && (
				<Grid item xs>
					<Paper elevation={0}>
						<CompanyFilter settings />
					</Paper>
				</Grid>
			)}

			<Grid item xs>
				<SearchInput
					filterBy={[
						'type_event',
						'code_template',
						'type_notifications',
					]}
					label="Buscar plantilla"
					listElements={resource}
					onSubmit={filterSplits}
				/>
			</Grid>

			<Grid item xs="auto">
				<ConfigNotificationForm />
			</Grid>

			<Grid item xs={12}>
				<Table<EventsConfig>
					status={getStatus}
					headers={tableHeaders}
					rowButtonActions={rowActions}
					data={notificacionesFiltradas}
				/>
			</Grid>

			{selectedNotification && (
				<ConfigNotificationFormUpdate
					open={openUpdate}
					notification={selectedNotification}
					handleClose={handleCloseUpdate}
				/>
			)}
		</GridContainer>
	)
}
