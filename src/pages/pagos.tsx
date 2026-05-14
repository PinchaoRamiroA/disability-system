import { useState, useEffect } from 'react'
import {
	Box,
	Typography,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
	Stack,
	Chip,
	Card,
	CardContent,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Grid,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { getPagos } from '@/services/api/cobros'
import { getEntidades } from '@/services/api/incapacidades'
import { Pago, Entidad } from '@/types/api'
import { usePermission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'
import { Table } from '@/components/Table'
import { PageLayout } from '@/components/layouts/PageLayout'
import { useFormik } from 'formik'
import dayjs from 'dayjs'
import SaveIcon from '@mui/icons-material/Save'

const ESTADO_COLORS: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
	pendiente: 'warning',
	conciliado: 'success',
	pagado: 'success',
}

const TIPO_OPTIONS = [
	{ value: 'prima', label: 'Prima' },
	{ value: 'incapacidad', label: 'Incapacidad' },
]

const ESTADO_OPTIONS = [
	{ value: 'pendiente', label: 'Pendiente' },
	{ value: 'conciliado', label: 'Conciliado' },
	{ value: 'pagado', label: 'Pagado' },
]

interface FormValues {
	id_entidad: number | ''
	tipo_pago: string
	estado_pago: string
	valor: string
	fecha_pago: string
	descripcion: string
	periodo_contable: string
}

const validate = (values: FormValues) => {
	const errors: Partial<Record<keyof FormValues, string>> = {}
	if (!values.id_entidad) errors.id_entidad = 'Entidad es requerida' as any
	if (!values.tipo_pago) errors.tipo_pago = 'Tipo de pago es requerido'
	if (!values.estado_pago) errors.estado_pago = 'Estado es requerido'
	if (!values.valor) errors.valor = 'Valor requerido'
	if (!values.fecha_pago) errors.fecha_pago = 'Fecha requerida'
	return errors
}

export default function PagosPage() {
	const { hasPermission } = usePermission()
	const { enqueueSnackbar } = useNotifier()
	const showError = (msg: string) => enqueueSnackbar(msg, { variant: 'error' })
	const showSuccess = (msg: string) => enqueueSnackbar(msg, { variant: 'success' })

	const [pagos, setPagos] = useState<Pago[]>([])
	const [entidades, setEntidades] = useState<Entidad[]>([])
	const [loading, setLoading] = useState(false)
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [totalItems, setTotalItems] = useState(0)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [filters, setFilters] = useState({
		id_entidad: '' as number | '',
		estado_pago: '',
		tipo_pago: '',
	})

	const canRegister = hasPermission('registrar_pago')

	useEffect(() => {
		loadEntidades()
	}, [])

	useEffect(() => {
		loadPagos()
	}, [page, filters])

	const loadEntidades = async () => {
		try {
			const res = await getEntidades()
			setEntidades(res.data.data)
		} catch {
			showError('Error al cargar entidades')
		}
	}

	const loadPagos = async () => {
		setLoading(true)
		try {
			const res = await getPagos({
				id_entidad: filters.id_entidad || undefined,
				estado_pago: filters.estado_pago as any,
				tipo_pago: filters.tipo_pago as any,
				page,
				limit: 10,
			})
			setPagos(res.data.data.items)
			setTotalPages(res.data.data.total_pages)
			setTotalItems(res.data.data.total)
		} catch {
			showError('Error al cargar pagos')
		} finally {
			setLoading(false)
		}
	}

	const handleFilter = (key: string, value: any) => {
		setFilters((prev) => ({ ...prev, [key]: value }))
		setPage(1)
	}

	const columns = [
		{ id: 'id_pago', label: 'ID', width: 80 },
		{ id: 'entidad', label: 'Entidad', render: (row: Pago) => (row as any).nombre_entidad || '-' },
		{ id: 'tipo_pago', label: 'Tipo', render: (row: Pago) => row.tipo_pago },
		{ id: 'valor', label: 'Valor', render: (row: Pago) => `$${parseFloat(row.valor || '0').toLocaleString()}` },
		{ id: 'estado_pago', label: 'Estado', render: (row: Pago) => (
			<Chip label={row.estado_pago} size="small" color={ESTADO_COLORS[row.estado_pago || 'pendiente'] || 'default'} />
		)},
		{ id: 'fecha_pago', label: 'Fecha', render: (row: Pago) => row.fecha_pago ? dayjs(row.fecha_pago).format('DD/MM/YYYY') : '-' },
		{ id: 'conciliado', label: 'Conciliado', render: (row: Pago) => (
			<Chip label={row.conciliado ? 'Sí' : 'No'} size="small" color={row.conciliado ? 'success' : 'default'} />
		)},
	]

	return (
		<PageLayout title="Pagos">
			<Box sx={{ mb: 3 }}>
				<Stack direction="row" spacing={2} alignItems="center">
					<FormControl size="small" sx={{ minWidth: 150 }}>
						<InputLabel>Entidad</InputLabel>
						<Select value={filters.id_entidad} label="Entidad" onChange={(e) => handleFilter('id_entidad', e.target.value || '')}>
							<MenuItem value="">Todas</MenuItem>
							{entidades.map((e) => <MenuItem key={e.id_entidad} value={e.id_entidad}>{e.nombre}</MenuItem>)}
						</Select>
					</FormControl>
					<FormControl size="small" sx={{ minWidth: 150 }}>
						<InputLabel>Estado</InputLabel>
						<Select value={filters.estado_pago} label="Estado" onChange={(e) => handleFilter('estado_pago', e.target.value)}>
							<MenuItem value="">Todos</MenuItem>
							{ESTADO_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
						</Select>
					</FormControl>
					<FormControl size="small" sx={{ minWidth: 150 }}>
						<InputLabel>Tipo</InputLabel>
						<Select value={filters.tipo_pago} label="Tipo" onChange={(e) => handleFilter('tipo_pago', e.target.value)}>
							<MenuItem value="">Todos</MenuItem>
							{TIPO_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
						</Select>
					</FormControl>
					{canRegister && (
						<Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
							Registrar Pago
						</Button>
					)}
				</Stack>
			</Box>

			<Box sx={{ mb: 1 }}>
				<Typography variant="body2" color="text.secondary">Total: {totalItems} pagos</Typography>
			</Box>

			<Table
				columns={columns}
				data={pagos}
				loading={loading}
				emptyMessage="No hay pagos registrados"
				pagination={{ page, totalPages, onPageChange: setPage }}
			/>

			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
				<DialogTitle>Registrar Pago</DialogTitle>
				<DialogContent>
					<CreatePagoForm
						entidades={entidades}
						onSuccess={() => { setDialogOpen(false); loadPagos() }}
						showSuccess={showSuccess}
						showError={showError}
					/>
				</DialogContent>
			</Dialog>
		</PageLayout>
	)
}

interface Props {
	entidades: Entidad[]
	onSuccess: () => void
	showSuccess: (msg: string) => void
	showError: (msg: string) => void
}

function CreatePagoForm({ entidades, onSuccess, showSuccess, showError }: Props) {
	const formik = useFormik<FormValues>({
		initialValues: {
			id_entidad: '',
			tipo_pago: 'prima',
			estado_pago: 'pendiente',
			valor: '',
			fecha_pago: dayjs().format('YYYY-MM-DD'),
			descripcion: '',
			periodo_contable: '',
		},
		validate,
		onSubmit: async (values) => {
			try {
				const { createPago } = await import('@/services/api/cobros')
				await createPago({
					id_entidad: values.id_entidad as number,
					id_incapacidad: 0,
					tipo_pago: values.tipo_pago as any,
					estado_pago: values.estado_pago as any,
					valor: values.valor,
					fecha_pago: values.fecha_pago,
					descripcion: values.descripcion || undefined,
					periodo_contable: values.periodo_contable || undefined,
				})
				showSuccess('Pago registrado')
				formik.resetForm()
				onSuccess()
			} catch {
				showError('Error al registrar pago')
			}
		},
	})

	return (
		<Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<FormControl fullWidth error={formik.touched.id_entidad && Boolean(formik.errors.id_entidad)}>
						<InputLabel>Entidad</InputLabel>
						<Select name="id_entidad" value={formik.values.id_entidad} label="Entidad" onChange={formik.handleChange}>
							{entidades.map((e) => <MenuItem key={e.id_entidad} value={e.id_entidad}>{e.nombre}</MenuItem>)}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField fullWidth name="valor" label="Valor" type="number" value={formik.values.valor} onChange={formik.handleChange}
						error={formik.touched.valor && Boolean(formik.errors.valor)} helperText={formik.touched.valor && formik.errors.valor} />
				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl fullWidth>
						<InputLabel>Tipo</InputLabel>
						<Select name="tipo_pago" value={formik.values.tipo_pago} label="Tipo" onChange={formik.handleChange}>
							{TIPO_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl fullWidth>
						<InputLabel>Estado</InputLabel>
						<Select name="estado_pago" value={formik.values.estado_pago} label="Estado" onChange={formik.handleChange}>
							{ESTADO_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField fullWidth type="date" name="fecha_pago" label="Fecha" value={formik.values.fecha_pago}
						onChange={formik.handleChange} InputLabelProps={{ shrink: true }} />
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField fullWidth name="periodo_contable" label="Período Contable" value={formik.values.periodo_contable} onChange={formik.handleChange} />
				</Grid>
				<Grid item xs={12}>
					<TextField fullWidth name="descripcion" label="Descripción" value={formik.values.descripcion} onChange={formik.handleChange} multiline rows={2} />
				</Grid>
				<Grid item xs={12}>
					<Button type="submit" variant="contained" startIcon={<SaveIcon />}>Guardar</Button>
				</Grid>
			</Grid>
		</Box>
	)
}