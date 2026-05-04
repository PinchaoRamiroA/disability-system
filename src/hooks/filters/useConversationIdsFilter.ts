import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import { filterIdsConvSelector, filterSelector } from '@/store/slices/Filter'
import { updateTempFields } from '@/store/slices/Filter/temp_slice'

export const useConversationIdsFilter = () => {
	const dispatch = useAppDispatch()

	// IDs seleccionados en el filtro y guardados en reducer de filtro
	const { idsConv } = useAppSelector(filterIdsConvSelector)
	const { idsConv: filteredIdsCov } = useAppSelector(filterSelector)

	const [values, setValues] = useState<number[]>([])

	const handleSetValue = (newValue: (string | number)[]) => {
		// 1. Convertimos todo a números y filtramos los NaN
		const parsedValues = newValue
			.map((val) => (typeof val === 'string' ? parseInt(val, 10) : val))
			.filter((val): val is number => !isNaN(val))

		// 2. Usamos un Set para eliminar duplicados y volvemos a convertir a Array
		const uniqueValues = Array.from(new Set(parsedValues))

		setValues(uniqueValues)
	}

	const filtrarTemporalmente = () => {
		dispatch(updateTempFields({ idsConv: values }))
	}

	// Actualizar state de filtro temporal
	useEffect(() => {
		filtrarTemporalmente()
	}, [values, dispatch])

	// Recuperar valor del reducer
	useEffect(() => {
		if (idsConv?.length) {
			setValues(idsConv)
		}
	}, [])

	useEffect(() => {
		if (filteredIdsCov) {
			setValues(filteredIdsCov)
		} else {
			setValues([])
		}
	}, [filteredIdsCov])

	return {
		values,
		handleSetValue,
	}
}
