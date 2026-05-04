import React, { useEffect, useState } from 'react'
import { useLoading } from '@/hooks/useLoading'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	contactsSelector,
	createContact,
	deleteContact,
	getContacts,
	updateContact,
} from '@/store/slices/settings/asesor-humano'
import { RowAction, TableHeader } from '@/types/Table'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { userSelector } from '@/store/slices/authentication'
import { Contact } from '@/types/Settings/asesor-humano/directorio'
import { SUPERADMIN_ROLE } from '@/utils/constants/roles'
import { Delete, Edit } from '@mui/icons-material'
import { GridContainer } from '@/components/GridContainer'
import { Button, Grid } from '@mui/material'
import { SearchInput } from '@/components/SearchInput'
import { AdminFilters } from '@/components/Filter/AdminFilters'
import { DeleteForm } from '@/components/DeleteForm'
import { Table } from '@/components/Table'
import { DirectorioForm } from './DirectorioForm'
import { getLocations } from '@/store/slices/locations/actions'

const tableHeaders: TableHeader[] = [
	{ propertyName: 'isActive', label: 'Activo', type: 'switch' },
	{ propertyName: 'name', label: 'Nombre' },
	{ propertyName: 'email', label: 'Email' },
	{ propertyName: 'phone', label: 'Teléfono' },
	{ propertyName: 'idType', label: 'Tipo identificación' },
	{ propertyName: 'idNumber', label: 'Número de identificación' },
	{ propertyName: 'department', label: 'Departamento' },
	{ propertyName: 'city', label: 'Ciudad' },
	{
		propertyName: 'actions',
		label: '',
		align: 'right',
		type: 'actions',
	},
]

