import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import {
	ChangeSet,
	EditingState,
	IntegratedEditing,
	SchedulerDateTime,
	ViewState,
} from '@devexpress/dx-react-scheduler'
import {
	Scheduler,
	Appointments,
	WeekView,
	AppointmentTooltip,
	AppointmentForm,
	CurrentTimeIndicator,
	DragDropProvider,
} from '@devexpress/dx-react-scheduler-material-ui'
import moment, { Moment } from 'moment'
import { HorariosAtencion } from '@/types/Splits'
import { Box, TextField } from '@mui/material'
import { useAppDispatch } from '@/hooks/useReduxHooks'
import {
	createSplitSchedule,
	deleteSplitSchedule,
	updateSplitSchedule,
} from '@/store/slices/splits'
import { AlertDialog } from '@/components/Dialog'

interface Props {
	horarios: HorariosAtencion[]
	idSplit: number
}

interface AppointmentModelOverride {
	startDate: SchedulerDateTime
	endDate: SchedulerDateTime
	id: number
	index: number
	idSplit: number
	idDay: number
	idSplitHour?: number
}

const ScaleLayoutComponent = ({ ...props }: WeekView.TimeScaleLayoutProps) => {
	return (
		<WeekView.TimeScaleLayout
			// showAllDayTitle={true}
			{...props}
			// cellComponent={(cellProps) => {
			//     if (cellProps.startDate)
			//     {
			//         const dayOfWeek = daysOfWeek[cellProps.startDate.getDay()];
			//         console.log("DAY", dayOfWeek)
			//         return <WeekView.DayScaleCell formatDate={() => dayOfWeek} startDate={cellProps.startDate} {...cellProps} />;
			//     }
			//     return null
			// }}
		/>
	)
}

const getMonday = () => {
	const today = new Date()
	const monday = new Date()

	const day = today.getDay()
	// Se suman los días hasta llegar al próximo lunes (24 * (8 - day))
	// ese próximo lunes se le restan 7 días para obtener el lunes de la semana actual
	monday.setHours(24 * (8 - day) - 24 * 7)

	return monday
}

const DateEditor = ({
	value,
	onValueChange,
	...props
}: AppointmentForm.DateEditorProps) => {
	const [date, setDate] = useState('')

	const formatValue = () => {
		const temp = moment(value)
		console.log(temp.format('HH:mm:ss'))
		return temp.format('HH:mm:ss')
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// Hora
		const time = event.target.value + ':00'
		const datetime = new Date(date + ' ' + time)
		console.log(datetime)
		onValueChange(datetime)
	}

	useEffect(() => {
		console.log('VALUES', value)
		setDate(moment(value).format('YYYY-MM-DD'))
	}, [value])

	return (
		<TextField
			type="time"
			placeholder="Fecha y hora"
			value={formatValue()}
			onChange={handleChange}
			{...props}
		/>
	)
}

