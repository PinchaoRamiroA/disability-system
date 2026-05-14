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
	Grid,
	Chip,
	LinearProgress,
	Alert,
	Card,
	CardContent,
	IconButton,
	Divider,
} from '@mui/material'
import { useFormik } from 'formik'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

import {
	createIncapacidad,
	getTiposIncapacidad,
	getEntidades,
	getDocumentosRequeridos,
	uploadDocumento,
	DocumentoRequerido,
} from '@/services/api/incapacidades'
import { getUsers } from '@/services/api/usuarios'
import { TipoIncapacidad, Entidad, AuthUser } from '@/types/api'
import { usePermission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'
import { PageLayout } from '@/components/layouts/PageLayout'
import dayjs from 'dayjs'
import SearchIcon from '@mui/icons-material/Search'

const CANAL_OPTIONS = [
	{ value: 'email', label: 'Email' },
	{ value: 'presencial', label: 'Presencial' },
	{ value: 'virtual', label: 'Virtual' },
	{ value: 'whatsapp', label: 'WhatsApp' },
]

interface FormValues {
	id_empleado: number | ''
	titulo: string
	id_tipo: number | ''
	id_entidad: number | ''
	canal_recepcion: string
	fecha_inicio: string
	fecha_fin: string
	fecha_radicacion: string
	observaciones: string
}

interface UploadedFile {
	id: number
	nombre: string
	url: string
	tipo: string
}

const validate = (values: FormValues) => {
	const errors: Partial<Record<keyof FormValues, string>> = {}
	if (!values.titulo) errors.titulo = 'Título es requerido'
	if (!values.id_tipo) errors.id_tipo = 'Tipo es requerido' as any
	if (!values.id_entidad) errors.id_entidad = 'Entidad es requerida' as any
	if (!values.canal_recepcion) errors.canal_recepcion = 'Canal de recepción es requerido'
	if (!values.fecha_inicio) errors.fecha_inicio = 'Fecha de inicio es requerida'
	if (!values.fecha_fin) errors.fecha_fin = 'Fecha de fin es requerida'
	return errors
}

export default function CrearIncapacidadPage() {
	const router = useRouter()
	const { hasPermission } = usePermission()
	const { enqueueSnackbar } = useNotifier()

	const [tipos, setTipos] = useState<TipoIncapacidad[]>([])
	const [entidades, setEntidades] = useState<Entidad[]>([])
	const [loading, setLoading] = useState(false)
	const [submitting, setSubmitting] = useState(false)

	const [createdIncapacidad, setCreatedIncapacidad] = useState<{ id: number } | null>(null)
	const [documentosRequeridos, setDocumentosRequeridos] = useState<DocumentoRequerido[]>([])
	const [uploadingFiles, setUploadingFiles] = useState<{ tipo: string; progress: number }[]>([])
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
	const [selectedTipoDoc, setSelectedTipoDoc] = useState<string>('')
	const [uploading, setUploading] = useState(false)
	const [dragOver, setDragOver] = useState(false)
	const [empleadoSearch, setEmpleadoSearch] = useState('')
	const [empleados, setEmpleados] = useState<AuthUser[]>([])
	const [selectedEmpleado, setSelectedEmpleado] = useState<AuthUser | null>(null)
	const [searchingEmpleados, setSearchingEmpleados] = useState(false)

	const canCreate =
		hasPermission('crear_incapacidad') ||
		['Recepcionista', 'Gestión Humana', 'SG-SST'].includes(
			usePermission().role || ''
		)

	const formik = useFormik<FormValues>({
		initialValues: {
			id_empleado: '',
			titulo: '',
			id_tipo: '',
			id_entidad: '',
			canal_recepcion: 'presencial',
			fecha_inicio: dayjs().format('YYYY-MM-DD'),
			fecha_fin: dayjs().add(3, 'day').format('YYYY-MM-DD'),
			fecha_radicacion: dayjs().format('YYYY-MM-DD'),
			observaciones: '',
		},
		validate,
		onSubmit: async (values) => {
			if (!selectedEmpleado) {
				enqueueSnackbar('Seleccione un empleado', { variant: 'warning' })
				return
			}
			setSubmitting(true)
			try {
				const payload = {
					id_empleado: selectedEmpleado.id_usuario,
					titulo: values.titulo,
					id_tipo: values.id_tipo as number,
					id_entidad: values.id_entidad as number,
					canal_recepcion: values.canal_recepcion as 'email' | 'presencial' | 'virtual' | 'whatsapp',
					fecha_inicio: values.fecha_inicio,
					fecha_fin: values.fecha_fin,
					fecha_radicacion: values.fecha_radicacion || undefined,
					observaciones: values.observaciones || undefined,
				}
				console.log('selectedEmpleado:', selectedEmpleado)
				console.log('Submitting incapacidad payload:', payload)
				const response = await createIncapacidad(payload)
				console.log('Create response:', response.data)

				const incapacidadId = response.data.data.id_incapacidad
				setCreatedIncapacidad({ id: incapacidadId })
				enqueueSnackbar('Incapacidad creada exitosamente', { variant: 'success' })

				await loadDocumentosRequeridos(values.id_tipo as number)
			} catch (error) {
				enqueueSnackbar('Error al crear incapacidad', { variant: 'error' })
			} finally {
				setSubmitting(false)
			}
		},
	})

	const loadDocumentosRequeridos = async (idTipo: number) => {
		try {
			const res = await getDocumentosRequeridos(idTipo)
			setDocumentosRequeridos(res.data.data || [])
			if (res.data.data?.length > 0) {
				setSelectedTipoDoc(res.data.data[0].nombre)
			}
		} catch (error) {
			console.error('Error loading docs requeridos:', error)
		}
	}

	const searchEmpleados = async () => {
		if (!empleadoSearch.trim()) return
		setSearchingEmpleados(true)
		try {
			const res = await getUsers({ search: empleadoSearch, limit: 10 })
			setEmpleados(res.data.data?.items || [])
		} catch (error) {
			enqueueSnackbar('Error al buscar empleados', { variant: 'error' })
		} finally {
			setSearchingEmpleados(false)
		}
	}

	const selectEmpleado = (empelado: AuthUser) => {
		console.log('Selecting empleado:', empelado)
		const empleadoId = empelado.id_usuario
		setSelectedEmpleado(empelado)
		setEmpleados([])
		setEmpleadoSearch('')
		formik.setFieldValue('id_empleado', empleadoId)
	}

	useEffect(() => {
		if (!canCreate) {
			router.push('/incapacidades')
			return
		}

		loadCatalogs()
	}, [])

	const loadCatalogs = async () => {
		setLoading(true)
		try {
			const [tiposRes, entidadesRes] = await Promise.all([
				getTiposIncapacidad(),
				getEntidades(),
			])
			setTipos(tiposRes.data.data)
			setEntidades(entidadesRes.data.data)
		} catch (error) {
			enqueueSnackbar('Error al cargar catálogos', { variant: 'error' })
		} finally {
			setLoading(false)
		}
	}

	const handleUploadFile = async (file: File, tipo: string) => {
		if (!createdIncapacidad) return

		setUploading(true)
		setUploadingFiles((prev) => [...prev, { tipo, progress: 0 }])

		try {
			const response = await uploadDocumento(createdIncapacidad.id, tipo, file)

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
		} finally {
			setUploadingFiles((prev) => prev.filter((f) => f.tipo !== tipo))
			setUploading(false)
		}
	}

	const handleDrop = (e: React.DragEvent, tipo: string) => {
		e.preventDefault()
		setDragOver(false)
		const files = Array.from(e.dataTransfer.files)
		files.forEach((file) => handleUploadFile(file, tipo))
	}

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, tipo: string) => {
		if (!e.target.files) return
		Array.from(e.target.files).forEach((file) => handleUploadFile(file, tipo))
		e.target.value = ''
	}

	const isFileUploaded = (tipo: string) => uploadedFiles.some((f) => f.tipo === tipo)
	const isRequired = (doc: DocumentoRequerido) => doc.requerido

	if (!canCreate) {
		return null
	}

	return (
		<PageLayout title="Nueva Incapacidad">
			<Box sx={{ mb: 2 }}>
				<Button
					startIcon={<ArrowBackIcon />}
					onClick={() => router.push('/incapacidades')}
				>
					Volver
				</Button>
			</Box>

			{!createdIncapacidad ? (
				<Box
					component="form"
					onSubmit={formik.handleSubmit}
					sx={{ maxWidth: 800 }}
				>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Card variant="outlined">
								<CardContent>
									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Buscar Empleado
									</Typography>
									<Box sx={{ display: 'flex', gap: 1 }}>
										<TextField
											fullWidth
											size="small"
											placeholder="Buscar por nombre o número de documento"
											value={empleadoSearch}
											onChange={(e) => setEmpleadoSearch(e.target.value)}
											onKeyDown={(e) => e.key === 'Enter' && searchEmpleados()}
											InputProps={{
												endAdornment: searchingEmpleados ? (
													<Typography variant="caption">Buscando...</Typography>
												) : null,
											}}
										/>
										<Button
											variant="outlined"
											startIcon={<SearchIcon />}
											onClick={searchEmpleados}
											disabled={searchingEmpleados || !empleadoSearch.trim()}
										>
											Buscar
										</Button>
									</Box>

									{empleados.length > 0 && (
										<Box sx={{ mt: 2 }}>
											{empleados.map((empelado) => (
												<Box
													key={empelado.id}
													sx={{
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
														p: 1,
														border: '1px solid',
														borderColor: 'divider',
														borderRadius: 1,
														cursor: 'pointer',
														'&:hover': { backgroundColor: 'action.hover' },
													}}
													onClick={() => selectEmpleado(empelado)}
												>
													<Box>
														<Typography variant="body2" fontWeight={600}>
															{empelado.nombre}
														</Typography>
														<Typography variant="caption" color="text.secondary">
															Cédula: {empelado.numero_documento}
														</Typography>
													</Box>
												</Box>
											))}
										</Box>
									)}

									<Grid item xs={12}>
							<Alert
								severity={selectedEmpleado ? 'success' : 'warning'}
								icon={selectedEmpleado ? <CheckCircleIcon /> : <SearchIcon />}
								sx={{ mb: 2 }}
							>
								{selectedEmpleado ? (
									<>
										<strong>Empleado seleccionado:</strong> {selectedEmpleado.nombre} (C.C. {selectedEmpleado.numero_documento})
									</>
								) : (
									'Busque y seleccione un empleado para continuar'
								)}
							</Alert>
						</Grid>
								</CardContent>
							</Card>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								name="titulo"
								label="Título"
								value={formik.values.titulo}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.titulo && Boolean(formik.errors.titulo)}
								helperText={formik.touched.titulo && formik.errors.titulo}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<FormControl fullWidth error={formik.touched.id_tipo && Boolean(formik.errors.id_tipo)}>
								<InputLabel>Tipo de Incapacidad</InputLabel>
								<Select
									name="id_tipo"
									value={formik.values.id_tipo}
									label="Tipo de Incapacidad"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								>
									{tipos.map((tipo) => (
										<MenuItem key={tipo.id_tipo} value={tipo.id_tipo}>
											{tipo.nombre}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12} sm={6}>
							<FormControl fullWidth error={formik.touched.id_entidad && Boolean(formik.errors.id_entidad)}>
								<InputLabel>Entidad (EPS/ARL)</InputLabel>
								<Select
									name="id_entidad"
									value={formik.values.id_entidad}
									label="Entidad (EPS/ARL)"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								>
									{entidades.map((entidad) => (
										<MenuItem key={entidad.id_entidad} value={entidad.id_entidad}>
											{entidad.nombre} ({entidad.tipo})
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12} sm={6}>
							<FormControl fullWidth>
								<InputLabel>Canal de Recepción</InputLabel>
								<Select
									name="canal_recepcion"
									value={formik.values.canal_recepcion}
									label="Canal de Recepción"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								>
									{CANAL_OPTIONS.map((canal) => (
										<MenuItem key={canal.value} value={canal.value}>
											{canal.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								type="date"
								name="fecha_inicio"
								label="Fecha de Inicio"
								value={formik.values.fecha_inicio}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.fecha_inicio && Boolean(formik.errors.fecha_inicio)}
								helperText={formik.touched.fecha_inicio && formik.errors.fecha_inicio}
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>

						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								type="date"
								name="fecha_fin"
								label="Fecha de Fin"
								value={formik.values.fecha_fin}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.fecha_fin && Boolean(formik.errors.fecha_fin)}
								helperText={formik.touched.fecha_fin && formik.errors.fecha_fin}
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>

						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								type="date"
								name="fecha_radicacion"
								label="Fecha de Radicación"
								value={formik.values.fecha_radicacion}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								name="observaciones"
								label="Observaciones"
								value={formik.values.observaciones}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								multiline
								rows={3}
							/>
						</Grid>

						<Grid item xs={12}>
							<Button
								type="submit"
								variant="contained"
								startIcon={<SaveIcon />}
								disabled={submitting || loading}
							>
								{submitting ? 'Guardando...' : 'Guardar Incapacidad'}
							</Button>
						</Grid>
					</Grid>
				</Box>
			) : (
				<Box>
					<Alert severity="success" sx={{ mb: 3 }}>
						Incapacidad creada exitosamente. Ahora puede subir los documentos requeridos.
					</Alert>

					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Documentos Requeridos
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
								Seleccione el tipo de documento y arrastre o seleccione el archivo
							</Typography>

							<Grid container spacing={3}>
								{documentosRequeridos.map((doc) => {
									const uploaded = isFileUploaded(doc.codigo)
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
														{isRequired(doc) && (
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

												{uploadedFiles
													.filter((f) => f.tipo === doc.codigo)
													.map((file) => (
														<Box
															key={file.id}
															sx={{
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'space-between',
																mt: 2,
																p: 1,
																border: '1px solid',
																borderColor: 'success.main',
																borderRadius: 1,
																backgroundColor: 'success.50',
															}}
														>
															<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
																<InsertDriveFileIcon color="success" />
																<Typography variant="body2">{file.nombre}</Typography>
															</Box>
															<CheckCircleIcon color="success" />
														</Box>
													))}
											</Box>
										</Grid>
									)
								})}
							</Grid>

							<Divider sx={{ my: 3 }} />

							<Box sx={{ display: 'flex', gap: 2 }}>
								<Button
									variant="outlined"
									onClick={() => router.push('/incapacidades')}
								>
									Volver a Incapacidades
								</Button>
								<Button
									variant="contained"
									onClick={() => router.push(`/incapacidades/${createdIncapacidad.id}`)}
								>
									Ver Detalle de Incapacidad
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Box>
			)}
		</PageLayout>
	)
}