import { useState } from 'react'
import {
	Box,
	Typography,
	Chip,
	Collapse,
	IconButton,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import CancelIcon from '@mui/icons-material/Cancel'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import LockIcon from '@mui/icons-material/Lock'

export interface StatusItem {
	id_estado: number
	nombre: string
	descripcion: string
	permite_transicion: boolean
}

interface StatusTimelineProps {
	statuses: StatusItem[]
	currentStatusId: number | null
	orientation?: 'vertical' | 'horizontal'
	onStatusClick?: (status: StatusItem) => void
}

const FINAL_STATES = ['Rechazada', 'Cerrada', 'Archivada']
const SPECIAL_STATUSES = ['Documentación incompleta', 'Rechazada', 'Archivada']

const MAIN_STATUSES = [
	'Recibida',
	'En validación documental',
	'Pendiente transcripción',
	'Transcrita',
	'En verificación EPS',
	'Pendiente pago',
	'Pagada',
	'Cerrada',
]

const STATUS_ORDER: Record<string, number> = {
	Recibida: 1,
	'Documentación incompleta': 2,
	'En validación documental': 3,
	'Pendiente transcripción': 4,
	Transcrita: 5,
	'En verificación EPS': 6,
	Aprobada: 7,
	'Pendiente pago': 8,
	Pagada: 9,
	Cobrada: 10,
	'Cobro persuasivo': 11,
	'Cobro jurídico': 12,
	'En conciliación': 13,
	Conciliada: 14,
	Cerrada: 15,
	Archivada: 16,
	Rechazada: 17,
}

export const StatusTimeline = ({
	statuses,
	currentStatusId,
	orientation = 'vertical',
	onStatusClick,
}: StatusTimelineProps) => {
	const [expanded, setExpanded] = useState<Record<number, boolean>>({})

	const sortedStatuses = [...statuses].sort((a, b) => {
		const orderA = STATUS_ORDER[a.nombre] ?? 999
		const orderB = STATUS_ORDER[b.nombre] ?? 999
		return orderA - orderB
	})

	const currentStatusObj = sortedStatuses.find((s) => s.id_estado === currentStatusId)
	const isCurrentSpecial = currentStatusObj && SPECIAL_STATUSES.includes(currentStatusObj.nombre)

	const visibleStatuses = orientation === 'horizontal'
		? sortedStatuses.filter((s) => {
				const isMain = MAIN_STATUSES.includes(s.nombre)
				const isSpecial = SPECIAL_STATUSES.includes(s.nombre)
				const isCurrent = s.id_estado === currentStatusId
				if (isCurrent) return true
				if (isSpecial) return false
				if (isCurrentSpecial && isMain) {
					const statusOrder = STATUS_ORDER[s.nombre] ?? 999
					const currentOrder = STATUS_ORDER[currentStatusObj?.nombre ?? ''] ?? 999
					return statusOrder > currentOrder
				}
				return isMain
			})
		: sortedStatuses

	const getStatusState = (status: StatusItem): 'completed' | 'current' | 'pending' | 'final' => {
		if (status.id_estado === currentStatusId) return 'current'

		const currentIndex = sortedStatuses.findIndex((s) => s.id_estado === currentStatusId)
		const statusIndex = sortedStatuses.findIndex((s) => s.id_estado === status.id_estado)

		if (statusIndex < currentIndex && currentIndex !== -1) return 'completed'

		if (FINAL_STATES.includes(status.nombre)) return 'final'

		return 'pending'
	}

	const getStatusColor = (state: string): 'success' | 'primary' | 'default' | 'error' | 'warning' => {
		switch (state) {
			case 'completed':
				return 'success'
			case 'current':
				return 'primary'
			case 'final':
				return 'error'
			case 'pending':
				return 'default'
			default:
				return 'default'
		}
	}

	const getIcon = (state: string) => {
		switch (state) {
			case 'completed':
				return <CheckCircleIcon fontSize="small" />
			case 'current':
				return <FiberManualRecordIcon fontSize="small" />
			case 'final':
				return <CancelIcon fontSize="small" />
			default:
				return <RadioButtonUncheckedIcon fontSize="small" />
		}
	}

	const toggleExpand = (id: number) => {
		setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
	}

	const handleClick = (status: StatusItem) => {
		if (onStatusClick) {
			onStatusClick(status)
		}
	}

	const isFinal = (status: StatusItem) =>
		FINAL_STATES.includes(status.nombre) || !status.permite_transicion

	if (orientation === 'horizontal') {
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					overflowX: 'auto',
					py: 2,
					px: 1,
					gap: 0,
				}}
			>
				{visibleStatuses.map((status, index) => {
					const state = getStatusState(status)
					const color = getStatusColor(state)
					const isLast = index === visibleStatuses.length - 1

					return (
						<Box
							key={status.id_estado}
							sx={{
								display: 'flex',
								alignItems: 'center',
								minWidth: 'fit-content',
							}}
						>
							<Box
								onClick={() => handleClick(status)}
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									cursor: onStatusClick ? 'pointer' : 'default',
									opacity: state === 'pending' ? 0.5 : 1,
								}}
							>
								<Box
									sx={{
										width: 40,
										height: 40,
										borderRadius: '50%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										bgcolor: `${color}.main`,
										color: 'white',
										border: state === 'current' ? '3px solid' : 'none',
										borderColor: `${color}.dark`,
										boxShadow: state === 'current' ? `0 0 0 4px ${color}.light` : 'none',
									}}
								>
									{getIcon(state)}
								</Box>
								<Typography
									variant="caption"
									sx={{
										mt: 1,
										textAlign: 'center',
										fontWeight: state === 'current' ? 700 : 400,
										maxWidth: 100,
									}}
								>
									{status.nombre}
								</Typography>
							</Box>
							{!isLast && (
								<Box
									sx={{
										width: 40,
										height: 2,
										bgcolor: state === 'completed' ? 'success.main' : 'divider',
										mx: 1,
									}}
								/>
							)}
						</Box>
					)
				})}
			</Box>
		)
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
			{visibleStatuses.map((status, index) => {
				const state = getStatusState(status)
				const color = getStatusColor(state)
				const isLast = index === visibleStatuses.length - 1
				const expandedState = expanded[status.id_estado]
				const final = isFinal(status)

				return (
					<Box
						key={status.id_estado}
						sx={{ display: 'flex' }}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								mr: 2,
							}}
						>
							<Box
								onClick={() => handleClick(status)}
								sx={{
									width: 36,
									height: 36,
									borderRadius: '50%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									bgcolor: `${color}.main`,
									color: 'white',
									border: state === 'current' ? '3px solid' : 'none',
									borderColor: `${color}.dark`,
									boxShadow: state === 'current' ? `0 0 0 4px ${color}.light` : 'none',
									cursor: onStatusClick ? 'pointer' : 'default',
									zIndex: 1,
								}}
							>
								{getIcon(state)}
							</Box>
							{!isLast && (
								<Box
									sx={{
										width: 2,
										flex: 1,
										minHeight: 40,
										bgcolor: state === 'completed' ? 'success.main' : 'divider',
									}}
								/>
							)}
						</Box>

						<Box
							sx={{
								flex: 1,
								pb: isLast ? 0 : 3,
							}}
						>
							<Box
								onClick={() => handleClick(status)}
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'flex-start',
									cursor: onStatusClick ? 'pointer' : 'default',
									opacity: state === 'pending' ? 0.6 : 1,
									pb: 1,
								}}
							>
								<Box sx={{ flex: 1 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Typography
											variant="subtitle1"
											fontWeight={state === 'current' ? 700 : 500}
										>
											{status.nombre}
										</Typography>
										{final && (
											<LockIcon fontSize="small" sx={{ color: 'text.secondary' }} />
										)}
										{state === 'current' && (
											<Chip
												label="Actual"
												color="primary"
												size="small"
												variant="outlined"
											/>
										)}
										{state === 'completed' && (
											<Chip
												label="Completado"
												color="success"
												size="small"
												variant="outlined"
											/>
										)}
									</Box>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mt: 0.5 }}
									>
										{status.descripcion}
									</Typography>
								</Box>

								<IconButton
									size="small"
									onClick={(e) => {
										e.stopPropagation()
										toggleExpand(status.id_estado)
									}}
								>
									{expandedState ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</IconButton>
							</Box>

							<Collapse in={expandedState}>
								<Box
									sx={{
										ml: 2,
										p: 2,
										bgcolor: 'background.default',
										borderRadius: 1,
										border: '1px solid',
										borderColor: 'divider',
									}}
								>
									<Typography variant="caption" color="text.secondary">
										ID: {status.id_estado}
									</Typography>
									<br />
									<Typography variant="caption" color="text.secondary">
										Permite transición: {status.permite_transicion ? 'Sí' : 'No'}
									</Typography>
									{!status.permite_transicion && (
										<Box sx={{ mt: 1 }}>
											<Chip
												label="Estado terminal"
												color="warning"
												size="small"
												variant="outlined"
											/>
										</Box>
									)}
								</Box>
							</Collapse>
						</Box>
					</Box>
				)
			})}
		</Box>
	)
}