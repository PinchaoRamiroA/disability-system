import { useState, useEffect } from 'react'
import {
	Box,
	Typography,
	Stack,
	Chip,
	Card,
	CardContent,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import {
	getIncapacidades,
	getIncapacidadPlazos,
	transcribirIncapacidad,
} from '@/services/api/incapacidades'
import { Incapacidad, PlazosIncapacidad } from '@/types/api'
import { usePermission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'
import { PageLayout } from '@/components/layouts/PageLayout'
import dayjs from 'dayjs'

const ESTADO_TRANSCRIPCION_COLORS = {
	pendiente: 'error',
	en_proceso: 'warning',
	completado: 'success',
	vencida: 'error',
}

export default function TranscripcionPage() {
	const { hasPermission } = usePermission()
	const { enqueueSnackbar } = useNotifier()
	const showError = (msg: string) => enqueueSnackbar(msg, { variant: 'error' })
	const showSuccess = (msg: string) => enqueueSnackbar(msg, { variant: 'success' })

	const [incapacidades, setIncapacidades] = useState<Incapacidad[]>([])
	const [loading, setLoading] = useState(false)
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [plazosData, setPlazosData] = useState<Record<number, PlazosIncapacidad>>({})
	const [dialogOpen, setDialogOpen] = useState(false)
	const [selectedIncapacidad, setSelectedIncapacidad] = useState<Incapacidad | null>(null)
	const [numeroRadicado, setNumeroRadicado] = useState('')
	const [observaciones, setObservaciones] = useState('')
	const [submitting, setSubmitting] = useState(false)

	const canTranscribe =
		hasPermission('crear_incapacidad') ||
		hasPermission('editar_incapacidad')

	useEffect(() => {
		if (canTranscribe) {
			loadIncapacidades()
		}
	}, [page])

	const loadIncapacidades = async () => {
		setLoading(true)
		try {
			const response = await getIncapacidades({ page, limit: 20 })
			setIncapacidades(response.data.data.items)
			setTotalPages(response.data.data.total_pages)

			const plazosPromises = response.data.data.items.map(async (inc) => {
				try {
					const plazosRes = await getIncapacidadPlazos(inc.id_incapacidad)
					return { id: inc.id_incapacidad, plazos: plazosRes.data.data }
				} catch {
					return { id: inc.id_incapacidad, plazos: null }
				}
			})

			const plazosResults = await Promise.all(plazosPromises)
			const plazosMap: Record<number, PlazosIncapacidad> = {}
			plazosResults.forEach((p) => {
				if (p.plazos) plazosMap[p.id] = p.plazos
			})
			setPlazosData(plazosMap)
		} catch {
			showError('Error al cargar incapacidades')
		} finally {
			setLoading(false)
		}
	}

	const getSemaforoColor = (diasRestantes: number | null | undefined) => {
		if (diasRestantes === null || diasRestantes === undefined) return 'default'
		if (diasRestantes < 0) return 'error'
		if (diasRestantes <= 3) return 'warning'
		return 'success'
	}

	const getSemaforoLabel = (diasRestantes: number | null | undefined) => {
		if (diasRestantes === null || diasRestantes === undefined) return 'Sin datos'
		if (diasRestantes < 0) return `Vencido (${Math.abs(diasRestantes)} días)`
		if (diasRestantes === 0) return 'Vence hoy'
		return `${diasRestantes} días`
	}

	const pendientes = incapacidades.filter((inc) => {
		const plazos = plazosData[inc.id_incapacidad]
		return plazos && plazos.transcripcion_vencida
	})

	const enProceso = incapacidades.filter((inc) => {
		const plazos = plazosData[inc.id_incapacidad]
		return plazos && !plazos.transcripcion_vencida && plazos.dias_restantes_transcripcion !== null
	})

	const completadas = incapacidades.filter((inc) => {
		const plazos = plazosData[inc.id_incapacidad]
		return !plazos || plazos.dias_restantes_transcripcion === null
	})

	const handleOpenTranscribir = (incapacidad: Incapacidad) => {
		setSelectedIncapacidad(incapacidad)
		setNumeroRadicado('')
		setObservaciones('')
		setDialogOpen(true)
	}

	const handleTranscribir = async () => {
		if (!selectedIncapacidad) return

		setSubmitting(true)
		try {
			await transcribirIncapacidad(selectedIncapacidad.id_incapacidad, {
				fecha_transcripcion: dayjs().format('YYYY-MM-DD'),
				numero_radicado: numeroRadicado,
				observaciones: observaciones || undefined,
			})

			showSuccess('Transcripción registrada exitosamente')
			setDialogOpen(false)
			loadIncapacidades()
		} catch {
			showError('Error al registrar transcripción')
		} finally {
			setSubmitting(false)
		}
	}

	if (!canTranscribe) {
		return (
			<PageLayout title="Transcripción EPS/ARL">
				<Typography color="error">
					No tiene permisos para acceder a esta sección
				</Typography>
			</PageLayout>
		)
	}

	return (
		<PageLayout title="Transcripción EPS/ARL">
			<Box sx={{ mb: 3 }}>
				<Stack direction="row" spacing={2}>
					<Chip
						label={`Vencidas: ${pendientes.length}`}
						color="error"
					/>
					<Chip
						label={`En proceso: ${enProceso.length}`}
						color="warning"
					/>
					<Chip
						label={`Completadas: ${completadas.length}`}
						color="success"
					/>
				</Stack>
			</Box>

			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h6" color="error" gutterBottom>
						Incapacidades con Transcripción Vencida
					</Typography>
					{pendientes.length === 0 ? (
						<Typography variant="body2" color="text.secondary">
							No hay transcripciones vencidas
						</Typography>
					) : (
						<Box sx={{ overflowX: 'auto' }}>
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell>ID</TableCell>
										<TableCell>Título</TableCell>
										<TableCell>Entidad</TableCell>
										<TableCell>Fecha Inicio</TableCell>
										<TableCell>Días Vencidos</TableCell>
										<TableCell>Acciones</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{pendientes.map((inc) => {
										const plazos = plazosData[inc.id_incapacidad]
										return (
											<TableRow key={inc.id_incapacidad}>
												<TableCell>{inc.id_incapacidad}</TableCell>
												<TableCell>{inc.titulo}</TableCell>
												<TableCell>{inc.entidad?.nombre}</TableCell>
												<TableCell>
													{dayjs(inc.fecha_inicio).format('DD/MM/YYYY')}
												</TableCell>
												<TableCell>
													<Chip
														label={`${Math.abs(plazos?.dias_restantes_transcripcion || 0)} días`}
														size="small"
														color="error"
													/>
												</TableCell>
												<TableCell>
													<Button
														size="small"
														variant="contained"
														color="error"
														onClick={() => handleOpenTranscribir(inc)}
													>
														Transcribir
													</Button>
												</TableCell>
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						</Box>
					)}
				</CardContent>
			</Card>

			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h6" color="warning" gutterBottom>
						Por Transcribir (En Proceso)
					</Typography>
					{enProceso.length === 0 ? (
						<Typography variant="body2" color="text.secondary">
							No hay incapacidades en proceso
						</Typography>
					) : (
						<Box sx={{ overflowX: 'auto' }}>
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell>ID</TableCell>
										<TableCell>Título</TableCell>
										<TableCell>Entidad</TableCell>
										<TableCell>Fecha Límite</TableCell>
										<TableCell>Días Restantes</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{enProceso.map((inc) => {
										const plazos = plazosData[inc.id_incapacidad]
										return (
											<TableRow key={inc.id_incapacidad}>
												<TableCell>{inc.id_incapacidad}</TableCell>
												<TableCell>{inc.titulo}</TableCell>
												<TableCell>{inc.entidad?.nombre}</TableCell>
												<TableCell>
													{plazos?.fecha_limite_transcripcion
														? dayjs(plazos.fecha_limite_transcripcion).format('DD/MM/YYYY')
														: '-'}
												</TableCell>
												<TableCell>
													<Chip
														label={getSemaforoLabel(plazos?.dias_restantes_transcripcion)}
														size="small"
														color={getSemaforoColor(plazos?.dias_restantes_transcripcion)}
													/>
												</TableCell>
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						</Box>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardContent>
					<Typography variant="h6" color="success" gutterBottom>
						Transcripciones Completadas
					</Typography>
					{loading ? (
						<Typography>Cargando...</Typography>
					) : completadas.length === 0 ? (
						<Typography variant="body2" color="text.secondary">
							No hay transcripciones completadas
						</Typography>
					) : (
						<Box sx={{ overflowX: 'auto' }}>
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell>ID</TableCell>
										<TableCell>Título</TableCell>
										<TableCell>Entidad</TableCell>
										<TableCell>Fecha Inicio</TableCell>
										<TableCell>Fecha Fin</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{completadas.map((inc) => (
										<TableRow key={inc.id_incapacidad}>
											<TableCell>{inc.id_incapacidad}</TableCell>
											<TableCell>{inc.titulo}</TableCell>
											<TableCell>{inc.entidad?.nombre}</TableCell>
											<TableCell>
												{dayjs(inc.fecha_inicio).format('DD/MM/YYYY')}
											</TableCell>
											<TableCell>
												{dayjs(inc.fecha_fin).format('DD/MM/YYYY')}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					)}
				</CardContent>
			</Card>

			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
				<DialogTitle>Registrar Transcripción</DialogTitle>
				<DialogContent>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
						Incapacidad: {selectedIncapacidad?.titulo}
					</Typography>
					<TextField
						fullWidth
						label="Número de Radicado"
						value={numeroRadicado}
						onChange={(e) => setNumeroRadicado(e.target.value)}
						sx={{ mb: 2 }}
						required
					/>
					<TextField
						fullWidth
						label="Observaciones"
						value={observaciones}
						onChange={(e) => setObservaciones(e.target.value)}
						multiline
						rows={3}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={handleTranscribir}
						disabled={submitting || !numeroRadicado}
					>
						{submitting ? 'Guardando...' : 'Registrar'}
					</Button>
				</DialogActions>
			</Dialog>
		</PageLayout>
	)
}