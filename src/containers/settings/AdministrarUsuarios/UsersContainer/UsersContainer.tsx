import React, { useEffect, useState } from 'react'
import { SearchInput } from '@/components/SearchInput'
import { Table } from '@/components/Table'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { useToggleBooleanState } from '@/hooks/useToggleBooleanState'
import { userSelector } from '@/store/slices/authentication'
import LockIcon from '@mui/icons-material/Lock'
import {
	RowAction,
	RowSwitchAction,
	TableAction,
	TableHeader,
} from '@/types/Table'
import { NormalizedUser, User } from '@/types/users'
import { ADMIN_ROLE, SUPERADMIN_ROLE } from '@/utils/constants/roles'
import { Button, Grid } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import * as slice from '@/store/slices/users'
import { UserForm } from './UserForm'
import { useLoading } from '@/hooks/useLoading'
import { DeleteForm } from '@/components/DeleteForm'
import { GridContainer } from '@/components/GridContainer'
import { useSnackbar } from 'notistack'

const activeColumn: TableHeader = {
	propertyName: 'isActive',
	label: 'Activo',
	type: 'switch',
}

const actionsColumn: TableHeader = {
	propertyName: 'actions',
	label: '',
	align: 'right',
	type: 'actions',
}

const headers: TableHeader[] = [
	{ propertyName: 'fullName', label: 'Nombre' },
	{ propertyName: 'email', label: 'Nombre usuario' },
	{ propertyName: 'roleLabel', label: 'Rol' },
	{ propertyName: 'dateCreate', label: 'Fecha de creación' },
	{ propertyName: 'dateUpdate', label: 'Última actualización' },
	{ propertyName: 'modifiedBy', label: 'Modificado por' },
]

const adminHeaders: TableHeader[] = [activeColumn, ...headers, actionsColumn]

const superAdminHeaders: TableHeader[] = [
	activeColumn,
	...headers,
	{ propertyName: 'companyName', label: 'Compañía' },
	actionsColumn,
]

