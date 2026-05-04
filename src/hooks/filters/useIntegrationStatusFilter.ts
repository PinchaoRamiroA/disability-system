import { useEffect, useState } from 'react'
import {
	filterIntegrationStatusSelector,
	filterSelector,
} from '@/store/slices/Filter'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import { updateTempFields } from '@/store/slices/Filter/temp_slice'

export const useIntegrationStatusFilter = () => {
	const dispatch = useAppDispatch()

	const [success, setSuccess] = useState(true)
	const [noSuccess, setNoSuccess] = useState(true)

	const selector = useAppSelector(filterIntegrationStatusSelector)

	// Estado completo del filtro (necesario para resetear campos)
	const { integrationStatus } = useAppSelector(filterSelector)

	// Setear state
	const handleChangeSuccess = (checked: boolean) => setSuccess(checked)
	const handleChangeNoSuccess = (checked: boolean) => setNoSuccess(checked)

	// Actualiza el temp state del filtro
	const applyFilter = () => {
		// Si ambos checkboxes están seleccionados o desmarcados
		if ((success && noSuccess) || (!success && !noSuccess)) {
			dispatch(updateTempFields({ integrationStatus: undefined }))
		}
		// Solo está marcado el estatdo exitoso
		else if (success) {
			dispatch(updateTempFields({ integrationStatus: true }))
		} else {
			dispatch(updateTempFields({ integrationStatus: false }))
		}
	}

	// Recuperar valor del state si este no se ha modificado
	useEffect(() => {
		if (selector === undefined) {
			setSuccess(false)
			setNoSuccess(false)
		} else if (selector) {
			setSuccess(true)
			setNoSuccess(false)
		} else {
			setSuccess(false)
			setNoSuccess(true)
		}
	}, [])

	// Actualizar temp state
	useEffect(() => {
		applyFilter()
	}, [success, noSuccess])

	// Resetea valor de checkboxes cuando se resetean los filtros
	useEffect(() => {
		if (integrationStatus === undefined) {
			setSuccess(true)
			setNoSuccess(true)
		}
	}, [integrationStatus])

	return {
		success,
		noSuccess,
		handleChangeSuccess,
		handleChangeNoSuccess,
	}
}