export default function HorarioDeprecated({ horarios, idSplit }: Props) {
	const dispatch = useAppDispatch()
	// Copia con los horarios
	const [openCruceHorarios, setOpenCruceHorarios] = useState(false)
	const [copiaHorarios, setCopiaHorarios] = useState<HorariosAtencion[]>([])
	const [data, setData] = useState<AppointmentModelOverride[]>([])
	// const [visible, setVisible] = useState(false)

	// Validar si se solapan fechas
	const dateOverlap = (
		day: number,
		startDate: Moment,
		endDate: Moment,
		idSplitHour?: number
	) => {
		const daySchedule = copiaHorarios.filter(
			(horario) => horario.id_day === day
		)
		data.filter((horario) => horario.idDay === day)
		let overlap = false
		let startTime = ''
		let endTime = ''

		// Se recibe este id por actualización
		if (idSplitHour) {
			const specificSchedule = copiaHorarios.find(
				(horario) => horario.id_hours_by_splits === idSplitHour
			)

			if (specificSchedule) {
				console.log('Specific', specificSchedule)
				startTime = startDate.isValid()
					? startDate.format('HH:mm:ss')
					: specificSchedule.hour_init
				endTime = endDate.isValid()
					? endDate.format('HH:mm:ss')
					: specificSchedule.hour_end
			}
		}
		// Creación de horario
		else {
			startTime = startDate.format('HH:mm:ss')
			endTime = endDate.format('HH:mm:ss')
		}

		console.log('Fechas', startDate, endDate)

		daySchedule.forEach((schedule) => {
			// Ignorar iteración
			if (overlap || idSplitHour === schedule.id_hours_by_splits) {
				console.log('Ignorar')
				return
			}
			const date1 = schedule.hour_init
			const date2 = schedule.hour_end

			console.log(date1, startTime)
			console.log(date2, endTime)

			/**
			 * Nueva hora final debe estar antes del inicio de la hora iterada
			 * e.g. Si la hora iterada es de 2 - 4, la nueva hora final no puede ser 2, 2:30, 3
			 * Nueva hora inicial debe estar después del final de la hora iterada
			 * e.g. Si la hora iterada es de 2 - 4, la nueva hora inicial no puede ser 3, 3:30, 4
			 */
			console.log(
				'endTime >= date1',
				endTime,
				'>=',
				date1,
				endTime >= date1
			)
			console.log(
				'startTime <= date2',
				startTime,
				'<=',
				date2,
				startTime <= date2
			)
			if (endTime >= date1 && startTime <= date2) {
				overlap = true

				// Restar un minuto a la hora final
				if (endTime === date1) {
					endDate.subtract(1, 'minute')
					overlap = false
				}
				// Sumar un minuto a la hora de inicio
				if (startTime === date2) {
					startDate.add(1, 'minute')
					overlap = false
				}
			}
		})

		// Setear horas ya que es posible que se haya modificado en la iteración
		if (!idSplitHour) {
			endTime = endDate.format('HH:mm:ss')
			startTime = startDate.format('HH:mm:ss')
		}

		return {
			overlap,
			endTime,
			startTime,
		}
	}

	const formatData = () => {
		const monday = getMonday()
		setData(
			horarios.map((horario, index) => {
				const addDays = horario.id_day / 10 - 1
				const mondayStr = moment(monday)
					.add(addDays, 'days')
					.format('YYYY-MM-DD')
				const startDate = moment(`${mondayStr} ${horario.hour_init}`)
				const endDate = moment(`${mondayStr} ${horario.hour_end}`)

				return {
					startDate: startDate.format('YYYY-MM-DD H:mm:ss'),
					endDate: endDate.format('YYYY-MM-DD H:mm:ss'),
					id: ++index,
					index,
					idSplit: horario.id_split,
					idDay: horario.id_day,
					idSplitHour: horario.id_hours_by_splits,
				}
			})
		)
	}

	const commitChanges = ({ added, changed, deleted }: ChangeSet) => {
		// Nueva fecha
		if (added) {
			const lastId = data.length > 0 ? data[data.length - 1].id + 1 : 1
			const index = lastId - 1
			const startDate = moment(added.startDate)
			const endDate = moment(added.endDate)

			const day = moment(added.startDate).day()
			const idDay = day > 0 ? day * 10 : 70

			console.log('added', added)
			console.log('day', day)

			const { endTime, overlap, startTime } = dateOverlap(
				idDay,
				startDate,
				endDate
			)

			if (overlap) {
				setOpenCruceHorarios(true)
				return false
			}
			dispatch(
				createSplitSchedule({
					hour_end: endTime,
					hour_init: startTime,
					id_day: idDay,
					id_split: idSplit,
				})
			)
			setData(
				data.concat({
					startDate: added.startDate,
					endDate: added.endDate,
					id: lastId,
					index,
					idSplit,
					idDay,
				})
			)
			setCopiaHorarios(
				copiaHorarios.concat({
					hour_end: endTime,
					hour_init: startTime,
					id: lastId,
					id_day: idDay,
					id_hours_by_splits: 0,
					id_split: idSplit,
				})
			)
		}
		// Fecha modificada
		else if (changed) {
			const key = Number(Object.keys(changed)[0])
			const toUpdate = data.find((item) => item.id === key)

			if (toUpdate) {
				const { idDay, idSplitHour } = toUpdate
				const changeData = changed[key]

				const start = changeData.startDate
					? new Date(changeData.startDate)
					: null
				const end = changeData.endDate
					? new Date(changeData.endDate)
					: null

				console.log('changed', changed)
				console.log('changed', changed[key])
				const { endTime, overlap, startTime } = dateOverlap(
					idDay,
					moment(start),
					moment(end),
					idSplitHour
				)

				if (overlap) {
					setOpenCruceHorarios(true)
					return false
				} else {
					const horariosToUpdate = copiaHorarios.map((horario) => {
						if (horario.id_hours_by_splits === idSplitHour) {
							// const changeData = changed[key]

							// const start = changeData.startDate ? new Date(changeData.startDate) : null
							// const end = changeData.endDate ?  new Date(changeData.endDate) : null

							// const startTime = start ? moment(start).format('H:mm:ss') : horario.hour_init
							// const endTime = end ? moment(end).format('H:mm:ss') : horario.hour_end

							return {
								...horario,
								hour_end: endTime,
								hour_init: startTime,
							}
						}
						return horario
					})
					dispatch(
						updateSplitSchedule({
							horarios: horariosToUpdate,
							idSplit,
						})
					)

					setCopiaHorarios(horariosToUpdate)
					setData(
						data.map((appointment) => {
							if (appointment.id === key) {
								console.log('appointment', appointment)
								console.log('times', end, start)
								changed[appointment.id]
								return {
									...appointment,
									endDate: end
										? moment(end).format(
												'YYYY-MM-DD HH:mm:ss'
										  )
										: appointment.endDate,
									startDate: start
										? moment(start).format(
												'YYYY-MM-DD HH:mm:ss'
										  )
										: appointment.startDate,
								}
							}
							return appointment
						})
					)
				}
			}
		}
		// Fecha eliminada
		else if (deleted) {
			console.log('deleted', deleted)
			const item = data.find((item) => item.id === deleted)

			if (item?.idSplitHour) {
				setCopiaHorarios(
					copiaHorarios.filter(
						(copia) => copia.id_hours_by_splits !== item.idSplitHour
					)
				)
				dispatch(
					deleteSplitSchedule({
						codigoRegistro: item.idSplitHour,
						idSplit,
					})
				)
				setData(
					data.filter((appointment) => appointment.id !== deleted)
				)
			}
		}
	}

	useEffect(() => {
		setCopiaHorarios(horarios)
		formatData()
	}, [])

	return (
		<Box py={0.5}>
			<Paper>
				<Scheduler data={data} firstDayOfWeek={1} locale="es-ES">
					<ViewState />
					<WeekView
						endDayHour={24}
						cellDuration={60 * 2}
						timeScaleLayoutComponent={ScaleLayoutComponent}
					/>
					<EditingState onCommitChanges={commitChanges} />

					{/* Habilita la Edición de appointments */}
					<IntegratedEditing />

					{/* Fechas */}
					<Appointments />

					{/* Tooltip que muestra el resumen de la fecha y botones de editar/borrar  */}
					<AppointmentTooltip showOpenButton showDeleteButton />

					{/* Formulario de edición */}
					<AppointmentForm
						dateEditorComponent={DateEditor}
						labelComponent={() => null}
						textEditorComponent={() => null}
						booleanEditorComponent={() => null}
					/>

					{/* Habilitar resize y deshabilitar drag */}
					<DragDropProvider
						allowDrag={() => false}
						allowResize={() => true}
					/>
					{/* Indicador de tiempo */}
					<CurrentTimeIndicator
						shadePreviousAppointments={true}
						shadePreviousCells={true}
					/>
				</Scheduler>
			</Paper>

			<AlertDialog
				open={openCruceHorarios}
				title="Cruce de horarios"
				description="Selecciona un horario diferente"
				onClose={() => setOpenCruceHorarios(false)}
			/>
		</Box>
	)
}
