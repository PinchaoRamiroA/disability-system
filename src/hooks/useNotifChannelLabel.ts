import {
	getNotificationTypes,
	notificationTypesSelector,
} from '@/store/slices/notifications'
import { useAppDispatch, useAppSelector } from './useReduxHooks'
import { useEffect } from 'react'
import { useCompanyAndIdVa } from './useCompanyAndIdVa'

export const useNotifChannelLabel = () => {
	const dispatch = useAppDispatch()
	const { idOrg } = useCompanyAndIdVa()
	const { resource } = useAppSelector(notificationTypesSelector)

	// Obtener tipos de notificación
	useEffect(() => {
		dispatch(getNotificationTypes({ idOrg }))
	}, [idOrg])

	const getLabelById = (id: number) => {
		if (resource.types.length) {
			return (
				resource.types.find((el) => el.typeNotificationId === id)
					?.name ?? ''
			)
		}
		return ''
	}

	const getLabels = () => {
		return resource.types.map((e) => e.name)
	}

	return {
		getLabelById,
		getLabels,
		notifTypes: resource,
	}
}
