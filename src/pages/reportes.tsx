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
	Card,
	CardContent,
	Grid,
	Tabs,
	Tab,
	Chip,
} from '@mui/material'
import {
	generateReporte,
	getResumenEjecutivo,
	getReporteVencimientos,
} from '@/services/api/cartera'
import { getEntidades, getEstadosIncapacidad, getTiposIncapacidad } from '@/services/api/incapacidades'
import {
	ReporteData,
	ResumenEjecutivo,
	CarteraVencida,
	Entidad,
	EstadoIncapacidad,
	TipoIncapacidad,
} from '@/types/api'
import { usePermission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'
import { PageLayout } from '@/components/layouts/PageLayout'
import { Table } from '@/components/Table'
import dayjs from 'dayjs'
import AssessmentIcon from '@mui/icons-material/Assessment'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import WarningIcon from '@mui/icons-material/Warning'

const TIPO_REPORTE_LABELS: Record<string, string> = {
	incapacidades: 'Incapacidades por Entidad',
	ausentismo: 'Ausentismo',
	cartera: 'Cartera Vencida',
	juridico: 'Casos Jurídicos',
	'sg-sst': 'Reporte SG-SST',
}

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

export default function ReportesPage() {
	const { enqueueSnackbar } = useNotifier()
	const { hasPermission } = usePermission()
	const showError = (msg: string) => enqueueSnackbar(msg, { variant: 'error' })
	const showSuccess = (msg: string) => enqueueSnackbar(msg, { variant: 'success' })

	const canViewReports = hasPermission('consultar_reportes')

	const [tabValue, setTabValue] = useState(0)
	const [tipoReporte, setTipoReporte] = useState('incapacidades')
	const [loading, setLoading] = useState(false)
	const [generating, setGenerating] = useState(false)

	const [fechaInicio, setFechaInicio] = useState(dayjs().startOf('month').format('YYYY-MM-DD'))
	const [fechaFin, setFechaFin] = useState(dayjs().endOf('month').format('YYYY-MM-DD'))
	const [idEntidad, setIdEntidad] = useState<number | ''>('')

	const [entidades, setEntidades] = useState<Entidad[]>([])
	const [estados, setEstados] = useState<EstadoIncapacidad[]>([])
	const [tipos, setTipos] = useState<TipoIncapacidad[]>([])

	const [reporteData, setReporteData] = useState<ReporteData | null>(null)
	const [resumen, setResumen] = useState<ResumenEjecutivo | null>(null)
	const [vencimientos, setVencimientos] = useState<CarteraVencida[]>([])

	const [estadoFilter, setEstadoFilter] = useState<string>('')
	const [tipoFilter, setTipoFilter] = useState<string>('')

	useEffect(() => {
		if (canViewReports) {
			loadCatalogos()
			loadResumenEjecutivo()
		}
	}, [canViewReports])

	const loadCatalogos = async () => {
		try {
			const [entRes, estRes, tipRes] = await Promise.all([
				getEntidades(),
				getEstadosIncapacidad(),
				getTiposIncapacidad(),
			])
			setEntidades(entRes.data.data || [])
			setEstados(estRes.data.data || [])
			setTipos(tipRes.data.data || [])
		} catch (error) {
			showError('Error al cargar catálogos')
		}
	}

	const loadResumenEjecutivo = async () => {
		try {
			const res = await getResumenEjecutivo()
			setResumen(res.data.data || null)
		} catch {
		}
	}

	const handleGenerarReporte = async () => {
		setGenerating(true)
		try {
			const res = await generateReporte({
				tipo_reporte: tipoReporte as any,
				fecha_inicio: fechaInicio,
				fecha_fin: fechaFin,
				id_entidad: idEntidad || undefined,
			})
			setReporteData(res.data.data || null)
			showSuccess('Reporte generado')
		} catch (error) {
			showError('Error al generar reporte')
		} finally {
			setGenerating(false)
		}
	}

	const handleLoadVencimientos = async () => {
		setLoading(true)
		try {
			const res = await getReporteVencimientos()
			setVencimientos(res.data.data || [])
		} catch (error) {
			showError('Error al cargar vencimientos')
		} finally {
			setLoading(false)
		}
	}

	const getColumnsForReporte = () => {
		if (!reporteData?.items?.length) return []

		const firstItem = reporteData.items[0]
		const keys = Object.keys(firstItem)

		return keys.map((key) => ({
			id: key,
			label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
			minWidth: 120,
		}))
	}

	const getFilteredItems = () => {
		if (!reporteData?.items) return []

		return reporteData.items.filter((item) => {
			if (estadoFilter && item.estado !== estadoFilter) return false
			if (tipoFilter && item.tipo !== tipoFilter) return false
			return true
		})
	}

	if (!canViewReports) {
		return (
			<PageLayout title="Reportes">
				<Typography color="error">No tiene permisos para ver reportes</Typography>
			</PageLayout>
		)
	}

	return (
		<PageLayout title="Reportes">
			<Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
				<Tab label="Generar Reporte" />
				<Tab label="Resumen Ejecutivo" />
				<Tab label="SG-SST" />
			</Tabs>

			<TabPanel value={tabValue} index={0}>
				<Card sx={{ mb: 3 }}>
					<CardContent>
						<Grid container spacing={2} alignItems="center">
							<Grid item xs={12} sm={6} md={3}>
								<TextField
									select
									label="Tipo de Reporte"
									value={tipoReporte}
									onChange={(e) => setTipoReporte(e.target.value)}
									fullWidth
									size="small"
								>
									{Object.entries(TIPO_REPORTE_LABELS).map(([value, label]) => (
										<MenuItem key={value} value={value}>
											{label}
										</MenuItem>
									))}
								</TextField>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<TextField
									label="Fecha Inicio"
									type="date"
									value={fechaInicio}
									onChange={(e) => setFechaInicio(e.target.value)}
									fullWidth
									size="small"
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<TextField
									label="Fecha Fin"
									type="date"
									value={fechaFin}
									onChange={(e) => setFechaFin(e.target.value)}
									fullWidth
									size="small"
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<TextField
									select
									label="Entidad"
									value={idEntidad}
									onChange={(e) => {
										const val = e.target.value
										setIdEntidad(val === '' ? '' : Number(val))
									}}
									fullWidth
									size="small"
								>
									<MenuItem value="">Todas</MenuItem>
									{entidades.map((e) => (
										<MenuItem key={e.id_entidad} value={e.id_entidad}>
											{e.nombre}
										</MenuItem>
									))}
								</TextField>
							</Grid>
						</Grid>
						<Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
							<Button
								variant="contained"
								startIcon={<AssessmentIcon />}
								onClick={handleGenerarReporte}
								disabled={generating}
							>
								{generating ? 'Generando...' : 'Generar Reporte'}
							</Button>
						</Box>
					</CardContent>
				</Card>

				{reporteData && (
					<>
						<Card sx={{ mb: 2 }}>
							<CardContent>
								<Typography variant="subtitle2" color="text.secondary">
									Reporte: {TIPO_REPORTE_LABELS[reporteData.tipo_reporte] || reporteData.tipo_reporte}
								</Typography>
								<Typography variant="caption">
									Periodo: {dayjs(reporteData.fecha_inicio).format('DD/MM/YYYY')} -{' '}
									{dayjs(reporteData.fecha_fin).format('DD/MM/YYYY')}
								</Typography>
							</CardContent>
						</Card>

						<Card sx={{ mb: 2 }}>
							<CardContent>
								<Stack direction="row" spacing={2} alignItems="center">
									<TextField
										select
										label="Filtrar por Estado"
										value={estadoFilter}
										onChange={(e) => setEstadoFilter(e.target.value)}
										size="small"
										sx={{ minWidth: 200 }}
									>
										<MenuItem value="">Todos</MenuItem>
										{estados.map((e) => (
											<MenuItem key={e.id_estado} value={e.nombre}>
												{e.nombre}
											</MenuItem>
										))}
									</TextField>
									<TextField
										select
										label="Filtrar por Tipo"
										value={tipoFilter}
										onChange={(e) => setTipoFilter(e.target.value)}
										size="small"
										sx={{ minWidth: 200 }}
									>
										<MenuItem value="">Todos</MenuItem>
										{tipos.map((t) => (
											<MenuItem key={t.id_tipo} value={t.nombre}>
												{t.nombre}
											</MenuItem>
										))}
									</TextField>
									<Typography variant="body2" color="text.secondary">
										{getFilteredItems().length} registros
									</Typography>
								</Stack>
							</CardContent>
						</Card>

						<Table
							columns={getColumnsForReporte()}
							data={getFilteredItems() as any[]}
							loading={generating}
							emptyMessage="No hay datos para el reporte"
						/>
					</>
				)}
			</TabPanel>

			<TabPanel value={tabValue} index={1}>
				{resumen && (
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6} md={4}>
							<Card>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										Incapacidades Activas
									</Typography>
									<Typography variant="h4" fontWeight="bold">
										{resumen.incapacidades_activas}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<Card>
								<CardContent>
									<Typography variant="body2" color="text.secondary">Pendientes</Typography>
									<Typography variant="h4" fontWeight="bold" color="warning.main">
										{resumen.pendientes}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<Card>
								<CardContent>
									<Typography variant="body2" color="text.secondary">Pagadas</Typography>
									<Typography variant="h4" fontWeight="bold" color="success.main">
										{resumen.pagadas}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<Card>
								<CardContent>
									<Typography variant="body2" color="text.secondary">Rechazadas</Typography>
									<Typography variant="h4" fontWeight="bold" color="error.main">
										{resumen.rechazadas}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<Card>
								<CardContent>
									<Typography variant="body2" color="text.secondary">Total Cartera</Typography>
									<Typography variant="h4" fontWeight="bold">
										${Number(resumen.total_cartera).toLocaleString()}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<Card>
								<CardContent>
									<Typography variant="body2" color="text.secondary">Total Pagado</Typography>
									<Typography variant="h4" fontWeight="bold" color="success.main">
										${Number(resumen.total_pagado).toLocaleString()}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12}>
							<Card sx={{ backgroundColor: 'warning.light' }}>
								<CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
									<WarningIcon color="warning" />
									<Box>
										<Typography variant="body2" fontWeight={600}>
											Alertas de Vencimiento
										</Typography>
										<Typography variant="h5" fontWeight="bold">
											{resumen.alertas_vencimiento}
										</Typography>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				)}
			</TabPanel>

			<TabPanel value={tabValue} index={2}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Typography variant="h6" gutterBottom>
							Indicadores SG-SST
						</Typography>
					</Grid>

					<Grid item xs={12} sm={6} md={4}>
						<Card>
							<CardContent>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
									<TrendingUpIcon color="primary" />
									<Typography variant="subtitle2">Indicadores de Ausentismo</Typography>
								</Box>
								<Typography variant="caption" color="text.secondary">
									(Incluido en reporte de incapacidades)
								</Typography>
							</CardContent>
						</Card>
					</Grid>

					<Grid item xs={12} sm={6} md={4}>
						<Card>
							<CardContent>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
									<WarningIcon color="error" />
									<Typography variant="subtitle2">Días Perdidos</Typography>
								</Box>
								<Typography variant="caption" color="text.secondary">
									(Incluido en reporte de incapacidades)
								</Typography>
							</CardContent>
						</Card>
					</Grid>

					<Grid item xs={12} sm={6} md={4}>
						<Card>
							<CardContent>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
									<AssessmentIcon color="primary" />
									<Typography variant="subtitle2">Incapacidades {'>'}180 días</Typography>
								</Box>
								<Button
									variant="outlined"
									size="small"
									onClick={handleLoadVencimientos}
									disabled={loading}
								>
									{loading ? 'Cargando...' : 'Ver Casos Extendedidos'}
								</Button>
							</CardContent>
						</Card>
					</Grid>

					{vencimientos.length > 0 && (
						<Grid item xs={12}>
							<Card>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										Incapacidades Extendedidas ({'>'}180 días)
									</Typography>
									<Table
										columns={[
											{ id: 'id_incapacidad', label: 'ID', width: 80 },
											{ id: 'dias_vencidos', label: 'Días Vencidos', width: 100 },
											{ id: 'valor_pendiente', label: 'Valor Pendiente', width: 150 },
											{ id: 'fecha_vencimiento', label: 'Fecha Vencimiento', width: 150 },
										]}
										data={vencimientos as any[]}
										loading={loading}
										emptyMessage="No hay casos extendedidos"
									/>
								</CardContent>
							</Card>
						</Grid>
					)}

					<Grid item xs={12}>
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Incapacidades Recurrentes
								</Typography>
								<Chip
									label="Requiere integración adicional con historial de incapacidades"
									color="info"
									sx={{ mt: 1 }}
								/>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</TabPanel>
		</PageLayout>
	)
}