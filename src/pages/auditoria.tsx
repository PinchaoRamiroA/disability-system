import { useState, useEffect } from 'react'
import {
	Box,
	Typography,
	Card,
	CardContent,
	Grid,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
	Chip,
	Stack,
	IconButton,
	Tooltip,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import HistoryIcon from '@mui/icons-material/History'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useRouter } from 'next/router'
import {
	getAuditoria,
	getAuditoriaByIncapacidad,
	TIPO_ACCIONES,
	MODULOS,
	AuditoriaEntry,
	AuditoriaFilters,
} from '@/services/api/auditoria'
import { getUsers } from '@/services/api/usuarios'
import { getIncapacidades } from '@/services/api/incapacidades'
import { HistorialIncapacidad } from '@/types/api'
import { AuthUser, Incapacidad } from '@/types/api'
import { usePermission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'
import { PageLayout } from '@/components/layouts/PageLayout'
import { Table } from '@/components/Table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const TIPO_ACCION_COLORS: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
	crear: 'success',
	actualizar: 'primary',
	eliminar: 'error',
	cambiar_estado: 'warning',
	validar: 'success',
	rechazar: 'error',
	subir_documento: 'default',
	transcribir: 'primary',
	registrar_pago: 'warning',
	conciliar: 'success',
}

interface TimelineItem {
	id: string
	tipo_accion: string
	modulo: string
	descripcion: string
	usuario_nombre?: string
	created_at: string
	details?: string
}

