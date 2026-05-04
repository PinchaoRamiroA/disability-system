import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { Button, Grid } from '@mui/material'
import { SearchInput } from '@/components/SearchInput'
import { Table } from '@/components/Table'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { userSelector } from '@/store/slices/authentication'
import { NormalizedUser, User } from '@/types/users'
import { RowAction, TableHeader } from '@/types/Table'

import * as slice from '@/store/slices/users'
import { CallSplit, Delete, Edit } from '@mui/icons-material'
import { EditSplits } from './Forms/EditSplits'
import {
	getAgentSplits,
	getSplits,
	splitsSelector,
} from '@/store/slices/splits'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useLoading } from '@/hooks/useLoading'
import { DeleteForm } from '@/components/DeleteForm'
import { useSnackbar } from 'notistack'
import { UserForm } from '../AdministrarUsuarios/UsersContainer/UserForm'

const tableHeaders: TableHeader[] = [
	{ label: 'Activo', propertyName: 'isActive', type: 'switch' },
	{ propertyName: 'fullName', label: 'Nombre' },
	{ propertyName: 'email', label: 'Nombre usuario' },
	{ propertyName: 'dateCreate', label: 'Fecha de creación' },
	{ propertyName: 'dateUpdate', label: 'Última actualización' },
	{ propertyName: 'modifiedBy', label: 'Modificado por' },
	{
		propertyName: 'actions',
		label: '',
		align: 'right',
		type: 'actions',
	},
]

