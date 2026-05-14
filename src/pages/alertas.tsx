import { useState, useEffect } from 'react'
import { Box, Typography, Card, CardContent, Grid, Chip, Button, Tabs, Tab } from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
import ErrorIcon from '@mui/icons-material/Error'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { PageLayout } from '@/components/layouts/PageLayout'
import useNotifier from '@/hooks/useNotifier'
import { getAlertasVencimiento } from '@/services/api/cartera'
import { getNotificaciones, markNotificacionAsRead, markAllNotificacionesAsRead, getCountNotificacionesNoLeidas } from '@/services/api/notificaciones'
import { AlertaVencimiento, Notificacion } from '@/types/api'
import { usePermission } from '@/hooks/usePermission'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'

const PRIORITY_CONFIG: Record<string, { color: 'error' | 'warning' | 'success'; icon?: React.ReactElement; label: string }> = {
	Alto: { color: 'error', icon: <ErrorIcon />, label: 'Alta' },
	Medio: { color: 'warning', icon: <CheckCircleIcon />, label: 'Media' },
	Bajo: { color: 'success', icon: <CheckCircleIcon />, label: 'Baja' },
	Crítico: { color: 'error', icon: <ErrorIcon />, label: 'Crítico' },
}

const TIPO_ALERTA_LABELS: Record<string, string> = {
	documentos_faltantes: 'Documentos Faltantes',
	pago_vencido: 'Pago Vencido',
	transcripcion_proxima: 'Transcripción Próxima',
	mas_90_dias: 'Más de 90 días',
}

interface AlertaCardProps {
	alerta: AlertaVencimiento
	onVer: () => void
}

