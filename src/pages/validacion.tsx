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
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
	getIncapacidades,
	getDocumentosRequeridos,
	validarDocumento,
	getIncapacidadDocumentos,
} from '@/services/api/incapacidades'
import { Incapacidad, Documento } from '@/types/api'
import { usePermission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'
import { PageLayout } from '@/components/layouts/PageLayout'
import { DocumentChecklist } from '@/components/DocumentChecklist'
import { Table } from '@/components/Table'
import dayjs from 'dayjs'

export default function ValidacionDocumentalPage() {
	const { hasPermission } = usePermission()
	const { enqueueSnackbar } = useNotifier()
	const showError = (msg: string) => enqueueSnackbar(msg, { variant: 'error' })
	const showSuccess = (msg: string) => enqueueSnackbar(msg, { variant: 'success' })

	const [incapacidades, setIncapacidades] = useState<Incapacidad[]>([])
	const [loading, setLoading] = useState(false)
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)

	const [selectedIncapacidad, setSelectedIncapacidad] = useState<Incapacidad | null>(null)
	const [documentosRequeridos, setDocumentosRequeridos] = useState<{ id_tipo_documento: number; nombre: string; descripcion: string; requerido: boolean }[]>([])
	const [documentosSubidos, setDocumentosSubidos] = useState<Documento[]>([])
	const [docsLoading, setDocsLoading] = useState(false)
	const [validateDialogOpen, setValidateDialogOpen] = useState(false)
	const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null)
	const [observaciones, setObservaciones] = useState('')
	const [validating, setValidating] = useState(false)

	const canValidate =
		hasPermission('validar_documentos') ||
		hasPermission('rechazar_documentos')

	useEffect(() => {
		if (canValidate) {
			loadIncapacidades()
		}
	}, [page])

	const loadIncapacidades = async () => {
		setLoading(true)
		try {
			const response = await getIncapacidades({ page, limit: 10 })
			setIncapacidades(response.data.data.items)
			setTotalPages(response.data.data.total_pages)
		} catch {
			showError('Error al cargar incapacidades')
		} finally {
			setLoading(false)
		}
	}

	const handleVerDetalle = async (incapacidad: Incapacidad) => {
		setSelectedIncapacidad(incapacidad)
		setDocsLoading(true)
		try {
			const [reqRes, docsRes] = await Promise.all([
				getDocumentosRequeridos(incapacidad.tipo?.id_tipo || 0),
				getIncapacidadDocumentos(incapacidad.id_incapacidad),
			])
			setDocumentosRequeridos(reqRes.data.data || [])
			setDocumentosSubidos(docsRes.data.data.items || [])
		} catch {
			showError('Error al cargar detalle')
		} finally {
			setDocsLoading(false)
		}
	}

	const handleOpenValidate = (doc: Documento) => {
		setSelectedDoc(doc)
		setObservaciones('')
		setValidateDialogOpen(true)
	}

	const handleValidar = async (validado: boolean) => {
		if (!selectedDoc) return

		setValidating(true)
		try {
			await validarDocumento(selectedDoc.id_documento, {
				validado,
				observaciones: observaciones || undefined,
			})
			showSuccess(
				validado
					? 'Documento validado exitosamente'
					: 'Documento rechazado'
			)
			setValidateDialogOpen(false)
			if (selectedIncapacidad) {
				handleVerDetalle(selectedIncapacidad)
			}
		} catch {
			showError('Error al procesar documento')
		} finally {
			setValidating(false)
		}
	}

	const stats = {
		total: incapacidades.length,
		completos: incapacidades.filter((i) => {
			return true
		}).length,
		pendientes: incapacidades.filter((i) => {
			return true
		}).length,
	}

	const columns = [
		{ id: 'id_incapacidad', label: 'ID', width: 80 },
		{ id: 'titulo', label: 'Título', render: (row: Incapacidad) => row.titulo },
		{ id: 'tipo', label: 'Tipo', render: (row: Incapacidad) => row.tipo?.nombre || '-' },
		{ id: 'entidad', label: 'Entidad', render: (row: Incapacidad) => row.entidad?.nombre || '-' },
		{
			id: 'documentos',
			label: 'Docs',
			render: (_: Incapacidad) => (
				<Chip label="Verificar" size="small" color="primary" />
			),
		},
		{ id: 'fecha_inicio', label: 'Fecha', render: (row: Incapacidad) => dayjs(row.fecha_inicio).format('DD/MM/YYYY') },
	]

	if (!canValidate) {
		return (
			<PageLayout title="Validación Documental">
				<Typography color="error">
					No tiene permisos para acceder a esta sección
				</Typography>
			</PageLayout>
		)
	}

	return (
		<PageLayout title="Validación Documental">
			<Box sx={{ mb: 3 }}>
				<Stack direction="row" spacing={2}>
					<Chip label={`Total: ${stats.total}`} />
					<Chip label={`Pendientes: ${stats.pendientes}`} color="warning" />
				</Stack>
			</Box>

			<Table
				columns={columns}
				data={incapacidades}
				loading={loading}
				emptyMessage="No hay incapacidades para validar"
				onRowClick={handleVerDetalle}
				pagination={{ page, totalPages, onPageChange: setPage }}
			/>

			<Dialog
				open={Boolean(selectedIncapacidad)}
				onClose={() => setSelectedIncapacidad(null)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>
					Validación - {selectedIncapacidad?.titulo}
				</DialogTitle>
				<DialogContent>
					{docsLoading ? (
						<Typography>Cargando...</Typography>
					) : (
						<Box sx={{ mt: 2 }}>
							<DocumentChecklist
								tipoIncapacidad={selectedIncapacidad?.tipo?.id_tipo || 0}
								documentosRequeridos={documentosRequeridos}
								documentosSubidos={documentosSubidos}
							/>

						{documentosSubidos.length > 0 && (
								<Box sx={{ mt: 3 }}>
									<Typography variant="h6" gutterBottom>
										Acciones de Validación
									</Typography>
									<Box sx={{ overflowX: 'auto' }}>
										<table style={{ width: '100%', borderCollapse: 'collapse' }}>
											<thead>
												<tr style={{ backgroundColor: '#f5f5f5' }}>
													<th style={{ padding: '8px' }}>Documento</th>
													<th style={{ padding: '8px' }}>Estado</th>
													<th style={{ padding: '8px' }}>Acciones</th>
												</tr>
											</thead>
											<tbody>
												{documentosSubidos.map((doc) => (
													<tr key={doc.id_documento} style={{ borderBottom: '1px solid #eee' }}>
														<td style={{ padding: '8px' }}>{doc.nombre_archivo}</td>
														<td style={{ padding: '8px' }}>
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
														<td style={{ padding: '8px' }}>
															<Stack direction="row" spacing={1}>
																<Button
																	size="small"
																	startIcon={<VisibilityIcon />}
																	onClick={() => window.open(doc.url, '_blank')}
																>
																	Ver
																</Button>
																{doc.estado !== 'validado' && (
																	<Button
																		size="small"
																		color="success"
																		startIcon={<CheckCircleIcon />}
																		onClick={() => {
																			setSelectedDoc(doc)
																			handleValidar(true)
																		}}
																	>
																		Validar
																	</Button>
																)}
																{doc.estado !== 'rechazado' && (
																	<Button
																		size="small"
																		color="error"
																		startIcon={<CancelIcon />}
																		onClick={() => {
																			setSelectedDoc(doc)
																			setValidateDialogOpen(true)
																		}}
																	>
																		Rechazar
																	</Button>
																)}
															</Stack>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</Box>
								</Box>
							)}
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setSelectedIncapacidad(null)}>Cerrar</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={validateDialogOpen} onClose={() => setValidateDialogOpen(false)}>
				<DialogTitle>Rechazar Documento</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						multiline
						rows={3}
						label="Observaciones"
						value={observaciones}
						onChange={(e) => setObservaciones(e.target.value)}
						sx={{ mt: 2 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setValidateDialogOpen(false)}>Cancelar</Button>
					<Button
						color="error"
						variant="contained"
						onClick={() => handleValidar(false)}
						disabled={validating}
					>
						Rechazar
					</Button>
				</DialogActions>
			</Dialog>
		</PageLayout>
	)
}