import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
	Box,
	Typography,
	Button,
	Card,
	CardContent,
	Chip,
	Grid,
	Tabs,
	Tab,
	Divider,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	MenuItem,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import {
	getIncapacidadById,
	getIncapacidadHistorial,
	getIncapacidadDocumentos,
	getIncapacidadPlazos,
	changeIncapacidadEstado,
	getEstadosIncapacidad,
} from '@/services/api/incapacidades'
import {
	Incapacidad,
	HistorialIncapacidad,
	Documento,
	PlazosIncapacidad,
	EstadoIncapacidad,
} from '@/types/api'
import { usePermission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'
import { PageLayout } from '@/components/layouts/PageLayout'
import { StatusBadge } from '@/components/StatusBadge'
import dayjs from 'dayjs'

interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-${index}`}
			aria-labelledby={`tab-${index}`}
		>
			{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
		</div>
	)
}

const ORIGEN_LABELS: Record<string, string> = {
	enfermedad_general: 'Enfermedad General',
	accidente_laboral: 'Accidente Laboral',
	enfermedad_laboral: 'Enfermedad Laboral',
	licencia_maternidad: 'Licencia Maternidad',
	licencia_paternidad: 'Licencia Paternidad',
}

export default function IncapacidadDetailPage() {
	const router = useRouter()
	const { id } = router.query
	const { hasPermission } = usePermission()
	const { enqueueSnackbar } = useNotifier()

	const [incapacidad, setIncapacidad] = useState<Incapacidad | null>(null)
	const [historial, setHistorial] = useState<HistorialIncapacidad[]>([])
	const [documentos, setDocumentos] = useState<Documento[]>([])
	const [plazos, setPlazos] = useState<PlazosIncapacidad | null>(null)
	const [loading, setLoading] = useState(true)
	const [tabValue, setTabValue] = useState(0)
	const [estados, setEstados] = useState<EstadoIncapacidad[]>([])
	const [estadoDialogOpen, setEstadoDialogOpen] = useState(false)
	const [newEstado, setNewEstado] = useState('')
	const [observacionesEstado, setObservacionesEstado] = useState('')
	const [changingEstado, setChangingEstado] = useState(false)

	const canEdit = hasPermission('editar_incapacidad')
	const canViewHistory = hasPermission('consultar_historial')

	useEffect(() => {
		if (id) {
			loadIncapacidadData()
		}
	}, [id])

const loadIncapacidadData = async () => {
		setLoading(true)
		try {
			const [incRes, histRes, docsRes, plazosRes, estadosRes] = await Promise.all([
				getIncapacidadById(Number(id)),
				canViewHistory
					? getIncapacidadHistorial(Number(id)).catch(() => null)
					: Promise.resolve(null),
				getIncapacidadDocumentos(Number(id)),
				getIncapacidadPlazos(Number(id)).catch(() => null),
				getEstadosIncapacidad().catch(() => null),
			])

			setIncapacidad(incRes.data.data)

			const historialData = histRes?.data?.data
			setHistorial(Array.isArray(historialData) ? historialData : [])

			const docsData = docsRes?.data?.data
			setDocumentos(docsData?.items || [])
			setPlazos(plazosRes?.data?.data || null)
			setEstados(estadosRes?.data?.data || [])
		} catch (error) {
			enqueueSnackbar('Error al cargar incapacidad', { variant: 'error' })
		} finally {
			setLoading(false)
		}
	}

	const handleOpenEstadoDialog = () => {
		setNewEstado('')
		setObservacionesEstado('')
		setEstadoDialogOpen(true)
	}

	const handleCloseEstadoDialog = () => {
		setEstadoDialogOpen(false)
	}

	const handleChangeEstado = async () => {
		if (!newEstado) return
		setChangingEstado(true)
		try {
			const currentEstadoId = incapacidad?.estado?.id_estado
			const estadoActual = estados.find(e => e.id_estado === currentEstadoId)
			const nuevoEstado = estados.find(e => e.id_estado === Number(newEstado))

			await changeIncapacidadEstado(Number(id), {
				id_estado: Number(newEstado),
				observaciones: observacionesEstado || undefined,
			})

			setEstadoDialogOpen(false)
			await loadIncapacidadData()
			enqueueSnackbar(`Estado cambiado a "${nuevoEstado?.nombre || newEstado}"`, {
				variant: 'success',
			})
		} catch (error) {
			enqueueSnackbar('Error al cambiar estado', { variant: 'error' })
		} finally {
			setChangingEstado(false)
		}
	}

	if (loading) {
		return (
			<PageLayout title="Detalle de Incapacidad">
				<Typography>Cargando...</Typography>
			</PageLayout>
		)
	}

	if (!incapacidad) {
		return (
			<PageLayout title="Detalle de Incapacidad">
				<Typography color="error">Incapacidad no encontrada</Typography>
				<Button
					startIcon={<ArrowBackIcon />}
					onClick={() => router.push('/incapacidades')}
					sx={{ mt: 2 }}
				>
					Volver
				</Button>
			</PageLayout>
		)
	}

	return (
		<PageLayout title={`Incapacidad #${incapacidad.id_incapacidad}`}>
			<Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
				<Button
					startIcon={<ArrowBackIcon />}
					onClick={() => router.push('/incapacidades')}
				>
					Volver
				</Button>
				<Box sx={{ display: 'flex', gap: 1 }}>
					{canEdit && (
						<>
							<Button
								startIcon={<SwapHorizIcon />}
								variant="outlined"
								onClick={handleOpenEstadoDialog}
							>
								Cambiar Estado
							</Button>
							<Button
								startIcon={<EditIcon />}
								variant="outlined"
								onClick={() => router.push(`/incapacidades/${id}/editar`)}
							>
								Editar
							</Button>
						</>
					)}
				</Box>
			</Box>

			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={3}>
							<Typography variant="caption" color="text.secondary">
								Estado
							</Typography>
							<Box sx={{ mt: 0.5 }}>
								<StatusBadge status={incapacidad.estado?.nombre || ''} />
							</Box>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<Typography variant="caption" color="text.secondary">
								Tipo
							</Typography>
							<Typography variant="body1" fontWeight={500}>
								{incapacidad.tipo?.nombre}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<Typography variant="caption" color="text.secondary">
								Entidad
							</Typography>
							<Typography variant="body1" fontWeight={500}>
								{incapacidad.entidad?.nombre}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<Typography variant="caption" color="text.secondary">
								Origen
							</Typography>
							<Typography variant="body1" fontWeight={500}>
								{ORIGEN_LABELS[incapacidad.origen] || incapacidad.origen}
							</Typography>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						{incapacidad.titulo}
					</Typography>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6} md={4}>
							<Typography variant="caption" color="text.secondary">
								Fecha de Inicio
							</Typography>
							<Typography variant="body1">
								{dayjs(incapacidad.fecha_inicio).format('DD/MM/YYYY')}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<Typography variant="caption" color="text.secondary">
								Fecha de Fin
							</Typography>
							<Typography variant="body1">
								{dayjs(incapacidad.fecha_fin).format('DD/MM/YYYY')}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<Typography variant="caption" color="text.secondary">
								Días
							</Typography>
							<Typography variant="body1">
								{dayjs(incapacidad.fecha_fin).diff(
									dayjs(incapacidad.fecha_inicio),
									'day'
								) + 1}{' '}
								días
							</Typography>
						</Grid>
						{incapacidad.fecha_radicacion && (
							<Grid item xs={12} sm={6} md={4}>
								<Typography variant="caption" color="text.secondary">
									Fecha de Radicación
								</Typography>
								<Typography variant="body1">
									{dayjs(incapacidad.fecha_radicacion).format(
										'DD/MM/YYYY'
									)}
								</Typography>
							</Grid>
						)}
						{incapacidad.fecha_pago && (
							<Grid item xs={12} sm={6} md={4}>
								<Typography variant="caption" color="text.secondary">
									Fecha de Pago
								</Typography>
								<Typography variant="body1">
									{dayjs(incapacidad.fecha_pago).format('DD/MM/YYYY')}
								</Typography>
							</Grid>
						)}
						<Grid item xs={12} sm={6} md={4}>
							<Typography variant="caption" color="text.secondary">
								Canal de Recepción
							</Typography>
							<Typography variant="body1">
								{incapacidad.canal_recepcion}
							</Typography>
						</Grid>
					</Grid>

					{incapacidad.observaciones && (
						<Box sx={{ mt: 3 }}>
							<Typography variant="caption" color="text.secondary">
								Observaciones
							</Typography>
							<Typography variant="body2" sx={{ mt: 0.5 }}>
								{incapacidad.observaciones}
							</Typography>
						</Box>
					)}
				</CardContent>
			</Card>

			{plazos && (
				<Card sx={{ mb: 3 }}>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							Plazos
						</Typography>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={6} md={4}>
								<Typography variant="caption" color="text.secondary">
									Días Restantes Transcripción
								</Typography>
								<Typography
									variant="h5"
									color={
										(plazos.dias_restantes_transcripcion || 0) < 0
											? 'error'
											: (plazos.dias_restantes_transcripcion || 0) <= 5
											? 'warning'
											: 'success'
									}
								>
									{plazos.dias_restantes_transcripcion ?? '-'}
								</Typography>
							</Grid>
							<Grid item xs={12} sm={6} md={4}>
								<Typography variant="caption" color="text.secondary">
									Días Restantes Pago
								</Typography>
								<Typography
									variant="h5"
									color={
										(plazos.dias_restantes_pago || 0) < 0
											? 'error'
											: (plazos.dias_restantes_pago || 0) <= 5
											? 'warning'
											: 'success'
									}
								>
									{plazos.dias_restantes_pago ?? '-'}
								</Typography>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			)}

			<Card>
				<CardContent sx={{ p: 0 }}>
					<Tabs
						value={tabValue}
						onChange={(_, newValue) => setTabValue(newValue)}
						sx={{ borderBottom: 1, borderColor: 'divider' }}
					>
						<Tab label={`Documentos (${documentos.length})`} />
						<Tab label={`Historial (${historial.length})`} />
					</Tabs>

					<TabPanel value={tabValue} index={0}>
						{documentos.length === 0 ? (
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ p: 2 }}
							>
								No hay documentos registrados
							</Typography>
						) : (
							<Box sx={{ overflowX: 'auto' }}>
								<table style={{ width: '100%', borderCollapse: 'collapse' }}>
									<thead>
										<tr style={{ backgroundColor: '#f5f5f5' }}>
											<th style={{ padding: '12px 16px', textAlign: 'left' }}>
												Tipo
											</th>
											<th style={{ padding: '12px 16px', textAlign: 'left' }}>
												Nombre
											</th>
											<th style={{ padding: '12px 16px', textAlign: 'left' }}>
												Estado
											</th>
											<th style={{ padding: '12px 16px', textAlign: 'left' }}>
												Fecha
											</th>
										</tr>
									</thead>
									<tbody>
										{documentos.map((doc) => (
											<tr key={doc.id_documento} style={{ borderBottom: '1px solid #eee' }}>
												<td style={{ padding: '12px 16px' }}>{doc.tipo}</td>
												<td style={{ padding: '12px 16px' }}>
													{doc.nombre_archivo}
												</td>
												<td style={{ padding: '12px 16px' }}>
													<Chip
														label={doc.estado || 'pendiente'}
														size="small"
														color={
															doc.estado === 'validado'
																? 'success'
																: doc.estado === 'rechazado'
																? 'error'
																: 'default'
														}
													/>
												</td>
												<td style={{ padding: '12px 16px' }}>
													{doc.created_at
														? dayjs(doc.created_at).format('DD/MM/YYYY')
														: '-'}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</Box>
						)}
					</TabPanel>

					<TabPanel value={tabValue} index={1}>
						{historial.length === 0 ? (
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ p: 2 }}
							>
								No hay historial de cambios
							</Typography>
						) : (
							<Box sx={{ p: 2 }}>
								{historial.map((item, index) => (
									<Box key={item.id_historial} sx={{ mb: 2 }}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<Chip
												label={item.estado_nuevo.nombre}
												size="small"
												color="primary"
											/>
											<Typography variant="body2" color="text.secondary">
												{dayjs(item.created_at).format('DD/MM/YYYY HH:mm')}
											</Typography>
											{item.usuario && (
												<Typography variant="body2">
													- {item.usuario.nombre}
												</Typography>
											)}
										</Box>
										{item.observaciones && (
											<Typography variant="body2" sx={{ ml: 2, mt: 0.5 }}>
												{item.observaciones}
											</Typography>
										)}
										{index < historial.length - 1 && <Divider sx={{ mt: 2 }} />}
									</Box>
								))}
							</Box>
						)}
					</TabPanel>
				</CardContent>
			</Card>

			<Dialog
				open={estadoDialogOpen}
				onClose={handleCloseEstadoDialog}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Cambiar Estado de Incapacidad</DialogTitle>
				<DialogContent>
					<Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
						<TextField
							select
							label="Nuevo Estado"
							value={newEstado}
							onChange={(e) => setNewEstado(e.target.value)}
							fullWidth
						>
							{estados
								.filter((e) => e.id_estado !== incapacidad?.estado?.id_estado)
								.map((estado) => (
									<MenuItem
										key={estado.id_estado}
										value={estado.id_estado}
									>
										{estado.nombre}
									</MenuItem>
								))}
						</TextField>
						<TextField
							label="Observaciones (opcional)"
							multiline
							rows={3}
							value={observacionesEstado}
							onChange={(e) => setObservacionesEstado(e.target.value)}
							fullWidth
							placeholder="Registre una razón o nota sobre el cambio de estado"
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseEstadoDialog}>Cancelar</Button>
					<Button
						variant="contained"
						onClick={handleChangeEstado}
						disabled={!newEstado || changingEstado}
					>
						{changingEstado ? 'Guardando...' : 'Confirmar'}
					</Button>
				</DialogActions>
			</Dialog>
		</PageLayout>
	)
}