export const HumanAgentContainer = () => {
	const dispatch = useAppDispatch()
	const { enqueueSnackbar } = useSnackbar()
	const { startLoading, stopLoading } = useLoading()

	// Selector de usuarios
	const { resource, getStatus } = useAppSelector(slice.usersSelector)

	// Selector de splits
	const { resource: splitsResource } = useAppSelector(splitsSelector)

	const { idOrg } = useCompanyAndIdVa()

	// Rol de usuario logueado
	const { role } = useAppSelector(userSelector)

	// Usuarios filtrados
	const [filteredUsers, setFilteredUsers] = useState<NormalizedUser[]>([])

	// Filtrar usuarios
	const filterUsers = (result: NormalizedUser[]) => {
		setFilteredUsers(result)
	}

	// Usuario seleccionado por una acción de la tabla
	const [currentUser, setCurrentUser] = useState<NormalizedUser | null>(null)

	// Modal crear asesor
	const [openCreate, setOpenCreate] = useState(false)
	// Modal actualizar asesor
	const [openUpdate, setOpenUpdate] = useState(false)
	// Modal splits asesor
	const [openSplits, setOpenSplits] = useState(false)
	// Modal eliminar asesor
	const [openDelete, setOpenDelete] = useState(false)

	// Abrir modal de splits del asesor
	const handleOpenUpdate = (user: NormalizedUser) => {
		setOpenUpdate(true)
		setCurrentUser(user)
	}

	// Cerrar modal de splits del asesor
	const handleCloseUpdate = () => {
		setOpenUpdate(false)
		setCurrentUser(null)
	}

	// Abrir modal de splits del asesor
	const handleOpenSplits = (user: NormalizedUser) => {
		dispatch(getAgentSplits({ idUsuario: user.idUser }))
		setOpenSplits(true)
		setCurrentUser(user)
	}

	// Cerrar modal de splits del asesor
	const handleCloseSplits = () => {
		setOpenSplits(false)
		setCurrentUser(null)
	}

	// Abrir modal de eliminación
	const handleOpenDelete = (user: NormalizedUser) => {
		setOpenDelete(true)
		setCurrentUser(user)
	}

	// Cerrar modal de eliminación
	const handleCloseDelete = () => {
		setOpenDelete(false)
		setCurrentUser(null)
	}

	/**
	 * Crear usuario
	 */
	const handleCloseCreate = () => {
		setOpenCreate(false)
		setCurrentUser(null)
	}

	const handleConfirmCreate = (user: Partial<User>) => {
		startLoading(true)
		dispatch(
			slice.createUser({
				user,
				role,
				callback: () => handleCloseCreate(),
			})
		).then(stopLoading)
	}

	/**
	 * Checkbox Activar/Desactivar
	 */
	const handleToggleActive = (param: NormalizedUser) => {
		startLoading()
		const { idUser, isActive } = param
		dispatch(slice.toggleActiveUser({ idUser, isActive: !isActive })).then(
			stopLoading
		)
	}

	/**
	 * Actions
	 */
	const handleConfirmSplits = () => {
		handleCloseSplits()
	}

	const handleConfirmUpdate = (toUpdateUser: Partial<NormalizedUser>) => {
		const { idUser, role, company, fullName, email, password } =
			toUpdateUser
		const payloadUser: Partial<NormalizedUser> = { idUser }

		// Agregar al payload solo inputs que cambiaron de valor
		if (currentUser?.role !== role) {
			payloadUser.role = role
		}
		if (currentUser?.company !== company) {
			payloadUser.company = company
		}
		if (currentUser?.fullName !== fullName) {
			payloadUser.fullName = fullName
		}
		if (currentUser?.email !== email) {
			payloadUser.email = email
		}
		if (currentUser?.password !== password) {
			payloadUser.password = password
		}

		if (Object.keys(payloadUser).length > 1) {
			startLoading(true)
			dispatch(
				slice.putUsers({
					user: payloadUser,
					callback: () => handleCloseUpdate(),
				})
			).then(stopLoading)
		}
		// Mostrar mensaje indicando que no se encontraron cambios
		else {
			enqueueSnackbar('No se identificaron cambios en el formulario', {
				variant: 'info',
			})
		}
	}

	const handleConfirmDelete = () => {
		if (currentUser) {
			startLoading()
			dispatch(slice.deleteUser({ id: currentUser.idUser, role })).then(
				stopLoading
			)
			handleCloseDelete()
		}
	}

	const buttonActions: RowAction<NormalizedUser>[] = [
		{
			action: handleOpenSplits,
			id: 'handleOpenSplits',
			label: 'Editar splits',
			icon: <CallSplit />,
			canBeDisabled: true,
		},
		{
			action: handleOpenUpdate,
			id: 'handleOpenUpdate',
			label: 'Editar asesor',
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

	/**
	 * Hooks
	 */
	// Obtener usuarios y splits
	useEffect(() => {
		dispatch(slice.getUsers({ filterAgents: true }))
		if (idOrg) {
			dispatch(getSplits({ idOrg }))
		}
	}, [dispatch, idOrg])

	// Actualizar usuarios filtrados
	useEffect(() => {
		setFilteredUsers(resource)
	}, [resource])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<GridContainer>
			{/* Filtro de búsqueda */}
			<Grid item xs>
				<SearchInput
					filterBy={['fullName', 'email']}
					label="Buscar asesor"
					listElements={resource}
					onSubmit={filterUsers}
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
					data={filteredUsers}
					headers={tableHeaders}
					status={getStatus}
					activeColumn="isActive"
					switchAction={handleToggleActive}
					rowButtonActions={buttonActions}
				/>
			</Grid>

			{/* Modal crear asesor */}
			<UserForm
				cancelAction={handleCloseCreate}
				confirmAction={handleConfirmCreate}
				open={openCreate}
				user={{}}
				isAgentCreate
				isCreateForm
				hideRoleList
			/>

			{/* Modal actualizar splits */}
			{currentUser && (
				<EditSplits
					handleClose={handleCloseSplits}
					handleConfirm={handleConfirmSplits}
					open={openSplits}
					userName={currentUser.fullName}
					userId={currentUser.idUser}
					splits={splitsResource}
				/>
			)}

			{/* Modal actualizar asesor */}
			{currentUser && (
				<UserForm
					cancelAction={handleCloseUpdate}
					confirmAction={handleConfirmUpdate}
					open={openUpdate}
					user={currentUser}
					isAgentUpdate
					hideRoleList
				/>
			)}

			{/* Modal eliminar */}
			{currentUser && (
				<DeleteForm
					handleClose={handleCloseDelete}
					handleConfirm={handleConfirmDelete}
					keyword="Asesor"
					open={openDelete}
					propertyToDelete={currentUser.fullName}
				/>
			)}
		</GridContainer>
	)
}
