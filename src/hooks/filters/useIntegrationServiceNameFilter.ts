import { useEffect, useState } from 'react'
import {
	filterIntegrationServiceNameSelector,
	filterSelector,
} from '@/store/slices/Filter'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import { updateTempFields } from '@/store/slices/Filter/temp_slice'

export const useIntegrationServiceNameFilter = () => {
	const dispatch = useAppDispatch()

	const { integrationService: currentIntegrationService } = useAppSelector(
		filterIntegrationServiceNameSelector
	)

	// Estado completo del filtro (necesario para resetear campos)
	const { integrationService: tempIntegrationService } =
		useAppSelector(filterSelector)

	const [serviceName, setServiceName] = useState('')

	// Setear state
	const handleChange = (newValue: string) => setServiceName(newValue)

	// Actualiza el temp state del filtro
	const applyFilter = () => {
		if (serviceName.length) {
			dispatch(updateTempFields({ integrationService: serviceName }))
		} else {
			dispatch(updateTempFields({ integrationService: undefined }))
		}
	}

	// Recuperar valor del state si este no se ha modificado
	useEffect(() => {
		if (currentIntegrationService) {
			setServiceName(currentIntegrationService)
		} else {
			setServiceName('')
		}
	}, [])

	// Actualizar temp state
	useEffect(() => {
		applyFilter()
	}, [serviceName])

	// Resetea valor de checkboxes cuando se resetean los filtros
	useEffect(() => {
		if (!tempIntegrationService) {
			setServiceName('')
		}
	}, [tempIntegrationService])

	return {
		serviceName,
		handleChange,
	}
}
