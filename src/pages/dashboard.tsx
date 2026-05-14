import { useState, useEffect } from 'react'
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material'
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveBar } from '@nivo/bar'
import { PageLayout } from '@/components/layouts/PageLayout'
import useNotifier from '@/hooks/useNotifier'
import { getIncapacidades } from '@/services/api/incapacidades'
import { Incapacidad } from '@/types/api'
import { getCarteraEstadisticas, getResumenEntidad, getAlertasVencimiento, getResumenEjecutivo, getReporteVencimientos } from '@/services/api/cartera'
import { usePermission } from '@/hooks/usePermission'
import dayjs from 'dayjs'

interface KpiCardProps {
	title: string
	value: string | number
	subtitle?: string
	color?: string
}

const KpiCard = ({ title, value, subtitle, color }: KpiCardProps) => (
	<Card sx={{ height: '100%' }}>
		<CardContent>
			<Typography variant="body2" color="text.secondary" gutterBottom>
				{title}
			</Typography>
			<Typography
				variant="h4"
				fontWeight="bold"
				sx={{ color: color || 'text.primary' }}
			>
				{value}
			</Typography>
			{subtitle && (
				<Typography variant="caption" color="text.secondary">
					{subtitle}
				</Typography>
			)}
		</CardContent>
	</Card>
)

const ESTADO_COLORS: Record<string, string> = {
	recibida: '#2196f3',
	validada: '#4caf50',
	transcrita: '#ff9800',
	cobrada: '#9c27b0',
	pagada: '#4caf50',
	rechazada: '#f44336',
	pendiente: '#ff9800',
}

