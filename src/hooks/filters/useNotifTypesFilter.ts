import { useEffect, useState } from 'react'
import {
	filterNotificationTypesSelector,
	updateFields,
} from '@/store/slices/Filter'

import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import {
	filterTempSelector,
	updateTempFields,
} from '@/store/slices/Filter/temp_slice'
import { notificationTypesSelector } from '@/store/slices/notifications/typesReducer'
import { getNotificationTypes } from '@/store/slices/notifications'
import { Type as NotificationType } from '@/types/Notifications'

export const useNotifTypesFilter = () => {
	const dispatch = useAppDispatch()
	// Canales seleccionados en el filtro
	const { notifChannels } = useAppSelector(filterNotificationTypesSelector)
	const { idOrg: tempIdOrg } = useAppSelector(filterTempSelector)

	// Canales cargados por el servicio
	const { getStatus, resource } = useAppSelector(notificationTypesSelector)

	// Canales
	const [channels, setChannels] = useState<NotificationType[]>([])

	/**
	 * Seleccionar canal: Siempre debe quedar por lo menos un canal seleccionado
	 * @param event
	 * @returns
	 */
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// Validar el número de canales chequeados
		const checkedChannels = channels.filter((ch) => ch.checked)

		// Si solo hay un canal chequeado, validar si es igual al que trae el evento
		if (checkedChannels.length === 1) {
			// El único canal chequeado es el mismo del evento, prevenir evento
			if (
				checkedChannels[0].typeNotificationId ===
				Number(event.target.value)
			) {
				event.preventDefault()
				return
			}
		}

		setChannels((prevValue) => {
			return prevValue.map((channel) => {
				const target = event.target
				if (channel.typeNotificationId === Number(target.value)) {
					return {
						...channel,
						checked: target.checked,
					}
				}
				return channel
			})
		})
	}

	// Llamar servicio de canales
	useEffect(() => {
		if (tempIdOrg) {
			dispatch(getNotificationTypes({ idOrg: tempIdOrg }))
		}
	}, [tempIdOrg])

	// Con los canales cargados, setear state de canales que se van a mostrar en el filtro
	useEffect(() => {
		// Validar canales en state
		if (notifChannels) {
			setChannels(
				resource.types.map((ch) => ({
					...ch,
					checked: notifChannels.includes(ch.typeNotificationId),
				}))
			)
		} // No habían canales en el state (primera carga)
		else {
			setChannels(resource.types)

			// Aplicar filtro
			if (resource.types.length) {
				dispatch(
					updateFields({
						notifChannels: resource.types.map(
							(ch) => ch.typeNotificationId
						),
					})
				)
			}
		}
	}, [resource])

	// Actualizar state temporal del filtro cada vez que se marquen o desmarquen canales
	useEffect(() => {
		// Si no se marcó ningún
		dispatch(
			updateTempFields({
				notifChannels: channels
					.filter((ch) => ch.checked)
					.map((ch) => ch.typeNotificationId),
			})
		)
	}, [channels])

	return {
		status: getStatus,
		channels,
		handleChange,
	}
}
