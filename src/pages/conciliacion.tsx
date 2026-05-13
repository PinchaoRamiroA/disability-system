import { useState, useEffect } from 'react'
import {
	Box,
	Typography,
	Button,
	Stack,
	Chip,
	Card,
	CardContent,
	Checkbox,
	TextField,
	IconButton,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { getPagos, reconcilePago } from '@/services/api/cobros'
import { Pago } from '@/types/api'
import { usePermission } from '@/hooks/usePermission'
import useNotifier from '@/hooks/useNotifier'
import { PageLayout } from '@/components/layouts/PageLayout'
import dayjs from 'dayjs'

export default function ConciliacionPage() {
	const { hasPermission } = usePermission()
	const { enqueueSnackbar } = useNotifier()
	const showError = (msg: string) => enqueueSnackbar(msg, { variant: 'error' })
	const showSuccess = (msg: string) => enqueueSnackbar(msg, { variant: 'success' })

	const [pagos, setPagos] = useState<Pago[]>([])
	const [loading, setLoading] = useState(false)
	const [selected, setSelected] = useState<number[]>([])
	const [saving, setSaving] = useState(false)

	const canConciliar = hasPermission('realizar_conciliacion')

	useEffect(() => {
		if (canConciliar) {
			loadPagos()
		}
	}, [canConciliar])

	const loadPagos = async () => {
		setLoading(true)
		try {
			const res = await getPagos({ conciliado: false, limit: 50 })
			setPagos(res.data.data.items)
		} catch {
			showError('Error al cargar pagos')
		} finally {
			setLoading(false)
		}
	}

	const handleSelectAll = () => {
		if (selected.length === pagos.length) {
			setSelected([])
		} else {
			setSelected(pagos.map((p) => p.id_pago))
		}
	}

	const handleToggle = (id: number) => {
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		)
	}

	const handleConciliar = async () => {
		if (selected.length === 0) return

		setSaving(true)
		try {
			await Promise.all(
				selected.map((id) =>
					reconcilePago(id, { conciliado: true, estado_pago: 'conciliado' })
				)
			)
			showSuccess(`${selected.length} pagos conciliados`)
			setSelected([])
			loadPagos()
		} catch {
			showError('Error al conciliar pagos')
		} finally {
			setSaving(false)
		}
	}

	const totalValor = pagos
		.filter((p) => selected.includes(p.id_pago))
		.reduce((acc, p) => acc + parseFloat(p.valor || '0'), 0)

	if (!canConciliar) {
		return (
			<PageLayout title="Conciliación">
				<Typography color="error">
					No tiene permisos para acceder a esta sección
				</Typography>
			</PageLayout>
		)
	}

	return (
		<PageLayout title="Conciliación Contable">
			<Box sx={{ mb: 3 }}>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Typography variant="body2" color="text.secondary">
						{pagos.length} pagos pendientes de conciliación
					</Typography>
					<Stack direction="row" spacing={2} alignItems="center">
						{selected.length > 0 && (
							<>
								<Typography variant="body2">
									Seleccionados: {selected.length} | Total: $
									{totalValor.toLocaleString()}
								</Typography>
								<Button
									variant="contained"
									color="success"
									startIcon={<CheckIcon />}
									onClick={handleConciliar}
									disabled={saving}
								>
									Conciliar {selected.length} pagos
								</Button>
							</>
						)}
					</Stack>
				</Stack>
			</Box>

			<Card>
				<CardContent sx={{ p: 0 }}>
					{loading ? (
						<Typography sx={{ p: 2 }}>Cargando...</Typography>
					) : pagos.length === 0 ? (
						<Typography sx={{ p: 2 }} color="text.secondary">
							No hay pagos pendientes de conciliación
						</Typography>
					) : (
						<Box sx={{ overflowX: 'auto' }}>
							<table style={{ width: '100%', borderCollapse: 'collapse' }}>
								<thead>
									<tr style={{ backgroundColor: '#f5f5f5' }}>
										<th style={{ padding: '12px', width: 50 }}>
											<Checkbox
												checked={selected.length === pagos.length}
												onChange={handleSelectAll}
											/>
										</th>
										<th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
										<th style={{ padding: '12px', textAlign: 'left' }}>Entidad</th>
										<th style={{ padding: '12px', textAlign: 'left' }}>Incapacidad</th>
										<th style={{ padding: '12px', textAlign: 'left' }}>Tipo</th>
										<th style={{ padding: '12px', textAlign: 'right' }}>Valor</th>
										<th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
										<th style={{ padding: '12px', textAlign: 'left' }}>Fecha</th>
										<th style={{ padding: '12px', textAlign: 'left' }}>Período</th>
									</tr>
								</thead>
								<tbody>
									{pagos.map((pago) => (
										<tr
											key={pago.id_pago}
											style={{
												borderBottom: '1px solid #eee',
												backgroundColor: selected.includes(pago.id_pago)
													? '#e8f5e9'
													: 'transparent',
											}}
										>
											<td style={{ padding: '8px' }}>
												<Checkbox
													checked={selected.includes(pago.id_pago)}
													onChange={() => handleToggle(pago.id_pago)}
												/>
											</td>
											<td style={{ padding: '12px' }}>{pago.id_pago}</td>
											<td style={{ padding: '12px' }}>{pago.entidad?.nombre}</td>
											<td style={{ padding: '12px' }}>
												{pago.incapacidad?.titulo || '-'}
											</td>
											<td style={{ padding: '12px' }}>{pago.tipo_pago}</td>
											<td style={{ padding: '12px', textAlign: 'right' }}>
												${parseFloat(pago.valor || '0').toLocaleString()}
											</td>
											<td style={{ padding: '12px' }}>
												<Chip
													label={pago.estado_pago || 'pendiente'}
													size="small"
													color={
														pago.estado_pago === 'pagado'
															? 'success'
															: 'warning'
													}
												/>
											</td>
											<td style={{ padding: '12px' }}>
												{pago.fecha_pago
													? dayjs(pago.fecha_pago).format('DD/MM/YYYY')
													: '-'}
											</td>
											<td style={{ padding: '12px' }}>
												{pago.periodo_contable || '-'}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</Box>
					)}
				</CardContent>
			</Card>

			<Box sx={{ mt: 3 }}>
				<Typography variant="body2" color="text.secondary">
					Para conciliar, seleccione los pagos y haga clic en "Conciliar". Los pagos
					se marcarán como conciliados en el sistema.
				</Typography>
			</Box>
		</PageLayout>
	)
}