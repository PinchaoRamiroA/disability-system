import { useState, useEffect } from 'react'
import {
	Box,
	Typography,
	Card,
	CardContent,
	Chip,
	Grid,
	Divider,
} from '@mui/material'
import { getCarteraVencida } from '@/services/api/cartera'
import { getSeguimientos } from '@/services/api/cobros'
import { CarteraVencida, SeguimientoCobro } from '@/types/api'
import { usePermission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'
import { PageLayout } from '@/components/layouts/PageLayout'
import dayjs from 'dayjs'

export default function JuridicoPage() {
	const { hasPermission } = usePermission()
	const { enqueueSnackbar } = useNotifier()
	const showError = (msg: string) => enqueueSnackbar(msg, { variant: 'error' })

	const [casosCriticos, setCasosCriticos] = useState<CarteraVencida[]>([])
	const [seguimientos, setSeguimientos] = useState<SeguimientoCobro[]>([])
	const [loading, setLoading] = useState(false)

	const canManage = hasPermission('gestionar_cobro_juridico')

	useEffect(() => {
		if (canManage) {
			loadData()
		}
	}, [canManage])

	const loadData = async () => {
		setLoading(true)
		try {
			const [vencRes, segRes] = await Promise.all([
				getCarteraVencida(),
				getSeguimientos({ tipo_seguimiento: 'juridico', limit: 50 }),
			])
			setCasosCriticos(vencRes.data.data)
			setSeguimientos(segRes.data.data.items)
		} catch (error) {
			showError('Error al cargar datos')
		} finally {
			setLoading(false)
		}
	}

	if (!canManage) {
		return (
			<PageLayout title="Cobro Jurídico">
				<Typography color="error">
					No tiene permisos para acceder a esta sección
				</Typography>
			</PageLayout>
		)
	}

	const casos180 = casosCriticos.filter((c) => c.dias_vencidos > 180)
	const casos90 = casosCriticos.filter((c) => c.dias_vencidos > 90 && c.dias_vencidos <= 180)
	const casos60 = casosCriticos.filter((c) => c.dias_vencidos > 60 && c.dias_vencidos <= 90)

	const totalDeuda = casosCriticos.reduce(
		(acc, c) => acc + parseFloat(c.valor_pendiente || '0'),
		0
	)

	return (
		<PageLayout title="Cobro Jurídico">
			<Box sx={{ mb: 3 }}>
				<Typography variant="body2" color="text.secondary">
					Total casos en cobro jurídico: {casosCriticos.length} | Deuda total: $
					{totalDeuda.toLocaleString()}
				</Typography>
			</Box>

			<Grid container spacing={3}>
				<Grid item xs={12} md={4}>
					<Card sx={{ height: '100%' }}>
						<CardContent>
							<Typography variant="h6" color="error" gutterBottom>
								Casos &gt;180 días
							</Typography>
							<Typography variant="h3" gutterBottom>
								{casos180.length}
							</Typography>
							<Divider />
							<Box sx={{ mt: 2 }}>
								{casos90.map((caso) => (
									<Box key={caso.id_incapacidad} sx={{ mb: 2 }}>
										<Typography variant="body2" fontWeight={500}>
											{caso.incapacidad?.titulo}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{caso.entidad?.nombre} - ${parseFloat(caso.valor_pendiente).toLocaleString()}
										</Typography>
									</Box>
								))}
								{casos180.length === 0 && (
									<Typography variant="body2" color="text.secondary">
										No hay casos en esta categoría
									</Typography>
								)}
							</Box>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={4}>
					<Card sx={{ height: '100%' }}>
						<CardContent>
							<Typography variant="h6" color="warning" gutterBottom>
								Casos 90-180 días
							</Typography>
							<Typography variant="h3" gutterBottom>
								{casos90.length}
							</Typography>
							<Divider />
							<Box sx={{ mt: 2 }}>
								{casos90.map((caso) => (
									<Box key={caso.id_incapacidad} sx={{ mb: 2 }}>
										<Typography variant="body2" fontWeight={500}>
											{caso.incapacidad?.titulo}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{caso.entidad?.nombre} - ${parseFloat(caso.valor_pendiente).toLocaleString()}
										</Typography>
									</Box>
								))}
								{casos90.length === 0 && (
									<Typography variant="body2" color="text.secondary">
										No hay casos en esta categoría
									</Typography>
								)}
							</Box>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={4}>
					<Card sx={{ height: '100%' }}>
						<CardContent>
							<Typography variant="h6" color="info" gutterBottom>
								Casos 60-90 días
							</Typography>
							<Typography variant="h3" gutterBottom>
								{casos60.length}
							</Typography>
							<Divider />
							<Box sx={{ mt: 2 }}>
								{casos60.map((caso) => (
									<Box key={caso.id_incapacidad} sx={{ mb: 2 }}>
										<Typography variant="body2" fontWeight={500}>
											{caso.incapacidad?.titulo}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{caso.entidad?.nombre} - ${parseFloat(caso.valor_pendiente).toLocaleString()}
										</Typography>
									</Box>
								))}
								{casos60.length === 0 && (
									<Typography variant="body2" color="text.secondary">
										No hay casos en esta categoría
									</Typography>
								)}
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			<Card sx={{ mt: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Todos los Casos en Cobro Jurídico
					</Typography>
					{casosCriticos.length === 0 ? (
						<Typography variant="body2" color="text.secondary">
							No hay casos en cobro jurídico
						</Typography>
					) : (
						<Box sx={{ overflowX: 'auto' }}>
							<table style={{ width: '100%', borderCollapse: 'collapse' }}>
								<thead>
									<tr style={{ backgroundColor: '#f5f5f5' }}>
										<th style={{ padding: '12px' }}>ID</th>
										<th style={{ padding: '12px' }}>Incapacidad</th>
										<th style={{ padding: '12px' }}>Entidad</th>
										<th style={{ padding: '12px' }}>Valor Pendiente</th>
										<th style={{ padding: '12px' }}>Días Vencido</th>
										<th style={{ padding: '12px' }}>Fecha Vencimiento</th>
									</tr>
								</thead>
								<tbody>
									{casosCriticos.map((caso) => (
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
													color={caso.dias_vencidos > 180 ? 'error' : caso.dias_vencidos > 90 ? 'warning' : 'info'}
												/>
											</td>
											<td style={{ padding: '12px' }}>
												{dayjs(caso.fecha_vencimiento).format('DD/MM/YYYY')}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</Box>
					)}
				</CardContent>
			</Card>

			<Card sx={{ mt: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Seguimientos Jurídicos
					</Typography>
					{seguimientos.length === 0 ? (
						<Typography variant="body2" color="text.secondary">
							No hay seguimientos jurídicos
						</Typography>
					) : (
						<Box sx={{ overflowX: 'auto' }}>
							<table style={{ width: '100%', borderCollapse: 'collapse' }}>
								<thead>
									<tr style={{ backgroundColor: '#f5f5f5' }}>
										<th style={{ padding: '12px' }}>Fecha</th>
										<th style={{ padding: '12px' }}>Descripción</th>
									</tr>
								</thead>
								<tbody>
									{seguimientos.map((seg) => (
										<tr key={seg.id_seguimiento} style={{ borderBottom: '1px solid #eee' }}>
											<td style={{ padding: '12px' }}>
												{dayjs(seg.fecha_contacto).format('DD/MM/YYYY')}
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