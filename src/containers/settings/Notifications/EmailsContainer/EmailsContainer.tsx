import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { SearchInput } from '@/components/SearchInput'
import { Table } from '@/components/Table'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useLoading } from '@/hooks/useLoading'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	createEmail,
	deleteEmail,
	emailsConfigSelector,
	getEmails,
	updateEmail,
} from '@/store/slices/settings/notificaciones'
import { EmailsConfig } from '@/types/Notificaciones'
import { RowAction, TableHeader } from '@/types/Table'
import { Delete, Edit } from '@mui/icons-material'
import { Button, Grid } from '@mui/material'
import { UpsertModal } from './UpsertModal'
import { DeleteForm } from '@/components/DeleteForm'

const tableHeaders: TableHeader[] = [
	{ propertyName: 'email', label: 'Email' },
	{ propertyName: 'namePerson', label: 'Nombre persona' },
	{
		propertyName: 'actions',
		label: '',
		align: 'right',
		type: 'actions',
	},
]

export const EmailsContainer = () => {
	const dispatch = useAppDispatch()

	const { idOrg } = useCompanyAndIdVa()

	// Reducer
	const { getStatus, resource } = useAppSelector(emailsConfigSelector)

	// Loader
	const { startLoading, stopLoading } = useLoading()

	// State para abrir modal de creación
	const [openCreate, setOpenCreate] = useState(false)
	// State para abrir modal de actualización
	const [openUpdate, setOpenUpdate] = useState(false)
	// State para abrir modal de eliminación
	const [openDelete, setOpenDelete] = useState(false)

	// Email seleccionado para edición o eliminación
	const [currentEmail, setCurrentEmail] = useState<EmailsConfig>()

	// Emails a mostrar en la tabla (filtrados)
	const [emailsFiltrados, setEmailsFiltrados] = useState<EmailsConfig[]>([])

	// Filtrar emails
	const filterEmails = (result: EmailsConfig[]) => {
		setEmailsFiltrados(result)
	}

	/**
	 * Manejadores de states de modales
	 */
	// Creación
	const handleOpenCreate = () => {
		setOpenCreate(true)
	}
	const handleCloseCreate = () => {
		setOpenCreate(false)
	}

	// Actualización
	const handleOpenUpdate = (email: EmailsConfig) => {
		setOpenUpdate(true)
		setCurrentEmail(email)
	}
	const handleCloseUpdate = () => {
		setOpenUpdate(false)
		setCurrentEmail(undefined)
	}

	// Eliminación
	const handleOpenDelete = (email: EmailsConfig) => {
		setOpenDelete(true)
		setCurrentEmail(email)
	}
	const handleCloseDelete = () => {
		setOpenDelete(false)
		setCurrentEmail(undefined)
	}

	/**
	 * Confirmación de acciones
	 */
	// Confirmar creación
	const handleCreateConfirm = (config: Partial<EmailsConfig>) => {
		const { email, namePerson } = config

		if (email && namePerson) {
			startLoading(true)

			dispatch(
				createEmail({
					config: {
						data: {
							email,
							namePerson,
						},
						idOrg,
					},
					handleCloseCreate,
				})
			).then(stopLoading)
		}
	}

	// Confirmar actualización
	const handleUpdateConfirm = (config: Partial<EmailsConfig>) => {
		const { email, namePerson } = config

		if (currentEmail && (email || namePerson)) {
			startLoading(true)

			dispatch(
				updateEmail({
					config: {
						idOrg,
						payload: {
							idEmail: currentEmail.idEmail,
							email,
							namePerson,
						},
					},
					handleCloseUpdate,
				})
			).then(stopLoading)
		}
	}

	// Confirmar eliminación
	const handleDeleteConfirm = () => {
		if (currentEmail) {
			startLoading(true)

			dispatch(
				deleteEmail({
					config: {
						idOrg,
						idEmail: currentEmail.idEmail,
					},
					handleCloseDelete,
				})
			).then(stopLoading)
		}
	}

	// Acciones de la tabla
	const rowActions: RowAction<EmailsConfig>[] = [
		{
			id: 'handleOpenUpdate',
			icon: <Edit />,
			label: 'Actualizar',
			action: handleOpenUpdate,
		},
		{
			id: 'handleOpenDelete',
			icon: <Delete />,
			label: 'Eliminar',
			action: handleOpenDelete,
		},
	]

	/**
	 * Effects
	 */
	// Obtener emails
	useEffect(() => {
		if (idOrg) {
			startLoading()
			dispatch(getEmails({ idOrg })).then(stopLoading)
		}
	}, [idOrg])

	// Actualizar emails filtrados
	useEffect(() => {
		setEmailsFiltrados(resource)
	}, [resource])

	return (
		<GridContainer>
			{/* Filtro de búsqueda */}
			<Grid item xs>
				<SearchInput
					filterBy={['email', 'namePerson']}
					label="Buscar email"
					listElements={resource}
					onSubmit={filterEmails}
				/>
			</Grid>
			{/* Botón crear */}
			<Grid item xs="auto">
				<Button
					color="secondary"
					variant="contained"
					onClick={handleOpenCreate}
				>
					Crear
				</Button>
			</Grid>

			{/* Tabla */}
			<Grid item xs={12}>
				<Table
					data={emailsFiltrados}
					headers={tableHeaders}
					status={getStatus}
					rowButtonActions={rowActions}
				/>
			</Grid>

			{/* Modal creación */}
			<UpsertModal
				cancelAction={handleCloseCreate}
				config={{}}
				open={openCreate}
				createForm
				confirmAction={handleCreateConfirm}
			/>

			{/* Modales actualizar y eliminar */}
			{currentEmail && (
				<>
					{/* Actualizar */}
					<UpsertModal
						cancelAction={handleCloseUpdate}
						config={currentEmail}
						open={openUpdate}
						confirmAction={handleUpdateConfirm}
					/>

					{/* Eliminar */}
					<DeleteForm
						handleClose={handleCloseDelete}
						handleConfirm={handleDeleteConfirm}
						keyword="email"
						open={openDelete}
						propertyToDelete={currentEmail.email}
					/>
				</>
			)}
		</GridContainer>
	)
}
