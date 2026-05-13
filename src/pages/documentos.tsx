import { useState, useEffect } from 'react'
import {
	Box,
	Typography,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Stack,
	Chip,
	Card,
	CardContent,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { getIncapacidades } from '@/services/api/incapacidades'
import { Incapacidad } from '@/types/api'
import { usePermission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'
import { PageLayout } from '@/components/layouts/PageLayout'
import { Table } from '@/components/Table'
import { FileUploader } from '@/components/FileUploader'
import { getIncapacidadDocumentos } from '@/services/api/incapacidades'
import { Documento } from '@/types/api'
import dayjs from 'dayjs'

export default function DocumentosPage() {
	const { hasPermission } = usePermission()
	const { enqueueSnackbar } = useNotifier()
	const showError = (msg: string) => enqueueSnackbar(msg, { variant: 'error' })

	const [incapacidades, setIncapacidades] = useState<Incapacidad[]>([])
	const [loading, setLoading] = useState(false)
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedIncapacidad, setSelectedIncapacidad] = useState<Incapacidad | null>(null)
	const [documentos, setDocumentos] = useState<Documento[]>([])
	const [docsLoading, setDocsLoading] = useState(false)
	const [dialogOpen, setDialogOpen] = useState(false)

	const canView =
		hasPermission('consultar_incapacidad') ||
		hasPermission('validar_documentos')

	useEffect(() => {
		if (canView) {
			loadIncapacidades()
		}
	}, [page, searchTerm])

	const loadIncapacidades = async () => {
		setLoading(true)
		try {
			const response = await getIncapacidades({
				search: searchTerm,
				page,
				limit: 10,
			})
			setIncapacidades(response.data.data.items)
			setTotalPages(response.data.data.total_pages)
		} catch {
			showError('Error al cargar incapacidades')
		} finally {
			setLoading(false)
		}
	}

	const handleVerDocumentos = async (incapacidad: Incapacidad) => {
		setSelectedIncapacidad(incapacidad)
		setDocsLoading(true)
		try {
			const response = await getIncapacidadDocumentos(incapacidad.id_incapacidad)
			setDocumentos(response.data.data.items || [])
			setDialogOpen(true)
		} catch {
			showError('Error al cargar documentos')
		} finally {
			setDocsLoading(false)
		}
	}

	const columns = [
		{ id: 'id_incapacidad', label: 'ID', width: 80 },
		{ id: 'titulo', label: 'Título', render: (row: Incapacidad) => row.titulo },
		{ id: 'tipo', label: 'Tipo', render: (row: Incapacidad) => row.tipo?.nombre || '-' },
		{ id: 'entidad', label: 'Entidad', render: (row: Incapacidad) => row.entidad?.nombre || '-' },
		{
			id: 'estado',
			label: 'Estado',
			render: (row: Incapacidad) => (
				<Chip
					label={row.estado?.nombre || '-'}
					size="small"
					color={
						row.estado?.nombre?.toLowerCase().includes('pagada')
							? 'success'
							: row.estado?.nombre?.toLowerCase().includes('rechazada')
							? 'error'
							: 'default'
					}
				/>
			),
		},
		{ id: 'fecha_inicio', label: 'Fecha', render: (row: Incapacidad) => dayjs(row.fecha_inicio).format('DD/MM/YYYY') },
	]

	return (
		<PageLayout title="Gestión Documental">
			<Box sx={{ mb: 3 }}>
				<Stack direction="row" spacing={2} alignItems="center">
					<TextField
						label="Buscar incapacidad"
						size="small"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						InputProps={{ endAdornment: <SearchIcon color="action" /> }}
						sx={{ width: 300 }}
					/>
				</Stack>
			</Box>

			<Table
				columns={columns}
				data={incapacidades}
				loading={loading}
				emptyMessage="No se encontraron incapacidades"
				onRowClick={handleVerDocumentos}
				pagination={{ page, totalPages, onPageChange: setPage }}
			/>

			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
				<DialogTitle>
					Documentos - {selectedIncapacidad?.titulo}
				</DialogTitle>
				<DialogContent>
					{docsLoading ? (
						<Typography>Cargando documentos...</Typography>
					) : (
						<Box sx={{ mt: 2 }}>
							{documentos.length > 0 ? (
								<Card sx={{ mb: 3 }}>
									<CardContent>
										<Typography variant="subtitle2" gutterBottom>
											Documentos Subidos ({documentos.length})
										</Typography>
										<Box sx={{ overflowX: 'auto' }}>
											<table style={{ width: '100%', borderCollapse: 'collapse' }}>
												<thead>
													<tr style={{ backgroundColor: '#f5f5f5' }}>
														<th style={{ padding: '8px' }}>Tipo</th>
														<th style={{ padding: '8px' }}>Nombre</th>
														<th style={{ padding: '8px' }}>Estado</th>
														<th style={{ padding: '8px' }}>Fecha</th>
														<th style={{ padding: '8px' }}>Acciones</th>
													</tr>
												</thead>
												<tbody>
													{documentos.map((doc) => (
														<tr key={doc.id_documento} style={{ borderBottom: '1px solid #eee' }}>
															<td style={{ padding: '8px' }}>{doc.tipo}</td>
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
																{doc.created_at ? dayjs(doc.created_at).format('DD/MM/YYYY') : '-'}
															</td>
															<td style={{ padding: '8px' }}>
																<Button
																	size="small"
																	startIcon={<VisibilityIcon />}
																	onClick={() => window.open(doc.url, '_blank')}
																>
																	Ver
																</Button>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</Box>
									</CardContent>
								</Card>
							) : (
								<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
									No hay documentos subidos
								</Typography>
							)}

							<FileUploader
								idIncapacidad={selectedIncapacidad?.id_incapacidad || 0}
								tipoDocumento="general"
								onUploadComplete={() => {
									if (selectedIncapacidad) {
										handleVerDocumentos(selectedIncapacidad)
									}
								}}
							/>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)}>Cerrar</Button>
				</DialogActions>
			</Dialog>
		</PageLayout>
	)
}