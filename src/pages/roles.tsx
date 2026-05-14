import { useState, useEffect } from 'react'
import {
	Box,
	Typography,
	Card,
	CardContent,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Chip,
	Checkbox,
	IconButton,
	Tooltip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { getRoles } from '@/services/api/usuarios'
import { usePermission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'
import { PageLayout } from '@/components/layouts/PageLayout'

interface PermisoOpcion {
	id: string
	label: string
}

const MODULOS_PERMISOS: { modulo: string; permisos: PermisoOpcion[] }[] = [
	{
		modulo: 'Incapacidades',
		permisos: [
			{ id: 'crear_incapacidad', label: 'Crear' },
			{ id: 'consultar_incapacidad', label: 'Ver' },
			{ id: 'editar_incapacidad', label: 'Editar' },
			{ id: 'archivar_incapacidad', label: 'Archivar' },
		],
	},
	{
		modulo: 'Documentos',
		permisos: [
			{ id: 'validar_documentos', label: 'Validar' },
			{ id: 'rechazar_documentos', label: 'Rechazar' },
		],
	},
	{
		modulo: 'Transcripción',
		permisos: [
			{ id: 'transcribir_incapacidad', label: 'Transcribir' },
		],
	},
	{
		modulo: 'Cartera y Cobro',
		permisos: [
			{ id: 'registrar_pago', label: 'Registrar Pago' },
			{ id: 'gestionar_cobro_persuasivo', label: 'Cobro Persuasivo' },
			{ id: 'gestionar_cobro_juridico', label: 'Cobro Jurídico' },
			{ id: 'realizar_conciliacion', label: 'Conciliación' },
		],
	},
	{
		modulo: 'Reportes',
		permisos: [
			{ id: 'consultar_reportes', label: 'Ver Reportes' },
			{ id: 'generar_reportes', label: 'Generar Reportes' },
		],
	},
	{
		modulo: 'Alertas',
		permisos: [
			{ id: 'generar_alertas', label: 'Generar Alertas' },
			{ id: 'consultar_alertas', label: 'Ver Alertas' },
		],
	},
	{
		modulo: 'Usuarios',
		permisos: [
			{ id: 'gestionar_usuarios', label: 'Gestionar' },
			{ id: 'gestionar_roles', label: 'Gestionar Roles' },
		],
	},
	{
		modulo: 'Auditoría',
		permisos: [
			{ id: 'consultar_historial', label: 'Ver Historial' },
			{ id: 'consultar_auditoria', label: 'Ver Auditoría' },
		],
	},
]

interface RoleItem {
	id_rol: number
	nombre: string
	permisos: string[]
}

export default function RolesPage() {
	const { enqueueSnackbar } = useNotifier()
	const { hasPermission } = usePermission()
	const showError = (msg: string) => enqueueSnackbar(msg, { variant: 'error' })

	const [loading, setLoading] = useState(true)
	const [roles, setRoles] = useState<RoleItem[]>([])
	const [viewDialogOpen, setViewDialogOpen] = useState(false)
	const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null)

	const canManageRoles = hasPermission('gestionar_roles') || hasPermission('gestionar_usuarios')

	useEffect(() => {
		if (canManageRoles) {
			loadRoles()
		}
	}, [canManageRoles])

	const loadRoles = async () => {
		setLoading(true)
		try {
			const res = await getRoles()
			setRoles(res.data.data?.items || [])
		} catch (error) {
			showError('Error al cargar roles')
		} finally {
			setLoading(false)
		}
	}

	const allPermissions = MODULOS_PERMISOS.flatMap((m) => m.permisos)

	const getPermissionColumns = () => {
		return MODULOS_PERMISOS.flatMap((modulo) =>
			modulo.permisos.map((permiso) => ({
				id: permiso.id,
				label: permiso.label,
				modulo: modulo.modulo,
			}))
		)
	}

	const handleVerRole = (role: RoleItem) => {
		setSelectedRole(role)
		setViewDialogOpen(true)
	}

	const columns = getPermissionColumns()

	if (!canManageRoles) {
		return (
			<PageLayout title="Roles y Permisos">
				<Typography color="error">No tiene permisos para gestionar roles</Typography>
			</PageLayout>
		)
	}

	return (
		<PageLayout title="Roles y Permisos">
			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="body2" color="text.secondary">
						Matriz de permisos por rol. Los permisos se asignan durante la creación o edición del rol.
					</Typography>
				</CardContent>
			</Card>

			<Card>
				<TableContainer>
					<Table size="small">
						<TableHead>
							<TableRow sx={{ backgroundColor: 'primary.main' }}>
								<TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 180 }}>
									Rol
								</TableCell>
								<TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', minWidth: 60 }}>
									#
								</TableCell>
								{columns.map((col) => (
									<TableCell
										key={col.id}
										sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', minWidth: 80 }}
										title={col.modulo}
									>
										{col.label}
									</TableCell>
								))}
								<TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
									Acciones
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={columns.length + 3} align="center">
										Cargando...
									</TableCell>
								</TableRow>
							) : roles.length === 0 ? (
								<TableRow>
									<TableCell colSpan={columns.length + 3} align="center">
										No hay roles configurados
									</TableCell>
								</TableRow>
							) : (
								roles.map((role) => (
									<TableRow key={role.id_rol} hover>
										<TableCell>
											<Typography variant="subtitle2" fontWeight={600}>
												{role.nombre}
											</Typography>
										</TableCell>
										<TableCell sx={{ textAlign: 'center' }}>
											<Chip
												label={role.permisos?.length || 0}
												size="small"
												color="primary"
												variant="outlined"
											/>
										</TableCell>
										{columns.map((col) => {
											const hasPerm = role.permisos?.includes(col.id)
											return (
												<TableCell key={col.id} sx={{ textAlign: 'center' }}>
													<Checkbox
														checked={hasPerm || false}
														disabled
														size="small"
														sx={{
															p: 0,
															'&.Mui-checked': { color: 'success.main' },
														}}
													/>
												</TableCell>
											)
										})}
										<TableCell sx={{ textAlign: 'center' }}>
											<Tooltip title="Ver detalle">
												<IconButton
													size="small"
													onClick={() => handleVerRole(role)}
												>
													<VisibilityIcon fontSize="small" />
												</IconButton>
											</Tooltip>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Card>

			{selectedRole && (
				<Card sx={{ mt: 3 }}>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							Detalle: {selectedRole.nombre}
						</Typography>
						<Typography variant="body2" color="text.secondary" gutterBottom>
							{selectedRole.permisos?.length || 0} permisos asignados
						</Typography>

						<Box sx={{ mt: 2 }}>
							{MODULOS_PERMISOS.map((modulo) => {
								const permisosDelModulo = selectedRole.permisos?.filter((p) =>
									modulo.permisos.some((mp) => mp.id === p)
								)
								if (!permisosDelModulo?.length) return null

								return (
									<Box key={modulo.modulo} sx={{ mb: 2 }}>
										<Typography variant="subtitle2" fontWeight={600} color="primary">
											{modulo.modulo}
										</Typography>
										<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
											{modulo.permisos
												.filter((p) => selectedRole.permisos?.includes(p.id))
												.map((p) => (
													<Chip
														key={p.id}
														label={p.label}
														size="small"
														color="success"
														variant="outlined"
													/>
												))}
										</Box>
									</Box>
								)
							})}
						</Box>

						{!selectedRole.permisos?.length && (
							<Typography variant="body2" color="text.secondary">
								Este rol no tiene permisos asignados
							</Typography>
						)}
					</CardContent>
				</Card>
			)}
		</PageLayout>
	)
}