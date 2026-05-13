import { useState, useEffect } from 'react'
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material'
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveBar } from '@nivo/bar'
import { PageLayout } from '@/components/layouts/PageLayout'
import useNotifier from '@/hooks/useNotifier'
import { getIncapacidades } from '@/services/api/incapacidades'
import { Incapacidad } from '@/types/api'
import {
	getCarteraEstadisticas,
	getResumenEntidad,
	getAlertasVencimiento,
} from '@/services/api/cartera'
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
			const [incapRes, statsRes, alertasRes] = await Promise.all([
				getIncapacidades({ page: 1, limit: 50 }),
				canViewReports ? getCarteraEstadisticas() : Promise.resolve(null),
				canViewReports ? getAlertasVencimiento({}) : Promise.resolve(null),
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

			if (statsRes) {
				setStats(statsRes.data.data)
			}

			if (alertasRes) {
				setAlertas(alertasRes.data.data.length)
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
					<KpiCard title="Incapacidades Activas" value={incapacidadesActivas} color="#1976d2" />
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<KpiCard title="Pendientes" value={incapacidadesPendientes} color="#f57c00" />
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<KpiCard title="Pagadas" value={incapacidadesPagadas} color="#388e3c" />
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<KpiCard title="Alertas Vencimiento" value={alertas} color="#d32f2f" />
				</Grid>

				{canViewReports && stats && (
					<>
						<Grid item xs={12} sm={6} md={3}>
							<KpiCard
								title="Total Cartera"
								value={`$${parseFloat(stats.total_cartera || '0').toLocaleString()}`}
								color="#7b1fa2"
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<KpiCard
								title="Total Pagado"
								value={`$${parseFloat(stats.total_pagado || '0').toLocaleString()}`}
								color="#388e3c"
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<KpiCard
								title="Total Pendiente"
								value={`$${parseFloat(stats.total_pendiente || '0').toLocaleString()}`}
								color="#f57c00"
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<KpiCard
								title="Total Vencido"
								value={`$${parseFloat(stats.total_vencido || '0').toLocaleString()}`}
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