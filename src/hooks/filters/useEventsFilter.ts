import { eventsSelector, getEvents } from '@/store/slices/events'
import { filterEventsSelector } from '@/store/slices/Filter'
import { updateTempFields } from '@/store/slices/Filter/temp_slice'
import { Events } from '@/types/Events'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'

export const useEventsFilter = () => {
	const dispatch = useAppDispatch()

	// Eventos del filtro real
	const { events: eventsState } = useAppSelector(filterEventsSelector)

	// Events: Options del autocomplete
	const { getStatus: status, resource: events } =
		useAppSelector(eventsSelector)

	// Valores seleccionados en autocomplete
	const [eventsSelected, setEventsSelected] = useState<Events[]>([])

	// Actualizar valores de autocomplete
	const handleSetValue = (newValue: Events[]) => setEventsSelected(newValue)

	// Función que actualiza el filtro temporal
	const filterEvents = () => {
		dispatch(updateTempFields({ events: eventsSelected.map((e) => e.id) }))
	}

	// Recuperar valores del filtro y mostrarlos en el autocomplete
	const initAutocomplete = () => {
		if (eventsState?.length) {
			const temp: Events[] = []
			events.forEach((item) => {
				if (eventsState.includes(item.id)) {
					temp.push(item)
				}
			})
			handleSetValue(temp)
		}
	}

	// Obtener eventos
	useEffect(() => {
		if (!events.length) {
			dispatch(getEvents())
		}
		initAutocomplete()
	}, [])

	// Actualiza filtro temporal (cada vez que se actualiza autocomplete)
	useEffect(() => {
		filterEvents()
	}, [eventsSelected])

	// Resetear autocomplete (cuando se resetea el filtro real)
	useEffect(() => {
		if (!eventsState) handleSetValue([])
	}, [eventsState])

	return {
		status,
		events,
		eventsSelected,
		handleSetValue,
	}
}
