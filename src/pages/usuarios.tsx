import { useState, useEffect } from 'react'
import {
	getUsers,
	getRoles,
	updateUser,
	changeUserStatus,
	UserFilters,
} from '@/services/api/usuarios'
import { AuthUser, Role } from '@/types/api'
import useNotifier from '@/hooks/useNotifier'
import { usePermission, Permission } from '@/hooks/usePermission'
import {
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	TextField,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Chip,
	Switch,
	FormControlLabel,
	Pagination,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import { PageLayout } from '@/components/layouts/PageLayout'

interface RoleOption {
	id_rol: number
	nombre: string
	permisos: string[]
}

export default function UsuariosPage() {
	const { role, hasPermission } = usePermission()
	const { enqueueSnackbar } = useNotifier()
	const showError = (msg: string) => enqueueSnackbar(msg, { variant: 'error' })
	const showSuccess = (msg: string) => enqueueSnackbar(msg, { variant: 'success' })
	const [users, setUsers] = useState<AuthUser[]>([])
	const [roles, setRoles] = useState<RoleOption[]>([])
	const [loading, setLoading] = useState(false)
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [search, setSearch] = useState('')
	const [editDialogOpen, setEditDialogOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null)
	const [newRole, setNewRole] = useState<number | ''>('')

	const canManageUsers =
		hasPermission('gestionar_usuarios') || hasPermission('gestionar_roles')

	useEffect(() => {
		if (canManageUsers) {
			fetchUsers()
			fetchRoles()
		}
	}, [page, search])

	const fetchUsers = async () => {
		setLoading(true)
		try {
			const response = await getUsers({ page, limit: 10, search })
			setUsers(response.data.data.items)
			setTotalPages(response.data.data.total_pages)
		} catch (error) {
			showError('Error al cargar usuarios')
		} finally {
			setLoading(false)
		}
	}

	const fetchRoles = async () => {
		try {
			const response = await getRoles()
			setRoles(response.data.data.items)
		} catch (error) {
			showError('Error al cargar roles')
		}
	}

	const handleEditClick = (user: AuthUser) => {
		setSelectedUser(user)
		setNewRole(user.rol?.id_rol || '')
		setEditDialogOpen(true)
	}

	const handleSaveRole = async () => {
		if (!selectedUser || newRole === '') return

		try {
			await updateUser(selectedUser.id!, { id_rol: Number(newRole) })
			showSuccess('Rol actualizado correctamente')
			setEditDialogOpen(false)
			fetchUsers()
		} catch (error) {
			showError('Error al actualizar rol')
		}
	}

	const handleToggleStatus = async (user: AuthUser) => {
		try {
			await changeUserStatus(user.id!, !user.estado)
			showSuccess(
				`Usuario ${user.estado ? 'desactivado' : 'activado'} correctamente`
			)
			fetchUsers()
		} catch (error) {
			showError('Error al cambiar estado del usuario')
		}
	}

	if (!canManageUsers) {
		return (
			<PageLayout title="Usuarios">
				<Typography color="error">
					No tiene permisos para acceder a esta sección
				</Typography>
			</PageLayout>
		)
	}

	return (
		<PageLayout title="Gestión de Usuarios">
			<Box sx={{ mb: 3 }}>
				<TextField
					label="Buscar usuario"
					variant="outlined"
					size="small"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					InputProps={{
						endAdornment: <SearchIcon color="action" />,
					}}
					sx={{ mr: 2, width: 300 }}
				/>
			</Box>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Nombre</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Documento</TableCell>
							<TableCell>Rol</TableCell>
							<TableCell>Estado</TableCell>
							<TableCell align="right">Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id}>
								<TableCell>{user.nombre}</TableCell>
								<TableCell>{user.correo}</TableCell>
								<TableCell>{user.numero_documento}</TableCell>
								<TableCell>
									<Chip
										label={user.rol?.nombre || '-'}
										size="small"
										color="primary"
										variant="outlined"
									/>
								</TableCell>
								<TableCell>
									<Chip
										label={user.estado ? 'Activo' : 'Inactivo'}
										size="small"
										color={user.estado ? 'success' : 'error'}
									/>
								</TableCell>
								<TableCell align="right">
									<IconButton
										size="small"
										onClick={() => handleEditClick(user)}
									>
										<EditIcon />
									</IconButton>
									<FormControlLabel
										control={
											<Switch
												checked={user.estado}
												onChange={() => handleToggleStatus(user)}
												size="small"
											/>
										}
										label=""
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
				<Pagination
					count={totalPages}
					page={page}
					onChange={(_, value) => setPage(value)}
					color="primary"
				/>
			</Box>

			<Dialog
				open={editDialogOpen}
				onClose={() => setEditDialogOpen(false)}
			>
				<DialogTitle>Cambiar Rol de Usuario</DialogTitle>
				<DialogContent>
					<Typography sx={{ mb: 2 }}>
						Usuario: {selectedUser?.nombre}
					</Typography>
					<FormControl fullWidth sx={{ mt: 1 }}>
						<InputLabel>Nuevo Rol</InputLabel>
						<Select
							value={newRole}
							label="Nuevo Rol"
							onChange={(e) => setNewRole(e.target.value as number)}
						>
							{roles.map((rol) => (
								<MenuItem key={rol.id_rol} value={rol.id_rol}>
									{rol.nombre}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setEditDialogOpen(false)}>
						Cancelar
					</Button>
					<Button onClick={handleSaveRole} variant="contained">
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
		</PageLayout>
	)
}