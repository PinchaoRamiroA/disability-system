import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import { channelsSelector } from '@/store/slices/channels'
import { NomalizedChannel } from '@/types/Channel'
import { updateTempFields } from '@/store/slices/Filter/temp_slice'
import { filterChannelsSelector } from '@/store/slices/Filter'

export const useChannelFilter = () => {
	const dispatch = useAppDispatch()

	// Listado completo de canales
	const { resource: channels, getStatus: status } =
		useAppSelector(channelsSelector)

	// Canales filtrados (guardados)
	const { channels: channelsState } = useAppSelector(filterChannelsSelector)

	// Canales seleccionados en autocomplete (sin guardar o aplicar filtro)
	const [channelsSelected, setChannelsSelected] = useState<
		NomalizedChannel[]
	>([])

	// Actualizar valores de autocomplete
	const handleSetValue = (newValue: NomalizedChannel[]) =>
		setChannelsSelected(newValue)

	// Función que aplica el filtro y actualiza el state
	const filterChannels = () => {
		dispatch(
			updateTempFields({ channels: channelsSelected.map((c) => c.id) })
		)
	}

	// Recuperar valores del filtro y los muestra marcados en el autocomplete
	const initAutocomplete = () => {
		if (channelsState?.length) {
			const temp: NomalizedChannel[] = []

			channels.forEach((item) => {
				if (channelsState.includes(item.id)) {
					temp.push(item)
				}
			})
			handleSetValue(temp)
		}
	}

	// Mostrar canales filtrados en Autocomplete cuando se cambia de opción en el menú
	useEffect(() => {
		initAutocomplete()
	}, [])

	// Aplicar filtro cuando se actualicen los valores del autocomplete
	useEffect(() => {
		filterChannels()
	}, [channelsSelected])

	return {
		status,
		channels,
		channelsSelected,
		handleSetValue,
		initAutocomplete,
	}
}
