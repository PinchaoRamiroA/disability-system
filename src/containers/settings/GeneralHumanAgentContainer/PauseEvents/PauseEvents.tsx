import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { Button, Grid, Typography } from '@mui/material'
import { SearchInput } from '@/components/SearchInput'
import { Table } from '@/components/Table'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { RowAction, TableHeader } from '@/types/Table'

import { Delete, Edit } from '@mui/icons-material'
import {
	createPauseEvent,
	deletePauseEvent,
	getPauseEvents,
	pauseEventsSelector,
	updatePauseEvent,
} from '@/store/slices/pauseEvents'
import { PauseEvent } from '@/types/PauseEvents'
import { EventsForm } from './EventsForm'
import { DeleteForm } from '@/components/DeleteForm'
import { useLoading } from '@/hooks/useLoading'

const tableHeaders: TableHeader[] = [
	{ propertyName: 'id', label: 'Id' },
	{ propertyName: 'name', label: 'Nombre Evento' },
	{ propertyName: 'description', label: 'Descripción' },
	{
		propertyName: 'actions',
		label: '',
		align: 'right',
		type: 'actions',
	},
]

export const PauseEvents = () => {
	const dispatch = useAppDispatch()

	const { startLoading, stopLoading } = useLoading()

	// Selector de eventos
	const { resource, getStatus } = useAppSelector(pauseEventsSelector)

	// Splits filtrados
	const [filteredEvents, setFilteredEvents] = useState<PauseEvent[]>([])

	// Filtrar eventos
	const filterEvents = (result: PauseEvent[]) => {
		setFilteredEvents(result)
	}

	// Usuario seleccionado por una acción de la tabla
	const [currentEvent, setCurrentEvent] = useState<PauseEvent | null>(null)

	// Modal crear evento
	const [openCreate, setOpenCreate] = useState(false)
	// Modal actualizar evento
	const [openUpdate, setOpenUpdate] = useState(false)
	// Modal eliminar evento
	const [openDelete, setOpenDelete] = useState(false)

	// Abrir modal de actualización
	const handleOpenUpdate = (event: PauseEvent) => {
		setOpenUpdate(true)
		setCurrentEvent(event)
	}

	// Cerrar modal de actualización
	const handleCloseUpdate = () => {
		setOpenUpdate(false)
		setCurrentEvent(null)
	}

	// Abrir modal de eliminación
	const handleOpenDelete = (event: PauseEvent) => {
		setOpenDelete(true)
		setCurrentEvent(event)
	}

	// Cerrar modal de eliminación
	const handleCloseDelete = () => {
		setOpenDelete(false)
		setCurrentEvent(null)
	}

	/**
	 * Crear usuario
	 */
	// Cerrar modal
	const handleCloseCreate = () => {
		setOpenCreate(false)
	}

	// Confirmar creación de evento
	const handleConfirmCreate = (event: Partial<PauseEvent>) => {
		startLoading()
		const { description, name } = event
		dispatch(
			createPauseEvent({
				event: { description, name },
				handleCloseCreate,
			})
		).then(stopLoading)
	}

	/**
	 * Actions
	 */
	const handleConfirmUpdate = (event: Partial<PauseEvent>) => {
		const { description, name } = event

		startLoading()
		dispatch(
			updatePauseEvent({
				event: {
					id: currentEvent?.id,
					name,
					description,
					logicDelete: false,
				},
				handleCloseUpdate,
			})
		).then(stopLoading)
	}

	const handleConfirmDelete = () => {
		if (currentEvent) {
			dispatch(deletePauseEvent({ pauseEventId: currentEvent.id }))
			handleCloseDelete()
		}
	}

	const buttonActions: RowAction<PauseEvent>[] = [
		{
			action: handleOpenUpdate,
			id: 'handleOpenUpdate',
			label: 'Actualizar',
			icon: <Edit />,
		},
		{
			action: handleOpenDelete,
			id: 'handleOpenDelete',
			label: 'Eliminar',
			icon: <Delete />,
		},
	]

	/**
	 * Hooks
	 */
	// Obtener eventos
	useEffect(() => {
		dispatch(getPauseEvents())
	}, [dispatch])

	// Actualizar eventos filtrados
	useEffect(() => {
		setFilteredEvents(resource)
	}, [resource])

	return (
		<GridContainer>
			<Grid item xs={12}>
				<Typography variant="h6">
					Configuración de eventos de pausa
				</Typography>
			</Grid>
			{/* Filtro de búsqueda */}
			<Grid item xs>
				<SearchInput
					filterBy={['id', 'name', 'description']}
					label="Buscar evento"
					listElements={resource}
					onSubmit={filterEvents}
				/>
			</Grid>

			{/* Botón crear */}
			<Grid item xs="auto">
				<Button
					color="secondary"
					variant="contained"
					onClick={() => setOpenCreate(true)}
				>
					Crear
				</Button>
			</Grid>

			{/* Tabla de datos */}
			<Grid item xs={12}>
				<Table
					data={filteredEvents}
					headers={tableHeaders}
					status={getStatus}
					rowButtonActions={buttonActions}
				/>
			</Grid>

			{/* Formulario para crear evento */}
			<EventsForm
				cancelAction={handleCloseCreate}
				confirmAction={handleConfirmCreate}
				open={openCreate}
				event={{}}
				isCreateForm
			/>

			{/* Formulario para actualizar evento */}
			{currentEvent && (
				<EventsForm
					cancelAction={handleCloseUpdate}
					confirmAction={handleConfirmUpdate}
					open={openUpdate}
					event={currentEvent}
				/>
			)}

			{/* Formulario para eliminar */}
			{currentEvent && (
				<DeleteForm
					handleClose={handleCloseDelete}
					handleConfirm={handleConfirmDelete}
					open={openDelete}
					propertyToDelete={currentEvent.name}
					keyword="Evento de pausa"
				/>
			)}
		</GridContainer>
	)
}
