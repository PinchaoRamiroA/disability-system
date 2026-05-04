import { GridDivider } from '@/components/GridDivider'
import { AddCircle, DeleteOutline, Update } from '@mui/icons-material'
import {
	Box,
	Grid,
	IconButton,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

interface TimeProps {
	init: string
	end: string
	timeId?: number
	day?: number
	empty?: boolean
	addTime?: (
		start: string,
		end: string,
		day: number,
		callback: () => void
	) => void
	updateTime?: (
		newStart: string,
		newEnd: string,
		timeId: number,
		callback: () => void
	) => void
	deleteTime?: (timeId: number) => void
}

export const RenderTime = ({
	end,
	init,
	timeId,
	empty,
	day,
	addTime,
	updateTime,
	deleteTime,
}: TimeProps) => {
	const [initValue, setInitValue] = useState(init)
	const [endValue, setEndValue] = useState(end)
	const [toUpdate, setToUpdate] = useState(false)

	// Validar si se solapan tiempos a agregar
	const handleAddClick = () => {
		if (addTime && day && initValue && endValue) {
			addTime(initValue, endValue, day, () => {
				// Resetear inputs
				setInitValue(init)
				setEndValue(end)
			})
		}
	}

	const handleUpdateClick = () => {
		if (updateTime && timeId && initValue && endValue) {
			updateTime(initValue, endValue, timeId, () => {
				setToUpdate(false)
			})
		}
	}

	const handleDeleteClick = () => {
		if (deleteTime && timeId) {
			deleteTime(timeId)
		}
	}

	// Detectar cambios para activar botón de actualizar
	useEffect(() => {
		if (initValue !== init || endValue !== end) {
			setToUpdate(true)
		} else {
			setToUpdate(false)
		}
	}, [initValue, endValue, init, end])

	return (
		<Box>
			<Grid
				container
				item
				xs={12}
				// sm={8}
				spacing={2}
				px={3}
				mb={2}
				alignItems="center"
			>
				{/* Mensaje si no hay horarios */}
				{empty && (
					<Grid item xs={12}>
						<Typography m={0}>
							No hay horarios asignados para este día.
						</Typography>
					</Grid>
				)}
				{/* Texto indicativo para agregar horario */}
				{addTime && (
					<>
						<GridDivider my={0} padding={false} />
						<Grid item xs={12}>
							<Typography variant="h6">
								Pulsa el botón
								<IconButton>
									<AddCircle color="primary" />
								</IconButton>
								para agregar un nuevo horario
							</Typography>
						</Grid>
					</>
				)}
				{/* Horario de inicio */}
				<Grid item xs sm>
					<TextField
						label="Hora de inicio"
						type="time"
						value={initValue}
						fullWidth
						size="small"
						onChange={(e) => {
							setInitValue(e.target.value + ':00')
						}}
						// onFocus={(e) => {
						// 	const input = e.target as HTMLInputElement & {
						// 		showPicker?: () => void
						// 	}
						// 	input.showPicker?.()
						// }}
					/>
				</Grid>
				{/* Hora de fin */}
				<Grid item xs sm>
					<TextField
						label="Hora de fin"
						type="time"
						value={endValue}
						fullWidth
						size="small"
						onChange={(e) => {
							setEndValue(e.target.value + ':00')
						}}
						// onFocus={(e) => {
						// 	const input = e.target as HTMLInputElement & {
						// 		showPicker?: () => void
						// 	}
						// 	input.showPicker?.()
						// }}
					/>
				</Grid>
				{/* Botones */}
				<Grid item xs="auto" sm="auto">
					{addTime ? (
						initValue === endValue ? (
							<IconButton size="small" disabled>
								<AddCircle />
							</IconButton>
						) : (
							<Tooltip title="Agregar horario">
								<IconButton
									color="primary"
									size="small"
									onClick={handleAddClick}
								>
									<AddCircle />
								</IconButton>
							</Tooltip>
						)
					) : toUpdate ? (
						<Tooltip title="Actualizar horario">
							<IconButton
								color="secondary"
								size="small"
								onClick={handleUpdateClick}
							>
								<Update />
							</IconButton>
						</Tooltip>
					) : (
						<Tooltip title="Borrario horario">
							<IconButton
								size="small"
								color="error"
								onClick={handleDeleteClick}
							>
								<DeleteOutline />
							</IconButton>
						</Tooltip>
					)}
				</Grid>
			</Grid>
		</Box>
	)
}