export default function DashboardPage() {
	const { enqueueSnackbar } = useNotifier()
	const { hasPermission } = usePermission()
	const showError = (msg: string) => enqueueSnackbar(msg, { variant: 'error' })

	const [loading, setLoading] = useState(true)
	const [stats, setStats] = useState<{
		total_cartera: string
		total_pagado: string
		total_pendiente: string
		total_vencido: string
		cantidad_incapacidades: number
		cantidad_pagos_pendientes: number
	} | null>(null)
	const [incapacidadesActivas, setActivas] = useState(0)
	const [incapacidadesPendientes, setPendientes] = useState(0)
	const [incapacidadesPagadas, setPagadas] = useState(0)
	const [alertas, setAlertas] = useState(0)
	const [vencidos, setVencidos] = useState<{ entidad: string; cantidad: number; total_deuda: string }[]>([])
	const [resumenEjecutivo, setResumenEjecutivo] = useState<{
		fecha_generacion: string
		incapacidades_activas: number
		pagos_pendientes: number
		pagos_vencidos: number
		total_dias_perdidos: number
		total_incapacidades: number
		total_valor_cartera: string
		total_valor_cobrado: string
		total_valor_pendiente: string
	} | null>(null)
	const [carteraStats, setCarteraStats] = useState<{
		total_cartera: string
		total_pagado: string
		total_pendiente: string
		total_vencido: string
		cantidad_incapacidades: number
		cantidad_pagos_pendientes: number
	} | null>(null)
	const [alertasVencimiento, setAlertasVencimiento] = useState<{
		IDIncapacidad: number
		NombreEntidad: string
		DiasVencido: number
		Estado: string
		TipoAlerta: string
		FechaLimitePago: string
		Mensaje: string
	}[]>([])
	const [recentIncapacidades, setRecentIncapacidades] = useState<Incapacidad[]>([])
	const [estadoData, setEstadoData] = useState<{ id: string; label: string; value: number; color: string }[]>([])
	const [entidadData, setEntidadData] = useState<{ entidad: string; cantidad: number }[]>([])

	const canViewReports = hasPermission('consultar_reportes')

	useEffect(() => {
		loadDashboardData()
	}, [])

	const loadDashboardData = async () => {
		setLoading(true)
		try {
			const [incapRes, statsRes, alertasRes, vencRes, resumenRes] = await Promise.all([
				getIncapacidades({ page: 1, limit: 50 }),
				canViewReports ? getCarteraEstadisticas() : Promise.resolve(null),
				canViewReports ? getAlertasVencimiento({}) : Promise.resolve(null),
				canViewReports ? getReporteVencimientos() : Promise.resolve(null),
				canViewReports ? getResumenEjecutivo() : Promise.resolve(null),
			])

			const allIncapacidades = incapRes.data.data.items

			const estadoCounts: Record<string, number> = {}
			const entidadCounts: Record<string, number> = {}

			allIncapacidades.forEach((inc) => {
				const estado = inc.estado?.nombre?.toLowerCase() || 'desconocido'
				estadoCounts[estado] = (estadoCounts[estado] || 0) + 1

				const entidad = inc.entidad?.nombre || 'Sin entidad'
				entidadCounts[entidad] = (entidadCounts[entidad] || 0) + 1
			})

			setEstadoData(
				Object.entries(estadoCounts).map(([key, value]) => ({
					id: key,
					label: key.charAt(0).toUpperCase() + key.slice(1),
					value,
					color: ESTADO_COLORS[key] || '#999',
				}))
			)

			setEntidadData(
				Object.entries(entidadCounts).map(([entidad, cantidad]) => ({
					entidad,
					cantidad,
				}))
			)

			setRecentIncapacidades(allIncapacidades.slice(0, 5))

			setActivas(allIncapacidades.length)
			setPendientes(
				allIncapacidades.filter((i) =>
					i.estado?.nombre?.toLowerCase().includes('pendiente')
				).length
			)
			setPagadas(
				allIncapacidades.filter((i) =>
					i.estado?.nombre?.toLowerCase().includes('pagada')
				).length
			)

			if (statsRes && statsRes.data?.data) {
				const data = statsRes.data.data as any
				setCarteraStats({
					total_cartera: data.TotalValorCartera || data.total_cartera || '0',
					total_pagado: data.TotalValorCobrado || data.total_pagado || '0',
					total_pendiente: data.TotalValorPendiente || data.total_pendiente || '0',
					total_vencido: '0',
					cantidad_incapacidades: data.TotalIncapacidades || 0,
					cantidad_pagos_pendientes: data.PagosPendientes || 0,
				})
			}

			if (alertasRes && alertasRes.data?.data) {
				setAlertasVencimiento(alertasRes.data.data.map((a: any) => ({
					IDIncapacidad: a.id_incapacidad,
					NombreEntidad: a.nombre_entidad || 'Sin entidad',
					DiasVencido: Math.abs(a.dias_restantes || 0),
					Estado: a.Estado || 'Pendiente',
					TipoAlerta: a.tipo_alerta,
					FechaLimitePago: a.fecha_vencimiento,
					Mensaje: a.mensaje,
				})))
				setAlertas(alertasRes.data.data.length)
			}

			if (vencRes && (vencRes.data as any)?.data?.AlertasPagos) {
				const pagos = (vencRes.data as any).data.AlertasPagos
				const entidadCounts: Record<string, { cantidad: number; total_deuda: string }> = {}
				pagos.forEach((p: any) => {
					const entidad = p.NombreEntidad || 'Sin entidad'
					if (!entidadCounts[entidad]) {
						entidadCounts[entidad] = { cantidad: 0, total_deuda: '0' }
					}
					entidadCounts[entidad].cantidad += 1
					entidadCounts[entidad].total_deuda = String(
						parseFloat(entidadCounts[entidad].total_deuda) + parseFloat(p.Valor || '0')
					)
				})
				setVencidos(
					Object.entries(entidadCounts).map(([entidad, data]) => ({
						entidad,
						cantidad: data.cantidad,
						total_deuda: data.total_deuda,
					}))
				)
			}

			if (resumenRes && resumenRes.data?.data) {
				const data = resumenRes.data.data as any
				setResumenEjecutivo({
					fecha_generacion: data.fecha_generacion || '',
					incapacidades_activas: data.incapacidades_activas ?? data.IncapacidadesActivas ?? 0,
					pagos_pendientes: data.pagos_pendientes ?? data.PagosPendientes ?? 0,
					pagos_vencidos: data.pagos_vencidos ?? data.PagosVencidos ?? 0,
					total_dias_perdidos: data.total_dias_perdidos ?? 0,
					total_incapacidades: data.total_incapacidades ?? 0,
					total_valor_cartera: data.total_valor_cartera ?? data.total_cartera ?? '0',
					total_valor_cobrado: data.total_valor_cobrado ?? data.total_pagado ?? '0',
					total_valor_pendiente: data.total_valor_pendiente ?? data.total_pendiente ?? '0',
				})
			}
		} catch (error) {
			showError('Error al cargar datos del dashboard')
		} finally {
			setLoading(false)
		}
	}

	const chartColors = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#d32f2f', '#0097a7', '#512da8']

	return (
		<PageLayout title="Dashboard">
			<Box sx={{ mb: 4 }}>
				<Typography variant="h5" gutterBottom>
					Resumen del Sistema
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{dayjs().format('dddd, D [de] MMMM [de] YYYY')}
				</Typography>
			</Box>

			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} md={3}>
					<KpiCard title="Total Incapacidades" value={resumenEjecutivo?.total_incapacidades ?? incapacidadesActivas} color="#1976d2" />
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<KpiCard title="Incapacidades Activas" value={resumenEjecutivo?.incapacidades_activas ?? incapacidadesActivas} color="#1976d2" />
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<KpiCard title="Pagos Pendientes" value={resumenEjecutivo?.pagos_pendientes ?? 0} color="#f57c00" />
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<KpiCard title="Pagos Vencidos" value={resumenEjecutivo?.pagos_vencidos ?? alertas} color="#d32f2f" />
				</Grid>

				{carteraStats && (
					<>
						<Grid item xs={12} sm={6} md={3}>
							<KpiCard
								title="Total Cartera"
								value={`$${parseFloat(carteraStats.total_cartera || '0').toLocaleString()}`}
								color="#7b1fa6"
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<KpiCard
								title="Total Pagado"
								value={`$${parseFloat(carteraStats.total_pagado || '0').toLocaleString()}`}
								color="#388e3c"
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<KpiCard
								title="Total Pendiente"
								value={`$${parseFloat(carteraStats.total_pendiente || '0').toLocaleString()}`}
								color="#f57c00"
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<KpiCard
								title="Total Vencido"
								value={`$${parseFloat(carteraStats.total_vencido || '0').toLocaleString()}`}
								color="#d32f2f"
							/>
						</Grid>
					</>
				)}
			</Grid>

			{estadoData.length > 0 && (
				<Grid container spacing={3} sx={{ mt: 2 }}>
					<Grid item xs={12} md={6}>
						<Card sx={{ height: 300 }}>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Estados de Incapacidades
								</Typography>
								<Box sx={{ height: 220 }}>
									<ResponsivePie
										data={estadoData}
										margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
										innerRadius={0.6}
										colors={{ datum: 'data.color' }}
										enableArcLabels={false}
										enableArcLinkLabels={false}
										legends={[]}
									/>
								</Box>
								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
									{estadoData.map((item) => (
										<Chip
											key={item.id}
											label={`${item.label}: ${item.value}`}
											size="small"
											sx={{ backgroundColor: item.color, color: '#fff' }}
										/>
									))}
								</Box>
							</CardContent>
						</Card>
					</Grid>

					<Grid item xs={12} md={6}>
						<Card sx={{ height: 300 }}>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Incapacidades por Entidad
								</Typography>
								<Box sx={{ height: 250 }}>
									<ResponsiveBar
										data={entidadData}
										keys={['cantidad']}
										indexBy="entidad"
										margin={{ top: 10, right: 10, bottom: 50, left: 40 }}
										padding={0.3}
										colors={chartColors}
										axisBottom={{
											tickSize: 0,
											tickPadding: 10,
											tickRotation: -45,
										}}
										axisLeft={{
											tickSize: 0,
											tickPadding: 5,
										}}
										enableGridY={false}
										enableLabel={false}
										legends={[]}
									/>
								</Box>
							</CardContent>
						</Card>
					</Grid>

					{vencidos.length > 0 && (
						<Grid item xs={12}>
							<Card>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										Pagos Vencidos
									</Typography>
									<Box sx={{ overflowX: 'auto' }}>
										<table style={{ width: '100%', borderCollapse: 'collapse' }}>
											<thead>
												<tr style={{ backgroundColor: '#f5f5f5' }}>
													<th style={{ padding: '8px 12px', textAlign: 'left' }}>Entidad</th>
													<th style={{ padding: '8px 12px', textAlign: 'right' }}>Casos</th>
													<th style={{ padding: '8px 12px', textAlign: 'right' }}>Total Deuda</th>
												</tr>
											</thead>
											<tbody>
												{vencidos.map((v, idx) => (
													<tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
														<td style={{ padding: '8px 12px' }}>{v.entidad}</td>
														<td style={{ padding: '8px 12px', textAlign: 'right' }}>{v.cantidad}</td>
														<td style={{ padding: '8px 12px', textAlign: 'right' }}>
															${parseFloat(v.total_deuda || '0').toLocaleString()}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					)}

					{alertasVencimiento.length > 0 && (
						<Grid item xs={12}>
							<Card>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										Alertas de Vencimiento
									</Typography>
									<Box sx={{ overflowX: 'auto' }}>
										<table style={{ width: '100%', borderCollapse: 'collapse' }}>
											<thead>
												<tr style={{ backgroundColor: '#f5f5f5' }}>
													<th style={{ padding: '8px 12px', textAlign: 'left' }}>ID</th>
													<th style={{ padding: '8px 12px', textAlign: 'left' }}>Entidad</th>
													<th style={{ padding: '8px 12px', textAlign: 'center' }}>Días</th>
													<th style={{ padding: '8px 12px', textAlign: 'center' }}>Tipo</th>
													<th style={{ padding: '8px 12px', textAlign: 'left' }}>Mensaje</th>
												</tr>
											</thead>
											<tbody>
												{alertasVencimiento.map((a, idx) => (
													<tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
														<td style={{ padding: '8px 12px' }}>{a.IDIncapacidad}</td>
														<td style={{ padding: '8px 12px' }}>{a.NombreEntidad}</td>
														<td style={{ padding: '8px 12px', textAlign: 'center' }}>
															<Chip
																label={`${a.DiasVencido} días`}
																size="small"
																color={a.DiasVencido > 90 ? 'error' : a.DiasVencido > 30 ? 'warning' : 'default'}
															/>
														</td>
														<td style={{ padding: '8px 12px', textAlign: 'center' }}>
															<Chip
																label={a.TipoAlerta}
																size="small"
																color={a.TipoAlerta === 'Crítico' ? 'error' : 'warning'}
															/>
														</td>
														<td style={{ padding: '8px 12px' }}>{a.Mensaje}</td>
													</tr>
												))}
											</tbody>
										</table>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					)}
				</Grid>
			)}

			<Box sx={{ mt: 4 }}>
				<Typography variant="h6" gutterBottom>
					Incapacidades Recientes
				</Typography>
				<Card>
					<CardContent sx={{ p: 0 }}>
						{recentIncapacidades.length === 0 ? (
							<Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
								No hay incapacidades registradas
							</Typography>
						) : (
							<Box sx={{ overflowX: 'auto' }}>
								<table style={{ width: '100%', borderCollapse: 'collapse' }}>
									<thead>
										<tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
											<th style={{ padding: '12px 16px', textAlign: 'left' }}>ID</th>
											<th style={{ padding: '12px 16px', textAlign: 'left' }}>Título</th>
											<th style={{ padding: '12px 16px', textAlign: 'left' }}>Tipo</th>
											<th style={{ padding: '12px 16px', textAlign: 'left' }}>Entidad</th>
											<th style={{ padding: '12px 16px', textAlign: 'left' }}>Estado</th>
											<th style={{ padding: '12px 16px', textAlign: 'left' }}>Fecha</th>
										</tr>
									</thead>
									<tbody>
										{recentIncapacidades.map((inc) => (
											<tr key={inc.id_incapacidad} style={{ borderBottom: '1px solid #eee' }}>
												<td style={{ padding: '12px 16px' }}>{inc.id_incapacidad}</td>
												<td style={{ padding: '12px 16px' }}>{inc.titulo}</td>
												<td style={{ padding: '12px 16px' }}>{inc.tipo?.nombre}</td>
												<td style={{ padding: '12px 16px' }}>{inc.entidad?.nombre}</td>
												<td style={{ padding: '12px 16px' }}>
													<Chip
														label={inc.estado?.nombre || '-'}
														size="small"
														color={
															inc.estado?.nombre?.toLowerCase().includes('pagada')
																? 'success'
																: inc.estado?.nombre?.toLowerCase().includes('rechazada')
																? 'error'
																: 'default'
														}
													/>
												</td>
												<td style={{ padding: '12px 16px' }}>
													{dayjs(inc.fecha_inicio).format('DD/MM/YYYY')}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</Box>
						)}
					</CardContent>
				</Card>
			</Box>
		</PageLayout>
	)
}