import { useState, useEffect } from 'react'
import {
	Box,
	Typography,
	Card,
	CardContent,
	Grid,
	Tabs,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Chip,
	TextField,
	InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import {
	getEntidades,
	getEstadosIncapacidad,
	getTiposIncapacidad,
} from '@/services/api/incapacidades'
import { getTiposDocumento, getEstadosDocumento, getTiposPago } from '@/services/api/catalogos'
import { TipoDocumento, EstadoDocumento, TipoPago } from '@/services/api/catalogos'
import { Entidad, EstadoIncapacidad, TipoIncapacidad } from '@/types/api'
import { usePermission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'
import { PageLayout } from '@/components/layouts/PageLayout'
import SettingsIcon from '@mui/icons-material/Settings'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Table as MuiTable } from '@/components/Table'

interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
	return (
		<div role="tabpanel" hidden={value !== index}>
			{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
		</div>
	)
}

const CANALES_RECEPCION = [
	{ id: 'correo', label: 'Correo electrónico' },
	{ id: 'fisico', label: 'Documento físico' },
	{ id: 'digital', label: 'Portal digital' },
	{ id: 'whatsapp', label: 'WhatsApp' },
	{ id: 'sistema', label: 'Sistema interno' },
]

const ORIGENES_INCAPACIDAD = [
	{ id: 'enfermedad_general', label: 'Enfermedad General' },
	{ id: 'accidente_laboral', label: 'Accidente Laboral' },
	{ id: 'enfermedad_laboral', label: 'Enfermedad Laboral' },
	{ id: 'licencia_maternidad', label: 'Licencia Maternidad' },
	{ id: 'licencia_paternidad', label: 'Licencia Paternidad' },
]

export default function ConfiguracionPage() {
	const { enqueueSnackbar } = useNotifier()
	const { hasPermission } = usePermission()
	const showError = (msg: string) => enqueueSnackbar(msg, { variant: 'error' })

	const [tabValue, setTabValue] = useState(0)
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState('')

	const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([])
	const [estadosDocumento, setEstadosDocumento] = useState<EstadoDocumento[]>([])
	const [tiposPago, setTiposPago] = useState<TipoPago[]>([])
	const [entidades, setEntidades] = useState<Entidad[]>([])
	const [estados, setEstados] = useState<EstadoIncapacidad[]>([])
	const [tipos, setTipos] = useState<TipoIncapacidad[]>([])

	const [diasAlertaVencimiento, setDiasAlertaVencimiento] = useState('5')
	const [diasAlertaTranscripcion, setDiasAlertaTranscripcion] = useState('3')
	const [correoNotificacion, setCorreoNotificacion] = useState('')
	const [emailDestinatarios, setEmailDestinatarios] = useState('')

	const canManageConfig = hasPermission('gestionar_usuarios')

	useEffect(() => {
		if (canManageConfig) {
			loadCatalogos()
		}
	}, [canManageConfig])

	const loadCatalogos = async () => {
		setLoading(true)
		try {
			const [tipDoc, estDoc, tipPag, ent, est, tip] = await Promise.all([
				getTiposDocumento(),
				getEstadosDocumento(),
				getTiposPago(),
				getEntidades(),
				getEstadosIncapacidad(),
				getTiposIncapacidad(),
			])
			setTiposDocumento(tipDoc.data.data || [])
			setEstadosDocumento(estDoc.data.data || [])
			setTiposPago(tipPag.data.data || [])
			setEntidades(ent.data.data || [])
			setEstados(est.data.data || [])
			setTipos(tip.data.data || [])
		} catch (error) {
			showError('Error al cargar catálogos')
		} finally {
			setLoading(false)
		}
	}

	const getFilteredTiposDocumento = () => {
		if (!search) return tiposDocumento
		return tiposDocumento.filter(
			(t) =>
				t.nombre.toLowerCase().includes(search.toLowerCase()) ||
				t.descripcion?.toLowerCase().includes(search.toLowerCase())
		)
	}

	const getFilteredEstadosDocumento = () => {
		if (!search) return estadosDocumento
		return estadosDocumento.filter(
			(e) =>
				e.nombre.toLowerCase().includes(search.toLowerCase()) ||
				e.descripcion?.toLowerCase().includes(search.toLowerCase())
		)
	}

	const getFilteredTiposPago = () => {
		if (!search) return tiposPago
		return tiposPago.filter(
			(t) =>
				t.nombre.toLowerCase().includes(search.toLowerCase()) ||
				t.descripcion?.toLowerCase().includes(search.toLowerCase())
		)
	}

	const getFilteredEntidades = () => {
		if (!search) return entidades
		return entidades.filter((e) =>
			e.nombre.toLowerCase().includes(search.toLowerCase())
		)
	}

	if (!canManageConfig) {
		return (
			<PageLayout title="Configuración">
				<Typography color="error">No tiene permisos para gestionar configuración</Typography>
			</PageLayout>
		)
	}

	return (
		<PageLayout title="Configuración del Sistema">
			<Card sx={{ mb: 3 }}>
				<CardContent>
					<TextField
						size="small"
						placeholder="Buscar en catálogos..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
						sx={{ minWidth: 300 }}
					/>
				</CardContent>
			</Card>

			<Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
				<Tab label="Tipos de Documento" />
				<Tab label="Estados de Documento" />
				<Tab label="Tipos de Pago" />
				<Tab label="Estados Incapacidad" />
				<Tab label="Entidades" />
				<Tab label="Canales" />
				<Tab label="Alertas" />
			</Tabs>

			<TabPanel value={tabValue} index={0}>
				<Card>
					<CardContent>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
							<Typography variant="h6">Tipos de Documento</Typography>
							<Chip label={`${tiposDocumento.length} registros`} color="primary" size="small" />
						</Box>
						<TableContainer>
							<MuiTable
								columns={[
									{ id: 'id_tipo_documento', label: 'ID', width: 80 },
									{ id: 'nombre', label: 'Nombre', minWidth: 200 },
									{ id: 'descripcion', label: 'Descripción', minWidth: 250 },
									{
										id: 'requerido',
										label: 'Requerido',
										width: 100,
										render: (row: TipoDocumento) => (
											<Chip
												label={row.requerido ? 'Sí' : 'No'}
												color={row.requerido ? 'error' : 'default'}
												size="small"
											/>
										),
									},
								]}
								data={getFilteredTiposDocumento() as any[]}
								loading={loading}
								emptyMessage="No hay tipos de documento"
							/>
						</TableContainer>
					</CardContent>
				</Card>
			</TabPanel>

			<TabPanel value={tabValue} index={1}>
				<Card>
					<CardContent>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
							<Typography variant="h6">Estados de Documento</Typography>
							<Chip label={`${estadosDocumento.length} registros`} color="primary" size="small" />
						</Box>
						<TableContainer>
							<MuiTable
								columns={[
									{ id: 'id_estado_documento', label: 'ID', width: 80 },
									{ id: 'nombre', label: 'Nombre', minWidth: 200 },
									{ id: 'descripcion', label: 'Descripción', minWidth: 250 },
									{
										id: 'color',
										label: 'Color',
										width: 100,
										render: (row: EstadoDocumento) => (
											<Box
												sx={{
													width: 24,
													height: 24,
													borderRadius: '50%',
													backgroundColor: row.color,
													border: '1px solid #ccc',
												}}
											/>
										),
									},
								]}
								data={getFilteredEstadosDocumento() as any[]}
								loading={loading}
								emptyMessage="No hay estados de documento"
							/>
						</TableContainer>
					</CardContent>
				</Card>
			</TabPanel>

			<TabPanel value={tabValue} index={2}>
				<Card>
					<CardContent>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
							<Typography variant="h6">Tipos de Pago</Typography>
							<Chip label={`${tiposPago.length} registros`} color="primary" size="small" />
						</Box>
						<TableContainer>
							<MuiTable
								columns={[
									{ id: 'id_tipo_pago', label: 'ID', width: 80 },
									{ id: 'nombre', label: 'Nombre', minWidth: 200 },
									{ id: 'descripcion', label: 'Descripción', minWidth: 300 },
								]}
								data={getFilteredTiposPago() as any[]}
								loading={loading}
								emptyMessage="No hay tipos de pago"
							/>
						</TableContainer>
					</CardContent>
				</Card>
			</TabPanel>

			<TabPanel value={tabValue} index={3}>
				<Card>
					<CardContent>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
							<Typography variant="h6">Estados de Incapacidad</Typography>
							<Chip label={`${estados.length} registros`} color="primary" size="small" />
						</Box>
						<TableContainer>
							<MuiTable
								columns={[
									{ id: 'id_estado', label: 'ID', width: 80 },
									{ id: 'nombre', label: 'Nombre', minWidth: 200 },
									{ id: 'descripcion', label: 'Descripción', minWidth: 300 },
									{
										id: 'permite_transicion',
										label: 'Permite Transición',
										width: 140,
										render: (row: EstadoIncapacidad) => (
											<Chip
												label={row.permite_transicion ? 'Sí' : 'No'}
												color={row.permite_transicion ? 'success' : 'default'}
												size="small"
											/>
										),
									},
								]}
								data={estados as any[]}
								loading={loading}
								emptyMessage="No hay estados de incapacidad"
							/>
						</TableContainer>
					</CardContent>
				</Card>
			</TabPanel>

			<TabPanel value={tabValue} index={4}>
				<Card>
					<CardContent>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
							<Typography variant="h6">Entidades (EPS/ARL)</Typography>
							<Chip label={`${entidades.length} registros`} color="primary" size="small" />
						</Box>
						<TableContainer>
							<MuiTable
								columns={[
									{ id: 'id_entidad', label: 'ID', width: 80 },
									{ id: 'nombre', label: 'Nombre', minWidth: 250 },
									{ id: 'tipo_entidad', label: 'Tipo', width: 100 },
								]}
								data={getFilteredEntidades() as any[]}
								loading={loading}
								emptyMessage="No hay entidades"
							/>
						</TableContainer>
					</CardContent>
				</Card>
			</TabPanel>

			<TabPanel value={tabValue} index={5}>
				<Card>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							Canales de Recepción
						</Typography>
						<TableContainer>
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell sx={{ fontWeight: 'bold' }}>Canal</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
										<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Estado</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{CANALES_RECEPCION.map((canal) => (
										<TableRow key={canal.id}>
											<TableCell>
												<Typography variant="subtitle2">{canal.label}</Typography>
											</TableCell>
											<TableCell>
												<Typography variant="body2" color="text.secondary">
													{canal.label} - Canal de recepción de incapacidades
												</Typography>
											</TableCell>
											<TableCell sx={{ textAlign: 'center' }}>
												<Chip label="Activo" color="success" size="small" />
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</CardContent>
				</Card>
			</TabPanel>

			<TabPanel value={tabValue} index={6}>
				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<Card>
							<CardContent>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
									<SettingsIcon color="primary" />
									<Typography variant="h6">Configuración de Alertas</Typography>
								</Box>

								<Grid container spacing={2}>
									<Grid item xs={12}>
										<TextField
											label="Días para alerta de vencimiento de pago"
											type="number"
											value={diasAlertaVencimiento}
											onChange={(e) => setDiasAlertaVencimiento(e.target.value)}
											fullWidth
											size="small"
											helperText="Cantidad de días antes del vencimiento para mostrar alerta"
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label="Días para alerta de transcripción pendiente"
											type="number"
											value={diasAlertaTranscripcion}
											onChange={(e) => setDiasAlertaTranscripcion(e.target.value)}
											fullWidth
											size="small"
											helperText="Cantidad de días para mostrar alerta de transcripción pendiente"
										/>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Grid>

					<Grid item xs={12} md={6}>
						<Card>
							<CardContent>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
									<NotificationsIcon color="primary" />
									<Typography variant="h6">Correos de Notificación</Typography>
								</Box>

								<Grid container spacing={2}>
									<Grid item xs={12}>
										<TextField
											label="Correo emisor de notificaciones"
											type="email"
											value={correoNotificacion}
											onChange={(e) => setCorreoNotificacion(e.target.value)}
											fullWidth
											size="small"
											placeholder="notificaciones@empresa.com"
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label="Destinatarios (separados por coma)"
											value={emailDestinatarios}
											onChange={(e) => setEmailDestinatarios(e.target.value)}
											fullWidth
											size="small"
											multiline
											rows={3}
											placeholder="gerencia@empresa.com, rh@empresa.com"
										/>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Grid>

					<Grid item xs={12}>
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Orígenes de Incapacidad
								</Typography>
								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
									{ORIGENES_INCAPACIDAD.map((origen) => (
										<Chip
											key={origen.id}
											label={origen.label}
											color="primary"
											variant="outlined"
										/>
									))}
								</Box>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</TabPanel>
		</PageLayout>
	)
}