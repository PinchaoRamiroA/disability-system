import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
	Box,
	Typography,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
	IconButton,
	Chip,
	Stack,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import {
	getIncapacidades,
	getEstadosIncapacidad,
	getTiposIncapacidad,
	getEntidades,
} from '@/services/api/incapacidades'
import { Incapacidad, EstadoIncapacidad, TipoIncapacidad, Entidad } from '@/types/api'
import { usePermission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'
import { PageLayout } from '@/components/layouts/PageLayout'
import { Table } from '@/components/Table'
import { StatusBadge } from '@/components/StatusBadge'
import { useDebounce } from '@/hooks/useDebounce'
import dayjs from 'dayjs'

interface IncapacidadFilters {
	id_estado?: number
	id_tipo?: number
	id_entidad?: number
	origen?: string
	canal_recepcion?: string
	search?: string
}

const ORIGEN_OPTIONS = [
	{ value: 'enfermedad_general', label: 'Enfermedad General' },
	{ value: 'accidente_laboral', label: 'Accidente Laboral' },
	{ value: 'enfermedad_laboral', label: 'Enfermedad Laboral' },
	{ value: 'licencia_maternidad', label: 'Licencia Maternidad' },
	{ value: 'licencia_paternidad', label: 'Licencia Paternidad' },
]

const CANAL_OPTIONS = [
	{ value: 'email', label: 'Email' },
	{ value: 'presencial', label: 'Presencial' },
	{ value: 'virtual', label: 'Virtual' },
	{ value: 'whatsapp', label: 'WhatsApp' },
]

export default function IncapacidadesPage() {
	const router = useRouter()
	const { hasPermission } = usePermission()
	const { enqueueSnackbar } = useNotifier()
	const showError = (msg: string) => enqueueSnackbar(msg, { variant: 'error' })

	const [incapacidades, setIncapacidades] = useState<Incapacidad[]>([])
	const [loading, setLoading] = useState(false)
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [totalItems, setTotalItems] = useState(0)

	const [estados, setEstados] = useState<EstadoIncapacidad[]>([])
	const [tipos, setTipos] = useState<TipoIncapacidad[]>([])
	const [entidades, setEntidades] = useState<Entidad[]>([])

	const [filters, setFilters] = useState<IncapacidadFilters>({})
	const [searchTerm, setSearchTerm] = useState('')
	const debouncedSearch = useDebounce(searchTerm, 500)

	const canCreate =
		hasPermission('crear_incapacidad') ||
		['Recepcionista', 'Gestión Humana', 'SG-SST'].includes(
			usePermission().role || ''
		)

	useEffect(() => {
		loadCatalogs()
	}, [])

	useEffect(() => {
		loadIncapacidades()
	}, [page, debouncedSearch, filters])

	const loadCatalogs = async () => {
		try {
			const [estadosRes, tiposRes, entidadesRes] = await Promise.all([
				getEstadosIncapacidad(),
				getTiposIncapacidad(),
				getEntidades(),
			])
			setEstados(estadosRes.data.data)
			setTipos(tiposRes.data.data)
			setEntidades(entidadesRes.data.data)
		} catch (error) {
			showError('Error al cargar catálogos')
		}
	}

	const loadIncapacidades = async () => {
		setLoading(true)
		try {
			const response = await getIncapacidades({
				...filters,
				search: debouncedSearch,
				page,
				limit: 10,
			})
			setIncapacidades(response.data.data.items)
			setTotalPages(response.data.data.total_pages)
			setTotalItems(response.data.data.total)
		} catch (error) {
			showError('Error al cargar incapacidades')
		} finally {
			setLoading(false)
		}
	}

	const handleFilterChange = (key: keyof IncapacidadFilters, value: unknown) => {
		setFilters((prev) => ({ ...prev, [key]: value }))
		setPage(1)
	}

	const handleRowClick = (incapacidad: Incapacidad) => {
		router.push(`/incapacidades/${incapacidad.id_incapacidad}`)
	}

	const handleCreate = () => {
		router.push('/incapacidades/crear')
	}

	const columns = [
		{
			id: 'id_incapacidad',
			label: 'ID',
			width: 80,
		},
		{
			id: 'titulo',
			label: 'Título',
			minWidth: 200,
		},
		{
			id: 'tipo',
			label: 'Tipo',
			render: (row: Incapacidad) => row.tipo?.nombre || '-',
		},
		{
			id: 'entidad',
			label: 'Entidad',
			render: (row: Incapacidad) => row.entidad?.nombre || '-',
		},
		{
			id: 'fecha_inicio',
			label: 'Fecha Inicio',
			render: (row: Incapacidad) =>
				dayjs(row.fecha_inicio).format('DD/MM/YYYY'),
		},
		{
			id: 'fecha_fin',
			label: 'Fecha Fin',
			render: (row: Incapacidad) =>
				dayjs(row.fecha_fin).format('DD/MM/YYYY'),
		},
		{
			id: 'estado',
			label: 'Estado',
			render: (row: Incapacidad) =>
				row.estado ? (
					<StatusBadge status={row.estado.nombre} />
				) : (
					'-'
				),
		},
		{
			id: 'origen',
			label: 'Origen',
			render: (row: Incapacidad) => {
				const origen = ORIGEN_OPTIONS.find(
					(o) => o.value === row.origen
				)
				return origen?.label || row.origen
			},
		},
	]

	return (
		<PageLayout title="Incapacidades">
			<Box sx={{ mb: 3 }}>
				<Stack direction="row" spacing={2} alignItems="center">
					<TextField
						label="Buscar"
						size="small"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						InputProps={{
							endAdornment: <SearchIcon color="action" />,
						}}
						sx={{ width: 250 }}
					/>

					<FormControl size="small" sx={{ minWidth: 150 }}>
						<InputLabel>Estado</InputLabel>
						<Select
							value={filters.id_estado || ''}
							label="Estado"
							onChange={(e) =>
								handleFilterChange(
									'id_estado',
									e.target.value || undefined
								)
							}
						>
							<MenuItem value="">Todos</MenuItem>
							{estados.map((estado) => (
								<MenuItem
									key={estado.id_estado}
									value={estado.id_estado}
								>
									{estado.nombre}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl size="small" sx={{ minWidth: 150 }}>
						<InputLabel>Tipo</InputLabel>
						<Select
							value={filters.id_tipo || ''}
							label="Tipo"
							onChange={(e) =>
								handleFilterChange(
									'id_tipo',
									e.target.value || undefined
								)
							}
						>
							<MenuItem value="">Todos</MenuItem>
							{tipos.map((tipo) => (
								<MenuItem
									key={tipo.id_tipo}
									value={tipo.id_tipo}
								>
									{tipo.nombre}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl size="small" sx={{ minWidth: 150 }}>
						<InputLabel>Entidad</InputLabel>
						<Select
							value={filters.id_entidad || ''}
							label="Entidad"
							onChange={(e) =>
								handleFilterChange(
									'id_entidad',
									e.target.value || undefined
								)
							}
						>
							<MenuItem value="">Todas</MenuItem>
							{entidades.map((entidad) => (
								<MenuItem
									key={entidad.id_entidad}
									value={entidad.id_entidad}
								>
									{entidad.nombre}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl size="small" sx={{ minWidth: 150 }}>
						<InputLabel>Origen</InputLabel>
						<Select
							value={filters.origen || ''}
							label="Origen"
							onChange={(e) =>
								handleFilterChange(
									'origen',
									e.target.value || undefined
								)
							}
						>
							<MenuItem value="">Todos</MenuItem>
							{ORIGEN_OPTIONS.map((origen) => (
								<MenuItem
									key={origen.value}
									value={origen.value}
								>
									{origen.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{canCreate && (
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={handleCreate}
						>
							Nueva Incapacidad
						</Button>
					)}
				</Stack>
			</Box>

			<Box sx={{ mb: 1 }}>
				<Typography variant="body2" color="text.secondary">
					Total: {totalItems} incapacidades
				</Typography>
			</Box>

			<Table
				columns={columns}
				data={incapacidades}
				loading={loading}
				onRowClick={handleRowClick}
				emptyMessage="No se encontraron incapacidades"
				pagination={{
					page,
					totalPages,
					onPageChange: setPage,
				}}
			/>
		</PageLayout>
	)
}