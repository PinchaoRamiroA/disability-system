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
	Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import {
	getSeguimientos,
	createSeguimiento,
} from '@/services/api/cobros'
import { getCarteraVencida } from '@/services/api/cartera'
import { SeguimientoCobro, CarteraVencida } from '@/types/api'
import { usePermission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'
import { PageLayout } from '@/components/layouts/PageLayout'
import { useFormik } from 'formik'
import dayjs from 'dayjs'
import SaveIcon from '@mui/icons-material/Save'

const TIPO_SEGUIMIENTO_OPTIONS = [
	{ value: 'persuasivo', label: 'Persuasivo', color: 'info' },
	{ value: 'coercitivo', label: 'Coercitivo', color: 'warning' },
	{ value: 'juridico', label: 'Jurídico', color: 'error' },
]

interface FormValues {
	id_incapacidad: number
	descripcion: string
	fecha_contacto: string
	tipo_seguimiento: string
}

const validationSchema = {
	id_incapacidad: { required: true, message: 'Incapacidad es requerida' },
	descripcion: { required: true, message: 'Descripción es requerida' },
	fecha_contacto: { required: true, message: 'Fecha de contacto es requerida' },
	tipo_seguimiento: { required: true, message: 'Tipo de seguimiento es requerido' },
}

const validate = (values: FormValues) => {
	const errors: Partial<Record<keyof FormValues, string>> = {}
	if (!values.id_incapacidad) errors.id_incapacidad = 'Incapacidad es requerida'
	if (!values.descripcion) errors.descripcion = 'Descripción es requerida'
	if (!values.fecha_contacto) errors.fecha_contacto = 'Fecha de contacto es requerida'
	if (!values.tipo_seguimiento) errors.tipo_seguimiento = 'Tipo de seguimiento es requerido'
	return errors
}

export default function SeguimientoPage() {
	const { hasPermission } = usePermission()
	const { enqueueSnackbar } = useNotifier()
	const showError = (msg: string) => enqueueSnackbar(msg, { variant: 'error' })
	const showSuccess = (msg: string) => enqueueSnackbar(msg, { variant: 'success' })

	const [seguimientos, setSeguimientos] = useState<SeguimientoCobro[]>([])
	const [casosVencidos, setCasosVencidos] = useState<CarteraVencida[]>([])
	const [loading, setLoading] = useState(false)
	const [showForm, setShowForm] = useState(false)

	const canManage =
		hasPermission('gestionar_cobro_persuasivo') ||
		hasPermission('gestionar_cobro_juridico')

	useEffect(() => {
		if (canManage) {
			loadData()
		}
	}, [canManage])

	const loadData = async () => {
		setLoading(true)
		try {
			const [segRes, vencRes] = await Promise.all([
				getSeguimientos({ limit: 20 }),
				getCarteraVencida(),
			])
			setSeguimientos(segRes.data.data.items)
			setCasosVencidos(vencRes.data.data)
		} catch (error) {
			showError('Error al cargar datos')
		} finally {
			setLoading(false)
		}
	}

	const formik = useFormik<FormValues>({
		initialValues: {
			id_incapacidad: 0,
			descripcion: '',
			fecha_contacto: dayjs().format('YYYY-MM-DD'),
			tipo_seguimiento: 'persuasivo',
		},
		validate,
		onSubmit: async (values) => {
			try {
				await createSeguimiento({
					id_incapacidad: values.id_incapacidad,
					descripcion: values.descripcion,
					fecha_contacto: values.fecha_contacto,
					tipo_seguimiento: values.tipo_seguimiento as 'persuasivo' | 'coercitivo' | 'juridico',
				})
				showSuccess('Seguimiento registrado')
				formik.resetForm()
				setShowForm(false)
				loadData()
			} catch (error) {
				showError('Error al registrar seguimiento')
			}
		},
	})

	if (!canManage) {
		return (
			<PageLayout title="Seguimiento y Cobro">
				<Typography color="error">
					No tiene permisos para acceder a esta sección
				</Typography>
			</PageLayout>
		)
	}

	return (
		<PageLayout title="Seguimiento y Cobro">
			<Box sx={{ mb: 3 }}>
				<Stack direction="row" justifyContent="space-between">
					<Typography variant="body2" color="text.secondary">
						Casos vencidos: {casosVencidos.length}
					</Typography>
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={() => setShowForm(!showForm)}
					>
						{showForm ? 'Cancelar' : 'Nuevo Seguimiento'}
					</Button>
				</Stack>
			</Box>

			{showForm && (
				<Card sx={{ mb: 3 }}>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							Registrar Seguimiento
						</Typography>
						<Box
							component="form"
							onSubmit={formik.handleSubmit}
						>
							<Stack spacing={2}>
								<TextField
									fullWidth
									name="id_incapacidad"
									label="ID Incapacidad"
									type="number"
									value={formik.values.id_incapacidad || ''}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.id_incapacidad && Boolean(formik.errors.id_incapacidad)}
									helperText={formik.touched.id_incapacidad && formik.errors.id_incapacidad}
								/>

								<FormControl fullWidth>
									<InputLabel>Tipo de Seguimiento</InputLabel>
									<Select
										name="tipo_seguimiento"
										value={formik.values.tipo_seguimiento}
										label="Tipo de Seguimiento"
										onChange={formik.handleChange}
									>
										{TIPO_SEGUIMIENTO_OPTIONS.map((opt) => (
											<MenuItem key={opt.value} value={opt.value}>
												{opt.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>

								<TextField
									fullWidth
									type="date"
									name="fecha_contacto"
									label="Fecha de Contacto"
									value={formik.values.fecha_contacto}
									onChange={formik.handleChange}
									InputLabelProps={{ shrink: true }}
								/>

								<TextField
									fullWidth
									name="descripcion"
									label="Descripción del Seguimiento"
									value={formik.values.descripcion}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									multiline
									rows={3}
									error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
									helperText={formik.touched.descripcion && formik.errors.descripcion}
								/>

								<Button
									type="submit"
									variant="contained"
									startIcon={<SaveIcon />}
								>
									Guardar Seguimiento
								</Button>
							</Stack>
						</Box>
					</CardContent>
				</Card>
			)}

			{casosVencidos.length > 0 && (
				<Card sx={{ mb: 3 }}>
					<CardContent>
						<Typography variant="h6" gutterBottom color="error">
							Casos Vencidos ({casosVencidos.length})
						</Typography>
						<Box sx={{ overflowX: 'auto' }}>
							<table style={{ width: '100%', borderCollapse: 'collapse' }}>
								<thead>
									<tr style={{ backgroundColor: '#f5f5f5' }}>
										<th style={{ padding: '12px' }}>ID</th>
										<th style={{ padding: '12px' }}>Incapacidad</th>
										<th style={{ padding: '12px' }}>Entidad</th>
										<th style={{ padding: '12px' }}>Valor Pendiente</th>
										<th style={{ padding: '12px' }}>Días Vencido</th>
									</tr>
								</thead>
								<tbody>
									{casosVencidos.map((caso) => (
										<tr key={caso.id_incapacidad} style={{ borderBottom: '1px solid #eee' }}>
											<td style={{ padding: '12px' }}>{caso.id_incapacidad}</td>
											<td style={{ padding: '12px' }}>{caso.incapacidad?.titulo}</td>
											<td style={{ padding: '12px' }}>{caso.entidad?.nombre}</td>
											<td style={{ padding: '12px' }}>
												${parseFloat(caso.valor_pendiente).toLocaleString()}
											</td>
											<td style={{ padding: '12px' }}>
												<Chip
													label={`${caso.dias_vencidos} días`}
													size="small"
													color="error"
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</Box>
					</CardContent>
				</Card>
			)}

			<Card>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Historial de Seguimientos
					</Typography>
					{seguimientos.length === 0 ? (
						<Typography variant="body2" color="text.secondary">
							No hay seguimientos registrados
						</Typography>
					) : (
						<Box sx={{ overflowX: 'auto' }}>
							<table style={{ width: '100%', borderCollapse: 'collapse' }}>
								<thead>
									<tr style={{ backgroundColor: '#f5f5f5' }}>
										<th style={{ padding: '12px' }}>Fecha</th>
										<th style={{ padding: '12px' }}>Tipo</th>
										<th style={{ padding: '12px' }}>Descripción</th>
									</tr>
								</thead>
								<tbody>
									{seguimientos.map((seg) => (
										<tr key={seg.id_seguimiento} style={{ borderBottom: '1px solid #eee' }}>
											<td style={{ padding: '12px' }}>
												{dayjs(seg.fecha_contacto).format('DD/MM/YYYY')}
											</td>
											<td style={{ padding: '12px' }}>
												<Chip
													label={seg.tipo_seguimiento}
													size="small"
													color={
														seg.tipo_seguimiento === 'juridico'
															? 'error'
															: seg.tipo_seguimiento === 'coercitivo'
															? 'warning'
															: 'info'
													}
												/>
											</td>
											<td style={{ padding: '12px' }}>{seg.descripcion}</td>
										</tr>
									))}
								</tbody>
							</table>
						</Box>
					)}
				</CardContent>
			</Card>
		</PageLayout>
	)
}