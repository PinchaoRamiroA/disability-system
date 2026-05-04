import { useEffect, useState } from 'react'
import { useHorariosContext } from '@/hooks/useHorariosContext'
import { useLoading } from '@/hooks/useLoading'
import { useAppDispatch } from '@/hooks/useReduxHooks'
import { HorariosAtencion } from '@/types/Splits'
import {
	createSplitSchedule,
	deleteSplitSchedule,
	updateSplitSchedule,
} from '@/store/slices/splits'
import { Box, Grid, Typography } from '@mui/material'
import { RenderTime } from './RenderTime'
import { AlertDialog } from '@/components/Dialog'

interface DayProps {
	label: string
	idSplit: number
	idDay: number
}

export const RenderDay = ({ label, idSplit, idDay }: DayProps) => {
	const dispatch = useAppDispatch()
	const { horarios } = useHorariosContext()
	const { startLoading, stopLoading } = useLoading()
	const [overlapTime, setOverlapTime] = useState('')
	const [horariosDia, setHorariosDia] = useState<HorariosAtencion[]>([])

	// Validar si el horario entregado se cruza con los horarios actuales
	const validateOverlap = (
		start: string,
		end: string,
		codigoRegistro: number,
		callback: () => void
	) => {
		startLoading(true)
		let overlapTimeFlag = ''

		// Validar que el nuevo horario no se cruce con los que ya están definidos
		horariosDia.forEach((elem) => {
			if (codigoRegistro === elem.id_hours_by_splits) {
				return
			}
			if (
				(start >= elem.hour_init && end <= elem.hour_end) ||
				(start < elem.hour_init && end >= elem.hour_init) ||
				(start <= elem.hour_end && end > elem.hour_end)
			) {
				overlapTimeFlag = elem.hour_init + ' - ' + elem.hour_end
				return
			}
		})

		// El nuevo horario es válido para agregar
		if (overlapTimeFlag === '') {
			callback()
		}
		// El horario se cruza con otro horario
		else {
			setOverlapTime(overlapTimeFlag)
			stopLoading()
		}
	}

	// Agregar nuevo horario
	const handleAdd = (
		start: string,
		end: string,
		id_day: number,
		callback: () => void
	) => {
		// Validar cruce de horario para poder consumir el servicio
		validateOverlap(start, end, 0, () => {
			dispatch(
				createSplitSchedule({
					hour_end: end,
					hour_init: start,
					id_day,
					id_split: idSplit,
				})
			).then(() => {
				stopLoading()
				callback()
			})
		})
	}

	// Actualizar horario
	const handleUpdate = (
		start: string,
		end: string,
		codigoRegistro: number,
		callback: () => void
	) => {
		// Validar cruce de horario para poder consumir el servicio
		validateOverlap(start, end, codigoRegistro, () => {
			// Consultar horarios y generar horario actualizado
			const horariosUpdated = horarios.map((item) => {
				if (item.id_hours_by_splits === codigoRegistro) {
					return {
						...item,
						hour_end: end,
						hour_init: start,
					}
				}
				return item
			})
			console.log('horarios', horariosUpdated)
			dispatch(
				updateSplitSchedule({
					horarios: horariosUpdated,
					idSplit,
				})
			).then(() => {
				stopLoading()
				callback()
			})
		})
	}

	// Borrar horario
	const handleDelete = (codigoRegistro: number) => {
		startLoading(true)
		dispatch(
			deleteSplitSchedule({
				codigoRegistro,
				idSplit,
			})
		).then(stopLoading)
	}

	// Obtener horarios del día
	useEffect(() => {
		setHorariosDia(horarios.filter((item) => item.id_day === idDay))
	}, [horarios, idDay])

	return (
		<Box>
			<Grid container item xs={12} alignItems="center" spacing={2} p={2}>
				<Grid item xs="auto">
					<Typography variant="h6" fontWeight="bold">
						{label}
					</Typography>
				</Grid>
			</Grid>

			{horariosDia.map((horario) => (
				<RenderTime
					key={horario.id_hours_by_splits}
					end={horario.hour_end}
					init={horario.hour_init}
					timeId={horario.id_hours_by_splits}
					updateTime={handleUpdate}
					deleteTime={handleDelete}
				/>
			))}

			{/* Agregar horario: Setear con el último horario disponible */}
			<RenderTime
				init={'00:00:00'}
				end={'00:00:00'}
				day={idDay}
				addTime={handleAdd}
				empty={horariosDia.length === 0}
			/>

			<AlertDialog
				open={overlapTime !== ''}
				title="Cruce de horarios"
				description={`El horario ingresado se cruza con el horario ${overlapTime}`}
				onClose={() => {
					setOverlapTime('')
				}}
			/>
		</Box>
	)
}