const TimelineItemComponent = ({ item }: { item: TimelineItem }) => {
	const color = TIPO_ACCION_COLORS[item.tipo_accion] || 'default'
	const accion = TIPO_ACCIONES.find((a) => a.value === item.tipo_accion)

	return (
		<Box sx={{ display: 'flex', mb: 3 }}>
			<Box
				sx={{
					minWidth: 40,
					height: 40,
					borderRadius: '50%',
					backgroundColor: `${color}.main`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: 'white',
					mr: 2,
					fontSize: 12,
					fontWeight: 'bold',
				}}
			>
				{item.tipo_accion?.charAt(0).toUpperCase()}
			</Box>
			<Box sx={{ flex: 1 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
					<Chip label={accion?.label || item.tipo_accion} size="small" color={color} />
					<Chip label={item.modulo} size="small" variant="outlined" />
				</Box>
				<Typography variant="body2">{item.descripcion}</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
					{item.usuario_nombre && (
						<Typography variant="caption" color="text.secondary">
							{item.usuario_nombre}
						</Typography>
					)}
					<Typography variant="caption" color="text.secondary">
						• {dayjs(item.created_at).format('DD/MM/YYYY HH:mm')} ({dayjs(item.created_at).fromNow()})
					</Typography>
				</Box>
				{item.details && (
					<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
						{item.details}
					</Typography>
				)}
			</Box>
		</Box>
	)
}

export default function AuditoriaPage() {
	const router = useRouter()
	const { enqueueSnackbar } = useNotifier()
	const { hasPermission } = usePermission()
	const showError = (msg: string) => enqueueSnackbar(msg, { variant: 'error' })

	const [loading, setLoading] = useState(false)
	const [loadingTimeline, setLoadingTimeline] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')

	const [idUsuario, setIdUsuario] = useState<number | ''>('')
	const [idIncapacidad, setIdIncapacidad] = useState<number | ''>('')
	const [tipoAccion, setTipoAccion] = useState('')
	const [modulo, setModulo] = useState('')
	const [fechaInicio, setFechaInicio] = useState('')
	const [fechaFin, setFechaFin] = useState('')

	const [usuarios, setUsuarios] = useState<AuthUser[]>([])
	const [incapacidades, setIncapacidades] = useState<Incapacidad[]>([])

	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [totalItems, setTotalItems] = useState(0)

	const [auditoriaEntries, setAuditoriaEntries] = useState<AuditoriaEntry[]>([])
	const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])

	const canViewAudit = hasPermission('consultar_historial') || hasPermission('gestionar_usuarios')

	useEffect(() => {
		if (canViewAudit) {
			loadFiltersData()
			loadAuditoria()
		}
	}, [canViewAudit, page])

	const loadFiltersData = async () => {
		try {
			const [usersRes, incRes] = await Promise.all([
				getUsers({ limit: 100 }),
				getIncapacidades({ limit: 100 }),
			])
			setUsuarios(usersRes.data.data?.items || [])
			setIncapacidades(incRes.data.data?.items || [])
		} catch {
		}
	}

	const loadAuditoria = async () => {
		setLoading(true)
		try {
			const filters: AuditoriaFilters = {
				page,
				limit: 20,
			}
			if (idUsuario) filters.id_usuario = idUsuario as number
			if (idIncapacidad) filters.id_incapacidad = idIncapacidad as number
			if (tipoAccion) filters.tipo_accion = tipoAccion
			if (modulo) filters.modulo = modulo
			if (fechaInicio) filters.fecha_inicio = fechaInicio
			if (fechaFin) filters.fecha_fin = fechaFin

			const res = await getAuditoria(filters)
			setAuditoriaEntries(res.data.data?.items || [])
			setTotalPages(res.data.data?.total_pages || 1)
			setTotalItems(res.data.data?.total || 0)

			const timeline: TimelineItem[] = (res.data.data?.items || []).map((entry) => ({
				id: entry.id_auditoria.toString(),
				tipo_accion: entry.tipo_accion,
				modulo: entry.modulo,
				descripcion: entry.descripcion,
				usuario_nombre: entry.usuario_nombre,
				created_at: entry.created_at,
				details: entry.cambio_anterior && entry.cambio_nuevo
					? `${entry.cambio_anterior} → ${entry.cambio_nuevo}`
					: undefined,
			}))
			setTimelineItems(timeline)
		} catch (error) {
			showError('Error al cargar auditoría')
		} finally {
			setLoading(false)
		}
	}

	const handleSearch = () => {
		setPage(1)
		loadAuditoria()
	}

	const handleClearFilters = () => {
		setIdUsuario('')
		setIdIncapacidad('')
		setTipoAccion('')
		setModulo('')
		setFechaInicio('')
		setFechaFin('')
		setPage(1)
		loadAuditoria()
	}

	const handleVerDetalle = (idIncapacidad: number) => {
		router.push(`/incapacidades/${idIncapacidad}`)
	}

	const columns = [
		{ id: 'id_auditoria', label: 'ID', width: 60 },
		{
			id: 'tipo_accion',
			label: 'Acción',
			width: 120,
			render: (row: AuditoriaEntry) => {
				const color = TIPO_ACCION_COLORS[row.tipo_accion] || 'default'
				const accion = TIPO_ACCIONES.find((a) => a.value === row.tipo_accion)
				return <Chip label={accion?.label || row.tipo_accion} size="small" color={color} />
			},
		},
		{ id: 'modulo', label: 'Módulo', width: 120 },
		{ id: 'descripcion', label: 'Descripción', minWidth: 200 },
		{ id: 'usuario_nombre', label: 'Usuario', width: 150 },
		{ id: 'created_at', label: 'Fecha', width: 160, render: (row: AuditoriaEntry) => dayjs(row.created_at).format('DD/MM/YYYY HH:mm') },
		{
			id: 'acciones',
			label: '',
			width: 60,
			render: (row: AuditoriaEntry) =>
				row.id_incapacidad ? (
					<Tooltip title="Ver incapacidad">
						<IconButton size="small" onClick={() => row.id_incapacidad && handleVerDetalle(row.id_incapacidad)}>
							<VisibilityIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				) : null,
		},
	]

	if (!canViewAudit) {
		return (
			<PageLayout title="Auditoría">
				<Typography color="error">No tiene permisos para ver auditoría</Typography>
			</PageLayout>
		)
	}

	return (
		<PageLayout title="Auditoría del Sistema">
			<Box sx={{ mb: 3 }}>
				<Stack direction="row" spacing={2} alignItems="center">
					<TextField
						size="small"
						placeholder="Buscar en descripción..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						InputProps={{ startAdornment: <SearchIcon color="action" /> }}
						sx={{ minWidth: 300 }}
					/>
					<Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}>
						Buscar
					</Button>
				</Stack>
			</Box>

			<Accordion defaultExpanded>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<FilterListIcon />
						<Typography>Filtros</Typography>
					</Box>
				</AccordionSummary>
				<AccordionDetails>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								select
								label="Usuario"
								value={idUsuario}
								onChange={(e) => {
									const val = e.target.value
									setIdUsuario(val === '' ? '' : Number(val))
								}}
								fullWidth
								size="small"
							>
								<MenuItem key="all" value="">Todos</MenuItem>
								{usuarios.map((u, idx) => (
									<MenuItem key={`user-${u.id ?? idx}`} value={u.id}>
										{u.nombre}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								select
								label="Tipo de Acción"
								value={tipoAccion}
								onChange={(e) => setTipoAccion(e.target.value)}
								fullWidth
								size="small"
							>
								<MenuItem key="all-tipos" value="">Todas</MenuItem>
								{TIPO_ACCIONES.map((a) => (
									<MenuItem key={a.value} value={a.value}>
										{a.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								select
								label="Módulo"
								value={modulo}
								onChange={(e) => setModulo(e.target.value)}
								fullWidth
								size="small"
							>
								<MenuItem key="all-modulos" value="">Todos</MenuItem>
								{MODULOS.map((m) => (
									<MenuItem key={m.value} value={m.value}>
										{m.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="Fecha Inicio"
								type="date"
								value={fechaInicio}
								onChange={(e) => setFechaInicio(e.target.value)}
								fullWidth
								size="small"
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="Fecha Fin"
								type="date"
								value={fechaFin}
								onChange={(e) => setFechaFin(e.target.value)}
								fullWidth
								size="small"
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>
						<Grid item xs={12}>
							<Stack direction="row" spacing={1}>
								<Button variant="contained" onClick={handleSearch}>
									Aplicar Filtros
								</Button>
								<Button variant="outlined" onClick={handleClearFilters}>
									Limpiar
								</Button>
							</Stack>
						</Grid>
					</Grid>
				</AccordionDetails>
			</Accordion>

			<Card sx={{ mt: 3 }}>
				<CardContent>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
						<Typography variant="h6">
							<HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
							Historial de Acciones
						</Typography>
						<Chip label={`${totalItems} registros`} color="primary" size="small" />
					</Box>

					<Table
						columns={columns}
						data={auditoriaEntries as any[]}
						loading={loading}
						emptyMessage="No hay registros de auditoría"
						pagination={{ page, totalPages, onPageChange: setPage }}
					/>
				</CardContent>
			</Card>

			{timelineItems.length > 0 && (
				<Card sx={{ mt: 3 }}>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							Línea de Tiempo
						</Typography>
						<Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
							{timelineItems.map((item) => (
								<TimelineItemComponent key={item.id} item={item} />
							))}
						</Box>
					</CardContent>
				</Card>
			)}
		</PageLayout>
	)
}