export const UsersContainer = () => {
	const dispatch = useAppDispatch()
	const { enqueueSnackbar } = useSnackbar()
	const { startLoading, stopLoading } = useLoading()

	const { resource, getStatus } = useAppSelector(slice.usersSelector)

	const { role } = useAppSelector(userSelector)
	const [filteredUsers, setFilteredUsers] = useState<NormalizedUser[]>([])

	//current User to perform an action (update, delete)
	const [currentUser, setCurrentUser] = useState<NormalizedUser | null>(null)

	//createUser
	const [openCreate, setOpenCreate, setCloseCreate] =
		useToggleBooleanState(false)

	const createUser = (toCreateUser: Partial<User>) => {
		startLoading(true)
		dispatch(
			slice.createUser({
				user: toCreateUser,
				role: role,
				callback: () => setCloseCreate(),
			})
		).then(stopLoading)
	}

	/**
	 * Activar/Desactivar usuario
	 */
	const handleToggleActive = (param: NormalizedUser) => {
		startLoading()
		const { idUser, isActive } = param

		dispatch(slice.toggleActiveUser({ idUser, isActive: !isActive })).then(
			stopLoading
		)
	}

	/**
	 * Actualizar usuario
	 */
	const [openUpdate, setOpenUpdate, setCloseUpdate] =
		useToggleBooleanState(false)

	const handleOpenUpdate = (param: NormalizedUser) => {
		setOpenUpdate()
		setCurrentUser(param)
	}
	const handleCloseUpdate = () => {
		setCloseUpdate()
		setCurrentUser(null)
	}

	const updateUser = (toUpdateUser: Partial<NormalizedUser>) => {
		const { idUser, role, company, fullName, email, password } =
			toUpdateUser
		const payloadUser: Partial<NormalizedUser> = { idUser }

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
					callback: handleCloseUpdate,
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

	/**
	 * Eliminar usuario
	 */
	const [openDelete, setOpenDelete, setCloseDelete] =
		useToggleBooleanState(false)

	const handleOpenDelete = (param: NormalizedUser) => {
		setOpenDelete()
		setCurrentUser(param)
	}

	const handleCloseDelete = () => {
		setCloseDelete()
		setCurrentUser(null)
	}

	const deleteUser = () => {
		if (currentUser) {
			startLoading()
			dispatch(
				slice.deleteUser({ id: currentUser.idUser, role: role })
			).then(stopLoading)
			handleCloseDelete()
		}
	}

	const handleOpenUnloked = (param: NormalizedUser) => {
		startLoading()
		const { idUser } = param
		dispatch(slice.toggleUnlockUser({ idUser, isLocked: false })).then(
			stopLoading
		)
	}

	/**
	 * Crear usuario
	 */
	const tableAction: TableAction = {
		id: 'setOpenCreate',
		label: 'Crear',
		action: setOpenCreate,
	}

	/**
	 * Columna de checkbox
	 */
	const switchAction: RowSwitchAction<NormalizedUser> = handleToggleActive

	/**
	 * Columna de acciones
	 */
	const rowActions: RowAction<NormalizedUser>[] = [
		{
			id: 'handleOpenUpdate',
			icon: <EditIcon />,
			label: 'Actualizar',
			action: handleOpenUpdate,
			canBeDisabled: true,
		},
		{
			id: 'handleOpenDelete',
			icon: <DeleteIcon />,
			label: 'Eliminar',
			action: handleOpenDelete,
		},
		{
			id: 'isLocked',
			icon: <LockIcon />,
			label: 'Desbloquear',
			action: handleOpenUnloked,
			lock: true,
			canBeDisabled: true,
		},
	]

	const filterUsers = (filtered: NormalizedUser[]) => {
		setFilteredUsers(filtered)
	}

	// Filtrar usuarios
	useEffect(() => {
		setFilteredUsers(resource)
	}, [resource])

	// Cargar usuarios
	useEffect(() => {
		dispatch(slice.getUsers())
	}, [dispatch])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<GridContainer>
			<Grid item xs>
				<SearchInput
					listElements={resource}
					filterBy={['fullName', 'roleLabel', 'email', 'companyName']}
					onSubmit={filterUsers}
					label="Buscar usuario"
				/>
			</Grid>

			<Grid item xs="auto" display="flex" justifyContent="space-between">
				{/* Botón de creación (solo para super y admin) */}
				{[SUPERADMIN_ROLE, ADMIN_ROLE].includes(role) && (
					<Button
						color="primary"
						variant="contained"
						sx={{ ml: 2, display: 'block', flexShrink: 0 }}
						onClick={tableAction.action}
						id="btn-crear"
					>
						{tableAction.label}
					</Button>
				)}
			</Grid>

			<Grid item xs={12}>
				<Table<NormalizedUser>
					status={getStatus}
					headers={
						role === SUPERADMIN_ROLE
							? superAdminHeaders
							: role === ADMIN_ROLE
							? adminHeaders
							: headers
					}
					rowButtonActions={
						role === SUPERADMIN_ROLE || role === ADMIN_ROLE
							? rowActions
							: undefined
					}
					data={filteredUsers}
					switchAction={switchAction}
					activeColumn="isActive"
					toggleActionVisibilityColumn="isLocked"
				/>
			</Grid>

			{/* Dialog de creación de usuario */}
			<UserForm
				open={openCreate}
				user={{}}
				confirmAction={createUser}
				cancelAction={setCloseCreate}
				isCreateForm
			/>
			{/* Dialog de actualización de usuario */}
			{currentUser && (
				<UserForm
					open={openUpdate}
					user={currentUser}
					confirmAction={updateUser}
					cancelAction={handleCloseUpdate}
				/>
			)}

			{/* Dialog de eliminación */}
			{currentUser && (
				<DeleteForm
					handleClose={handleCloseDelete}
					handleConfirm={deleteUser}
					keyword="Usuario"
					open={openDelete}
					propertyToDelete={currentUser.email}
				/>
			)}
		</GridContainer>
	)
}
