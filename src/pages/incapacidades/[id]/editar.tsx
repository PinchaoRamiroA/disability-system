import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
	Box,
	Typography,
	Button,
	Grid,
	Chip,
	Card,
	CardContent,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	LinearProgress,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import UploadIcon from '@mui/icons-material/Upload'
import {
	getIncapacidadById,
	getDocumentosRequeridos,
	uploadDocumento,
	deleteDocumento,
	getTiposIncapacidad,
	getEntidades,
	DocumentoRequerido,
} from '@/services/api/incapacidades'
import { TipoIncapacidad, Entidad, Documento } from '@/types/api'
import { usePermission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'
import { PageLayout } from '@/components/layouts/PageLayout'
import dayjs from 'dayjs'

interface UploadedFile {
	id: number
	nombre: string
	url: string
	tipo: string
}

interface PendingFile {
	file: File
	tipo: string
}

const ORIGEN_LABELS: Record<string, string> = {
	enfermedad_general: 'Enfermedad General',
	accidente_laboral: 'Accidente Laboral',
	enfermedad_laboral: 'Enfermedad Laboral',
	licencia_maternidad: 'Licencia Maternidad',
	licencia_paternidad: 'Licencia Paternidad',
}

export default function EditarIncapacidadPage() {
	const router = useRouter()
	const { id } = router.query
	const { hasPermission } = usePermission()
	const { enqueueSnackbar } = useNotifier()

	const [incapacidad, setIncapacidad] = useState<any>(null)
	const [tipos, setTipos] = useState<TipoIncapacidad[]>([])
	const [entidades, setEntidades] = useState<Entidad[]>([])
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)

	const [documentosRequeridos, setDocumentosRequeridos] = useState<DocumentoRequerido[]>([])
	const [documentos, setDocumentos] = useState<Documento[]>([])
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
	const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
	const [uploading, setUploading] = useState(false)
	const [uploadingFiles, setUploadingFiles] = useState<{ tipo: string; progress: number }[]>([])
	const [dragOver, setDragOver] = useState(false)

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [fileToDelete, setFileToDelete] = useState<{ id: number; tipo: string } | null>(null)
	const [deleting, setDeleting] = useState(false)

	const canEdit = hasPermission('editar_incapacidad')

	useEffect(() => {
		if (!id) return

		loadInitialData()
	}, [id])

	const loadInitialData = async () => {
		setLoading(true)
		try {
			const [incRes, tiposRes, entidadesRes] = await Promise.all([
				getIncapacidadById(Number(id)),
				getTiposIncapacidad(),
				getEntidades(),
			])

			const data = incRes.data.data
			setIncapacidad(data)
			setTipos(tiposRes.data.data)
			setEntidades(entidadesRes.data.data)

			if (data.tipo?.id_tipo) {
				await loadDocumentosRequeridos(data.tipo.id_tipo)
			}

			await loadDocumentos()
		} catch (error) {
			enqueueSnackbar('Error al cargar datos', { variant: 'error' })
		} finally {
			setLoading(false)
		}
	}

	const loadDocumentosRequeridos = async (idTipo: number) => {
		try {
			const res = await getDocumentosRequeridos(idTipo)
			setDocumentosRequeridos(res.data.data || [])
		} catch (error) {
			console.error('Error loading docs requeridos:', error)
		}
	}

	const loadDocumentos = async () => {
		try {
			const res = await getIncapacidadById(Number(id))
			const docs = res.data.data.documentos || []
			setDocumentos(docs)

			const files = docs.map((doc: any) => ({
				id: doc.id_documento,
				nombre: doc.nombre_archivo || doc.nombre,
				url: doc.url || '',
				tipo: doc.tipo,
			}))
			setUploadedFiles(files)
		} catch (error) {
			console.error('Error loading documentos:', error)
		}
	}

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, tipo: string) => {
		if (!e.target.files) return
		Array.from(e.target.files).forEach((file) => {
			setPendingFiles((prev) => [...prev, { file, tipo }])
		})
		e.target.value = ''
	}

	const handleDrop = (e: React.DragEvent, tipo: string) => {
		e.preventDefault()
		setDragOver(false)
		const files = Array.from(e.dataTransfer.files)
		files.forEach((file) => {
			setPendingFiles((prev) => [...prev, { file, tipo }])
		})
	}

	const removePendingFile = (index: number) => {
		setPendingFiles((prev) => prev.filter((_, i) => i !== index))
	}

	const handleUploadPendingFiles = async (tipo: string) => {
		const filesToUpload = pendingFiles.filter((pf) => pf.tipo === tipo)
		if (filesToUpload.length === 0) return

		setUploading(true)
		setUploadingFiles((prev) => [...prev, { tipo, progress: 0 }])

		for (const { file } of filesToUpload) {
			try {
				const response = await uploadDocumento(Number(id), tipo, file)

				const newFile = {
					id: (response.data.data as any).id_documento || Date.now(),
					nombre: file.name,
					url: (response.data.data as any).url || '',
					tipo,
				}

				setUploadedFiles((prev) => [...prev, newFile])
				enqueueSnackbar(`Archivo ${file.name} subido exitosamente`, { variant: 'success' })
			} catch (error) {
				enqueueSnackbar(`Error al subir ${file.name}`, { variant: 'error' })
			}
		}

		setPendingFiles((prev) => prev.filter((pf) => pf.tipo !== tipo))
		setUploadingFiles((prev) => prev.filter((f) => f.tipo !== tipo))
		setUploading(false)
	}

	const handleOpenDeleteDialog = (file: UploadedFile) => {
		setFileToDelete({ id: file.id, tipo: file.tipo })
		setDeleteDialogOpen(true)
	}

	const handleCloseDeleteDialog = () => {
		setDeleteDialogOpen(false)
		setFileToDelete(null)
	}

	const handleDeleteFile = async () => {
		if (!fileToDelete) return
		setDeleting(true)
		try {
			await deleteDocumento(fileToDelete.id)
			setUploadedFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id))
			await loadDocumentos()
			enqueueSnackbar('Archivo eliminado', { variant: 'success' })
		} catch (error) {
			enqueueSnackbar('Error al eliminar archivo', { variant: 'error' })
		} finally {
			setDeleting(false)
			handleCloseDeleteDialog()
		}
	}

	const isFileUploaded = (tipo: string) =>
		uploadedFiles.some((f) => f.tipo === tipo)

	const getUploadedFilesForTipo = (tipo: string) =>
		uploadedFiles.filter((f) => f.tipo === tipo)

	const getPendingFilesForTipo = (tipo: string) =>
		pendingFiles.filter((pf) => pf.tipo === tipo)

	const hasPendingFiles = (tipo: string) =>
		getPendingFilesForTipo(tipo).length > 0

	if (loading) {
		return (
			<PageLayout title="Editar Incapacidad">
				<Typography>Cargando...</Typography>
			</PageLayout>
		)
	}

	if (!incapacidad) {
		return (
			<PageLayout title="Editar Incapacidad">
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
		<PageLayout title={`Editar Incapacidad #${incapacidad.id_incapacidad}`}>
			<Box sx={{ mb: 2 }}>
				<Button
					startIcon={<ArrowBackIcon />}
					onClick={() => router.push(`/incapacidades/${id}`)}
				>
					Volver al detalle
				</Button>
			</Box>

			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={3}>
							<Typography variant="caption" color="text.secondary">
								Estado
							</Typography>
							<Box sx={{ mt: 0.5 }}>
								<Chip label={incapacidad.estado?.nombre || 'Sin estado'} size="small" />
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
					<Grid container spacing={2} sx={{ mt: 1 }}>
						<Grid item xs={12} sm={4}>
							<Typography variant="caption" color="text.secondary">
								Título
							</Typography>
							<Typography variant="body1">
								{incapacidad.titulo}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={4}>
							<Typography variant="caption" color="text.secondary">
								Período
							</Typography>
							<Typography variant="body1">
								{dayjs(incapacidad.fecha_inicio).format('DD/MM/YYYY')} - {dayjs(incapacidad.fecha_fin).format('DD/MM/YYYY')}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={4}>
							<Typography variant="caption" color="text.secondary">
								Empleado
							</Typography>
							<Typography variant="body1">
								{incapacidad.empleado?.nombre}
							</Typography>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{documentosRequeridos.length > 0 ? (
				<Card>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							Documentos
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
							Gestione los documentos de la incapacidad. Seleccione archivos y presione "Subir" para agregarlos.
						</Typography>

						<Grid container spacing={3}>
							{documentosRequeridos.map((doc) => {
								const uploaded = isFileUploaded(doc.codigo)
								const filesForTipo = getUploadedFilesForTipo(doc.codigo)
								const pendingForTipo = getPendingFilesForTipo(doc.codigo)
								const isUploading = uploadingFiles.some((f) => f.tipo === doc.codigo)

								return (
									<Grid item xs={12} key={doc.id_tipo_documento}>
										<Box
											sx={{
												border: '1px solid',
												borderColor: uploaded ? 'success.main' : 'divider',
												borderRadius: 2,
												p: 2,
												backgroundColor: uploaded ? 'success.50' : 'transparent',
											}}
										>
											<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													<Typography variant="subtitle1" fontWeight={600}>
														{doc.nombre}
													</Typography>
													{doc.requerido && (
														<Chip label="Requerido" color="warning" size="small" />
													)}
													{uploaded && (
														<Chip label="Subido" color="success" size="small" icon={<CheckCircleIcon />} />
													)}
												</Box>
											</Box>

											<Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
												{doc.descripcion}
											</Typography>

											<Box
												onDrop={(e) => handleDrop(e, doc.codigo)}
												onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
												onDragLeave={() => setDragOver(false)}
												sx={{
													border: '2px dashed',
													borderColor: dragOver ? 'primary.main' : 'divider',
													borderRadius: 2,
													p: 3,
													textAlign: 'center',
													backgroundColor: dragOver ? 'action.hover' : 'transparent',
													cursor: 'pointer',
													opacity: uploading ? 0.5 : 1,
												}}
											>
												<input
													type="file"
													accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
													onChange={(e) => handleFileSelect(e, doc.codigo)}
													style={{ display: 'none' }}
													id={`upload-${doc.id_tipo_documento}`}
												/>
												<label htmlFor={`upload-${doc.id_tipo_documento}`}>
													<CloudUploadIcon sx={{ fontSize: 36, color: 'action.active', mb: 1 }} />
													<Typography variant="body2">
														Arrastra archivos o haz clic para seleccionar
													</Typography>
													<Typography variant="caption" color="text.secondary">
														PDF, JPG, PNG, DOC, DOCX (máx 10MB)
													</Typography>
												</label>
											</Box>

											{pendingForTipo.map((pf, index) => (
												<Box
													key={`pending-${index}`}
													sx={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'space-between',
														mt: 2,
														p: 1.5,
														bgcolor: 'warning.50',
														borderRadius: 1,
														border: '1px solid',
														borderColor: 'warning.main',
													}}
												>
													<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
														<InsertDriveFileIcon color="warning" />
														<Typography variant="body2">{pf.file.name}</Typography>
														<Typography variant="caption" color="text.secondary">
															({(pf.file.size / 1024 / 1024).toFixed(2)} MB)
														</Typography>
													</Box>
													<IconButton
														size="small"
														color="error"
														onClick={() => removePendingFile(pendingFiles.indexOf(pf))}
													>
														<DeleteIcon fontSize="small" />
													</IconButton>
												</Box>
											))}

											{hasPendingFiles(doc.codigo) && (
												<Box sx={{ mt: 2 }}>
													<Button
														variant="contained"
														color="primary"
														startIcon={<UploadIcon />}
														onClick={() => handleUploadPendingFiles(doc.codigo)}
														disabled={isUploading || uploading}
													>
														{isUploading ? 'Subiendo...' : `Subir ${pendingForTipo.length} archivo(s)`}
													</Button>
												</Box>
											)}

											{filesForTipo.map((file) => (
												<Box
													key={file.id}
													sx={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'space-between',
														mt: 2,
														p: 1.5,
														bgcolor: 'background.paper',
														borderRadius: 1,
														border: '1px solid',
														borderColor: 'divider',
													}}
												>
													<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
														<InsertDriveFileIcon color="action" />
														<Typography variant="body2">{file.nombre}</Typography>
													</Box>
													<IconButton
														size="small"
														color="error"
														onClick={() => handleOpenDeleteDialog(file)}
													>
														<DeleteIcon fontSize="small" />
													</IconButton>
												</Box>
											))}
										</Box>
									</Grid>
								)
							})}
						</Grid>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardContent>
						<Typography variant="body2" color="text.secondary">
							No hay documentos requeridos configurados para este tipo de incapacidad.
						</Typography>
					</CardContent>
				</Card>
			)}

			{uploading && (
				<Box sx={{ position: 'fixed', bottom: 20, left: 20, right: 20 }}>
					<LinearProgress />
				</Box>
			)}

			<Dialog
				open={deleteDialogOpen}
				onClose={handleCloseDeleteDialog}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Eliminar Documento</DialogTitle>
				<DialogContent>
					<Typography>
						¿Está seguro de que desea eliminar este documento? Esta acción no se puede deshacer.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDeleteDialog} disabled={deleting}>
						Cancelar
					</Button>
					<Button
						onClick={handleDeleteFile}
						color="error"
						variant="contained"
						disabled={deleting}
					>
						{deleting ? 'Eliminando...' : 'Eliminar'}
					</Button>
				</DialogActions>
			</Dialog>
		</PageLayout>
	)
}