export const DirectorioContainer = () => {
	const dispatch = useAppDispatch()
	const { startLoading, stopLoading } = useLoading()

	// Selector de causales
	const { resource, getStatus } = useAppSelector(contactsSelector)
	const { idOrg, idVa } = useCompanyAndIdVa()
	const { role } = useAppSelector(userSelector)

	// Contactos filtrados
	const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])

	// Contact seleccionado para una acción en la tabla
	const [currentContact, setCurrentContact] = useState<Contact | null>(null)
	const [currentContactToDelete, setCurrentContactToDelete] =
		useState<Contact | null>(null)

	// Modal crear contact
	const [openCreate, setOpenCreate] = useState(false)
	// Modal actualizar contact
	const [openUpdate, setOpenUpdate] = useState(false)
	// Modal eliminar contact
	const [openDelete, setOpenDelete] = useState(false)
	// Control en visualización de loader
	const [locationsLoaded, setLocationsLoaded] = useState(false)

	// Filtrar contactos
	const updateFilteredContacts = (result: Contact[]) => {
		setFilteredContacts(result)
	}

	// Cerrar modal de creación
	const handleCloseCreate = () => {
		setOpenCreate(false)
		setCurrentContact(null)
	}

	// Abrir modal de edición
	const handleOpenUpdate = (contact: Contact) => {
		setOpenUpdate(true)
		setCurrentContact(contact)
	}

	// Cerrar modal de edición
	const handleCloseUpdate = () => {
		setOpenUpdate(false)
		setCurrentContact(null)
	}

	// Abrir modal de eliminación
	const handleOpenDelete = (contact: Contact) => {
		setOpenDelete(true)
		setCurrentContactToDelete(contact)
	}

	// Cerrar modal de eliminación
	const handleCloseDelete = () => {
		setOpenDelete(false)
		setCurrentContactToDelete(null)
	}

	// Switch Activar/Desactivar
	const handleToggleActive = (contact: Partial<Contact>) => {
		startLoading()
		const { isActive, idContact } = contact

		dispatch(
			updateContact({
				body: {
					idOrg: role === SUPERADMIN_ROLE ? idOrg : undefined,
					payload: {
						id: idContact,
						isActive: !isActive,
					},
				},
			})
		).then(stopLoading)
	}

	// Confirmar creación
	const handleConfirmCreate = (
		contact: Partial<Contact>,
		resetSubmitting: () => void
	) => {
		const { idCity, email, idNumber, idType, name, phone } = contact

		// Campos nombre y teléfono son obligatorios
		if (name && phone) {
			startLoading(true)
			dispatch(
				createContact({
					handleCloseCreate,
					body: {
						idOrg: role === SUPERADMIN_ROLE ? idOrg : undefined,
						payload: {
							name,
							phone,
							idVa,
							idType,
							idCity,
							// Los campos email y idNumber pueden venir vacíos, por lo tanto no se toman como opcionales (o undefined)
							...(email?.length && {
								email,
							}),
							...(idNumber?.length && {
								idNumber,
							}),
						},
					},
					resetSubmitting,
				})
			).then(stopLoading)
		}
	}

	// Confirmar actualización
	const handleConfirmUpdate = (
		contact: Partial<Contact>,
		resetSubmitting: () => void
	) => {
		if (currentContact) {
			startLoading(true)
			const { name, phone, email, idType, idNumber, idCity } = contact

			dispatch(
				updateContact({
					body: {
						idOrg: role === SUPERADMIN_ROLE ? idOrg : undefined,
						payload: {
							id: contact.idContact,
							...(name !== currentContact.name && {
								name,
							}),
							...(phone !== currentContact.phone && {
								phone,
							}),
							...(email !== currentContact.email && {
								email: email ?? '',
							}),
							...(idNumber !== currentContact.idNumber && {
								idNumber: idNumber ?? '',
							}),
							...(idType !== currentContact.idType && {
								idType: idType ?? '',
							}),
							...(idCity !== currentContact.idCity && {
								idCity: idCity ?? -1,
							}),
						},
					},
					handleCloseUpdate,
					resetSubmitting,
				})
			).then(stopLoading)
		}
	}

	// Confirmar eliminación
	const handleConfirmDelete = () => {
		if (currentContactToDelete) {
			startLoading(true)

			dispatch(
				deleteContact({
					idContact: currentContactToDelete.idContact,
					idOrg: role === SUPERADMIN_ROLE ? idOrg : undefined,
				})
			).then(stopLoading)

			handleCloseDelete()
		}
	}

	// Acciones de la tabla
	const buttonActions: RowAction<Contact>[] = [
		{
			action: handleOpenUpdate,
			id: 'handleOpenUpdate',
			label: 'Actualizar',
			icon: <Edit />,
			canBeDisabled: true,
		},
		{
			action: handleOpenDelete,
			id: 'handleOpenDelete',
			label: 'Eliminar',
			icon: <Delete />,
		},
	]

	// Obtener contactos
	useEffect(() => {
		if (idOrg && idVa && locationsLoaded) {
			startLoading()
			dispatch(
				getContacts({
					...(role === SUPERADMIN_ROLE && { idOrg }),
					idVa,
				})
			).then(stopLoading)
		}
	}, [idOrg, idVa, locationsLoaded])

	// Obtener departamentos
	useEffect(() => {
		if (idOrg) {
			startLoading()
			dispatch(getLocations({ requireCities: true, idOrg })).then(() => {
				stopLoading()
				setLocationsLoaded(true)
			})
		}
	}, [idOrg])

	// Setear contactos filtrados
	useEffect(() => {
		setFilteredContacts(resource)
	}, [resource])

	return (
		<React.Fragment>
			<GridContainer>
				<AdminFilters />

				{/* Filtro de búsqueda */}
				<Grid item xs>
					<SearchInput
						filterBy={[
							'name',
							'email',
							'idNumber',
							'idType',
							'phone',
							'department',
							'city',
						]}
						label="Buscar contacto"
						listElements={resource}
						onSubmit={updateFilteredContacts}
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
						data={filteredContacts}
						headers={tableHeaders}
						status={getStatus}
						activeColumn="isActive"
						switchAction={handleToggleActive}
						rowButtonActions={buttonActions}
					/>
				</Grid>

				{/* Modal de creación */}
				<DirectorioForm
					cancelAction={handleCloseCreate}
					contact={{}}
					confirmAction={handleConfirmCreate}
					open={openCreate}
					isCreateForm
					phones={resource.map((item) => item.phone)}
				/>

				{/* Modal de actualización */}
				{currentContact && (
					<DirectorioForm
						cancelAction={handleCloseUpdate}
						contact={currentContact}
						confirmAction={handleConfirmUpdate}
						open={openUpdate}
						phones={resource
							.map((item) => item.phone)
							.filter((phone) => phone !== currentContact.phone)}
					/>
				)}

				{/* Modal eliminar */}
				{currentContactToDelete && (
					<DeleteForm
						handleClose={handleCloseDelete}
						handleConfirm={handleConfirmDelete}
						open={openDelete}
						propertyToDelete={currentContactToDelete.name}
						keyword="contacto"
					/>
				)}
			</GridContainer>
		</React.Fragment>
	)
}
