import React, { useEffect, useState } from 'react'
import { RenderChart } from '@/components/Charts/RenderChart'
import { NotificationsChart } from './NotificationsChart'
import { BarChart } from '@/types/Charts'
import { Notifications, NotificationsEvents } from '@/types/Notifications'
import { useNotifChannelLabel } from '@/hooks/useNotifChannelLabel'
import { EventsChart } from './EventsChart'
import moment from 'moment'

interface Props {
	notifications: Notifications
	events: NotificationsEvents
	loadingNotifications: boolean
	loadingEvents: boolean
}

export const ChartContainer = ({
	notifications,
	events,
	loadingEvents,
	loadingNotifications,
}: Props) => {
	const { getLabelById, getLabels, notifTypes } = useNotifChannelLabel()

	// Notificaciones
	const [notifData, setNotifData] = useState<BarChart[]>([])
	const [notifKeys, setNotifKeys] = useState<string[]>([])
	const [maxValue, setMaxValue] = useState(0)
	const [totalPositivas, setTotalPositivas] = useState(0)
	const [totalNegativas, setTotalNegativas] = useState(0)
	const [totalesEjeY, setTotalesEjeY] = useState<
		{ date: string; value: number }[]
	>([])

	// Eventos
	const [eventsData, setEventsData] = useState<BarChart[]>([])
	const [eventsKeys, setEventsKeys] = useState<string[]>([])

	// Formatear datos de notificaciones
	const formatNotifications = () => {
		let tempMaxValue = 0
		let tempPositivas = 0
		let tempNegativas = 0
		const data: BarChart[] = []
		const tempTotalEje: { date: string; value: number }[] = []

		notifications.data.forEach((notification, index) => {
			const channel = getLabelById(notification.idTypeNotification)

			notification.detail.forEach((item) => {
				const { error, ok } = item.status
				const itemDate = moment(item.date).format('DD/MM/YYYY')

				if (error || ok) {
					// Index > 0 significa que ya iteró la primera vez
					if (index > 0) {
						// Buscar por fecha
						const detail = data.find((el) => el.date === itemDate)
						const eje = tempTotalEje.find(
							(el) => el.date === itemDate
						)

						// Actualizar totales
						if (detail && eje) {
							detail[`OK_${channel}`] = ok
							detail[channel] = error * -1

							if (
								tempMaxValue - error < 0 ||
								tempMaxValue - ok < 0
							) {
								tempMaxValue += error > ok ? error : ok
							}
							tempPositivas += ok
							tempNegativas += error
							eje.value += ok + error
							return
						}
					}

					// Verificar si la fecha ya está
					data.push({
						channel: notification.idTypeNotification,
						date: itemDate,
						count: ok + error,
						[`OK_${channel}`]: ok,
						[channel]: error * -1,
					})
					tempPositivas += ok
					tempNegativas += error
					tempTotalEje.push({ date: itemDate, value: ok + error })

					// Buscar mayor dato para limitar la gráfica
					if (error > tempMaxValue || ok > tempMaxValue) {
						tempMaxValue = error > ok ? error : ok
					}
				}
			})
		})

		// Ordenar datos de notificaciones por fecha
		const ordered = data as { date: string }[]
		ordered.sort((a, b) =>
			moment(a.date, 'DD/MM/YYYY').isAfter(moment(b.date, 'DD/MM/YYYY'))
				? 1
				: -1
		)
		setNotifData(ordered)
		setMaxValue(tempMaxValue)
		setTotalPositivas(tempPositivas)
		setTotalNegativas(tempNegativas)
		setTotalesEjeY(tempTotalEje)
	}

	// Formatear datos de eventos
	const formatEvents = () => {
		const data: BarChart[] = []

		events.detail.forEach((event) => {
			const obj: BarChart = {}

			event.detail.forEach((detail) => {
				const channel = getLabelById(detail.idTypeNotification)
				obj[channel] = detail.count
			})

			obj.event = event.eventName
			data.push(obj)
		})
		setEventsData(data)
	}

	// Formatear datos de notificaciones y eventos
	useEffect(() => {
		formatNotifications()
		formatEvents()
	}, [notifications, events])

	// Setear keys de notificaciones
	useEffect(() => {
		const labels = getLabels()
		const tempKeys: string[] = []

		labels.forEach((label) => {
			tempKeys.push(`OK_${label}`, label)
		})

		setNotifKeys(tempKeys)
		setEventsKeys(labels)
	}, [notifTypes])

	return (
		<>
			<RenderChart
				chartTitle="Notificaciones"
				dataLength={notifData.length}
				loading={loadingNotifications}
				styles={{
					width: '100%',
					overflow: 'auto',
				}}
			>
				<NotificationsChart
					data={notifData}
					keys={notifKeys}
					maxValue={maxValue}
					totalPositivas={totalPositivas}
					totalNegativas={totalNegativas}
					ejes={totalesEjeY}
				/>
			</RenderChart>

			<RenderChart
				chartTitle="Eventos"
				dataLength={eventsData.length}
				loading={loadingEvents}
				resizeHeight
			>
				<EventsChart data={eventsData} keys={eventsKeys} />
			</RenderChart>
		</>
	)
}
