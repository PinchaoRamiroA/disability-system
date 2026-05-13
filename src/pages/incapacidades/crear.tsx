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
	InputAdornment,
} from '@mui/material'
import { useFormik } from 'formik'
import { z } from 'zod'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import {
	createIncapacidad,
	getTiposIncapacidad,
	getEntidades,
} from '@/services/api/incapacidades'
import { TipoIncapacidad, Entidad } from '@/types/api'
import { usePermission, Permission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'
import { PageLayout } from '@/components/layouts/PageLayout'
import dayjs from 'dayjs'

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

interface FormValues {
	titulo: string
	id_tipo: number | ''
	id_entidad: number | ''
	origen: string
	canal_recepcion: string
	fecha_inicio: string
	fecha_fin: string
	fecha_radicacion: string
	observaciones: string
}

const validationSchema = z.object({
	titulo: z.string().min(1, 'Título es requerido'),
	id_tipo: z.number(),
	id_entidad: z.number(),
	origen: z.string().min(1, 'Origen es requerido'),
	canal_recepcion: z.string().min(1, 'Canal de recepción es requerido'),
	fecha_inicio: z.string().min(1, 'Fecha de inicio es requerida'),
	fecha_fin: z.string().min(1, 'Fecha de fin es requerida'),
	fecha_radicacion: z.string().optional(),
	observaciones: z.string().optional(),
})

export default function CrearIncapacidadPage() {
	const router = useRouter()
	const { hasPermission } = usePermission()
	const { enqueueSnackbar } = useNotifier()

	const [tipos, setTipos] = useState<TipoIncapacidad[]>([])
	const [entidades, setEntidades] = useState<Entidad[]>([])
	const [loading, setLoading] = useState(false)
	const [submitting, setSubmitting] = useState(false)

	const canCreate =
		hasPermission('crear_incapacidad') ||
		['Recepcionista', 'Gestión Humana', 'SG-SST'].includes(
			usePermission().role || ''
		)

	const formik = useFormik<FormValues>({
		initialValues: {
			titulo: '',
			id_tipo: '',
			id_entidad: '',
			origen: 'enfermedad_general',
			canal_recepcion: 'presencial',
			fecha_inicio: dayjs().format('YYYY-MM-DD'),
			fecha_fin: dayjs().add(3, 'day').format('YYYY-MM-DD'),
			fecha_radicacion: dayjs().format('YYYY-MM-DD'),
			observaciones: '',
		},
		validationSchema,
		onSubmit: async (values) => {
			setSubmitting(true)
			try {
				await createIncapacidad({
					titulo: values.titulo,
					id_tipo: values.id_tipo as number,
					id_entidad: values.id_entidad as number,
					origen: values.origen as 'enfermedad_general' | 'accidente_laboral' | 'enfermedad_laboral' | 'licencia_maternidad' | 'licencia_paternidad',
					canal_recepcion: values.canal_recepcion as 'email' | 'presencial' | 'virtual' | 'whatsapp',
					fecha_inicio: values.fecha_inicio,
					fecha_fin: values.fecha_fin,
					fecha_radicacion: values.fecha_radicacion || undefined,
					observaciones: values.observaciones || undefined,
				})
				enqueueSnackbar('Incapacidad creada exitosamente', {
					variant: 'success',
				})
				router.push('/incapacidades')
			} catch (error) {
				enqueueSnackbar('Error al crear incapacidad', {
					variant: 'error',
				})
			} finally {
				setSubmitting(false)
			}
		},
	})

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
			enqueueSnackbar('Error al cargar catálogos', {
				variant: 'error',
			})
		} finally {
			setLoading(false)
		}
	}

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

			<Box
				component="form"
				onSubmit={formik.handleSubmit}
				sx={{ maxWidth: 800 }}
			>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<TextField
							fullWidth
							name="titulo"
							label="Título"
							value={formik.values.titulo}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={
								formik.touched.titulo &&
								Boolean(formik.errors.titulo)
							}
							helperText={
								formik.touched.titulo && formik.errors.titulo
							}
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
									<MenuItem
										key={tipo.id_tipo}
										value={tipo.id_tipo}
									>
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
									<MenuItem
										key={entidad.id_entidad}
										value={entidad.id_entidad}
									>
										{entidad.nombre} ({entidad.tipo})
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>

					<Grid item xs={12} sm={6}>
						<FormControl fullWidth>
							<InputLabel>Origen</InputLabel>
							<Select
								name="origen"
								value={formik.values.origen}
								label="Origen"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							>
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
									<MenuItem
										key={canal.value}
										value={canal.value}
									>
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
							error={
								formik.touched.fecha_inicio &&
								Boolean(formik.errors.fecha_inicio)
							}
							helperText={
								formik.touched.fecha_inicio &&
								formik.errors.fecha_inicio
							}
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
							error={
								formik.touched.fecha_fin &&
								Boolean(formik.errors.fecha_fin)
							}
							helperText={
								formik.touched.fecha_fin && formik.errors.fecha_fin
							}
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
		</PageLayout>
	)
}