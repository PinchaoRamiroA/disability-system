import { useState, useEffect } from 'react'
import {
	getUsers,
	getRoles,
	updateUser,
	changeUserStatus,
	registerUser,
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
	const [createDialogOpen, setCreateDialogOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null)
	const [newRole, setNewRole] = useState<number | ''>('')

	const [newUser, setNewUser] = useState({
		nombre: '',
		correo: '',
		password: '',
		numero_documento: '',
		numero_celular: '',
		direccion: '',
		id_rol: '' as number | '',
	})
	const [creating, setCreating] = useState(false)

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
		setNewRole(user.rol?.id as number | '')
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

	const handleCreateUser = async () => {
		if (!newUser.nombre || !newUser.correo || !newUser.password || !newUser.numero_documento || !newUser.id_rol) {
			showError('Por favor complete todos los campos requeridos')
			return
		}
		setCreating(true)
		try {
			await registerUser({
				nombre: newUser.nombre,
				correo: newUser.correo,
				password: newUser.password,
				numero_documento: newUser.numero_documento,
				numero_celular: newUser.numero_celular,
				direccion: newUser.direccion,
				id_rol: Number(newUser.id_rol),
			})
			showSuccess('Usuario creado correctamente')
			setCreateDialogOpen(false)
			setNewUser({
				nombre: '',
				correo: '',
				password: '',
				numero_documento: '',
				numero_celular: '',
				direccion: '',
				id_rol: '',
			})
			fetchUsers()
		} catch (error) {
			showError('Error al crear usuario')
		} finally {
			setCreating(false)
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
			<Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => setCreateDialogOpen(true)}
				>
					Crear Usuario
				</Button>
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
						{users.map((user, idx) => (
							<TableRow key={user.id ?? `user-${idx}`}>
								<TableCell>{user.nombre}</TableCell>
								<TableCell>{user.correo}</TableCell>
								<TableCell>{user.numero_documento}</TableCell>
								<TableCell>
									<Chip
										label={user.nombre_rol || '-'}
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

			<Dialog
				open={createDialogOpen}
				onClose={() => setCreateDialogOpen(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Crear Nuevo Usuario</DialogTitle>
				<DialogContent>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
						<TextField
							label="Nombre completo"
							value={newUser.nombre}
							onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
							fullWidth
							required
						/>
						<TextField
							label="Correo"
							type="email"
							value={newUser.correo}
							onChange={(e) => setNewUser({ ...newUser, correo: e.target.value })}
							fullWidth
							required
						/>
						<TextField
							label="Número de documento"
							value={newUser.numero_documento}
							onChange={(e) => setNewUser({ ...newUser, numero_documento: e.target.value })}
							fullWidth
							required
						/>
						<TextField
							label="Número de celular"
							value={newUser.numero_celular}
							onChange={(e) => setNewUser({ ...newUser, numero_celular: e.target.value })}
							fullWidth
						/>
						<TextField
							label="Dirección"
							value={newUser.direccion}
							onChange={(e) => setNewUser({ ...newUser, direccion: e.target.value })}
							fullWidth
						/>
						<TextField
							label="Contraseña"
							type="password"
							value={newUser.password}
							onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
							fullWidth
							required
						/>
						<FormControl fullWidth required>
							<InputLabel>Rol</InputLabel>
							<Select
								value={newUser.id_rol}
								label="Rol"
								onChange={(e) => setNewUser({ ...newUser, id_rol: e.target.value as number })}
							>
								{roles.map((rol) => (
									<MenuItem key={rol.id_rol} value={rol.id_rol}>
										{rol.nombre}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setCreateDialogOpen(false)} disabled={creating}>
						Cancelar
					</Button>
					<Button
						onClick={handleCreateUser}
						variant="contained"
						disabled={creating}
					>
						{creating ? 'Creando...' : 'Crear'}
					</Button>
				</DialogActions>
			</Dialog>
		</PageLayout>
	)
}