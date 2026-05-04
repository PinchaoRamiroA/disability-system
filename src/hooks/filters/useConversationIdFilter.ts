import { useEffect, useState } from 'react'
import { filterIdConvSelector, filterSelector } from '@/store/slices/Filter'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import { updateTempFields } from '@/store/slices/Filter/temp_slice'

export const useConversationIdFilter = () => {
	const dispatch = useAppDispatch()

	const [idConv, setIdConv] = useState('')
	const selector = useAppSelector(filterIdConvSelector)

	// Estado completo del filtro (necesario para resetear campos)
	const { idConv: stateIdConv } = useAppSelector(filterSelector)

	// Setear state
	const handleSetValue = (value: string) => setIdConv(value)

	// Actualiza el temp state del filtro
	const applyFilter = () => {
		if (idConv.length) {
			dispatch(updateTempFields({ idConv: Number(idConv) }))
		} else {
			dispatch(updateTempFields({ idConv: undefined }))
		}
	}

	// Recuperar valor del state si este no se ha modificado
	useEffect(() => {
		if (selector) setIdConv(selector.toString())
		else setIdConv('')
	}, [])

	// Actualizar temp state
	useEffect(() => {
		applyFilter()
	}, [idConv])

	// Resetea valor de textfield cuando se resetean los filtros
	useEffect(() => {
		if (!stateIdConv) {
			setIdConv('')
		}
	}, [stateIdConv])

	return {
		idConv,
		handleSetValue,
	}
}