const AlertaCard = ({ alerta, onVer }: AlertaCardProps) => {
	const priority = PRIORITY_CONFIG[alerta.prioridad as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.baja

	return (
		<Card
			sx={{
				height: '100%',
				borderLeft: '4px solid',
				borderColor: `${priority.color}.main`,
			}}
		>
			<CardContent>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
					<Chip
						icon={priority.icon}
						label={priority.label}
						color={priority.color as any}
						size="small"
					/>
					<Typography variant="caption" color="text.secondary">
						{dayjs(alerta.fecha_vencimiento).format('DD/MM/YYYY')}
					</Typography>
				</Box>

				<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					{alerta.mensaje}
				</Typography>

				{alerta.incapacidad && (
					<Box sx={{ mb: 1 }}>
						<Typography variant="caption" color="text.secondary">
							Incapacidad #{(alerta.incapacidad as any).id || (alerta.incapacidad as any).id_incapacidad}
						</Typography>
						<Typography variant="body2">
							{alerta.incapacidad.titulo}
						</Typography>
					</Box>
				)}

				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
					<Chip
						label={`${alerta.dias_restantes} días`}
						size="small"
						color={
							alerta.dias_restantes <= 0
								? 'error'
								: alerta.dias_restantes <= 5
								? 'warning'
								: 'default'
						}
					/>
					<Button
						size="small"
						startIcon={<VisibilityIcon />}
						onClick={onVer}
					>
						Ver
					</Button>
				</Box>
			</CardContent>
		</Card>
	)
}

interface NotificacionItemProps {
	notificacion: Notificacion
	onMarcarLeida: () => void
}

const NotificacionItem = ({ notificacion, onMarcarLeida }: NotificacionItemProps) => (
	<Card
		sx={{
			mb: 1,
			opacity: notificacion.leida ? 0.7 : 1,
			backgroundColor: notificacion.leida ? 'action.hover' : 'background.paper',
		}}
	>
		<CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
				<Box sx={{ flex: 1 }}>
					<Typography variant="subtitle2" fontWeight={notificacion.leida ? 400 : 600}>
						{notificacion.titulo}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{notificacion.mensaje}
					</Typography>
					<Typography variant="caption" color="text.secondary">
						{dayjs(notificacion.created_at).format('DD/MM/YYYY HH:mm')}
					</Typography>
				</Box>
				{!notificacion.leida && (
					<Button size="small" onClick={onMarcarLeida}>
						Marcar leída
					</Button>
				)}
			</Box>
		</CardContent>
	</Card>
)

export default function AlertasPage() {
	const router = useRouter()
	const { enqueueSnackbar } = useNotifier()
	const { hasPermission } = usePermission()
	const showError = (msg: string) => enqueueSnackbar(msg, { variant: 'error' })
	const showSuccess = (msg: string) => enqueueSnackbar(msg, { variant: 'success' })

	const [tabValue, setTabValue] = useState(0)
	const [loading, setLoading] = useState(true)
	const [alertas, setAlertas] = useState<AlertaVencimiento[]>([])
	const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
	const [unreadCount, setUnreadCount] = useState(0)

	const canViewAlerts = hasPermission('consultar_incapacidad') || hasPermission('consultar_reportes')

	useEffect(() => {
		if (canViewAlerts) {
			loadData()
		}
	}, [canViewAlerts])

	const loadData = async () => {
		setLoading(true)
		try {
			const [alertasRes, notifRes, countRes] = await Promise.all([
				getAlertasVencimiento({ dias_minimos: 0 }),
				getNotificaciones({ limit: 20 }),
				getCountNotificacionesNoLeidas().catch(() => null),
			])

			setAlertas(alertasRes.data.data || [])
			setNotificaciones(notifRes.data.data?.items || [])
			setUnreadCount(countRes?.data?.data?.count || 0)
		} catch (error) {
			showError('Error al cargar alertas')
		} finally {
			setLoading(false)
		}
	}

	const handleVerIncapacidad = (id: number) => {
		router.push(`/incapacidades/${id}`)
	}

	const handleMarcarLeida = async (id: number) => {
		try {
			await markNotificacionAsRead(id)
			setNotificaciones((prev) =>
				prev.map((n) => (n.id_notificacion === id ? { ...n, leida: true } : n))
			)
			setUnreadCount((prev) => Math.max(0, prev - 1))
		} catch (error) {
			showError('Error al marcar como leída')
		}
	}

	const handleMarcarTodasLeidas = async () => {
		try {
			await markAllNotificacionesAsRead()
			setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })))
			setUnreadCount(0)
			showSuccess('Todas las notificaciones marcadas como leídas')
		} catch (error) {
			showError('Error al marcar todas como leídas')
		}
	}
	if (!canViewAlerts) {
		return (
			<PageLayout title="Centro de Alertas">
				<Typography color="error">
					No tiene permisos para ver esta página
				</Typography>
			</PageLayout>
		)
	}

	return (
		<PageLayout title="Centro de Alertas">
			<Box sx={{ mb: 3 }}>
				<Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
					<Tab label={`Alertas (${alertas.length})`} />
					<Tab label={`Notificaciones (${unreadCount})`} />
				</Tabs>
			</Box>

			{tabValue === 0 && (
				<Box>
					{loading ? (
						<Typography>Cargando alertas...</Typography>
					) : alertas.length === 0 ? (
						<Card>
							<CardContent sx={{ textAlign: 'center', py: 4 }}>
								<CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
								<Typography variant="h6">No hay alertas pendientes</Typography>
								<Typography variant="body2" color="text.secondary">
									Todas las incapacidades están al día
								</Typography>
							</CardContent>
						</Card>
					) : (
						<Grid container spacing={3}>
							{alertas.map((alerta) => (
								<Grid item xs={12} sm={6} md={4} key={alerta.id_incapacidad}>
									<AlertaCard
										alerta={alerta}
										onVer={() => handleVerIncapacidad(alerta.id_incapacidad)}
									/>
								</Grid>
							))}
						</Grid>
					)}
				</Box>
			)}

			{tabValue === 1 && (
				<Box>
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
						<Button
							variant="outlined"
							onClick={handleMarcarTodasLeidas}
							disabled={unreadCount === 0}
						>
							Marcar todas como leídas
						</Button>
					</Box>

					{loading ? (
						<Typography>Cargando notificaciones...</Typography>
					) : notificaciones.length === 0 ? (
						<Card>
							<CardContent sx={{ textAlign: 'center', py: 4 }}>
								<Typography variant="h6">No hay notificaciones</Typography>
							</CardContent>
						</Card>
					) : (
						<Box>
							{notificaciones.map((notif) => (
								<NotificacionItem
									key={notif.id_notificacion}
									notificacion={notif}
									onMarcarLeida={() => handleMarcarLeida(notif.id_notificacion)}
								/>
							))}
						</Box>
					)}
				</Box>
			)}
		</PageLayout>
	)
}