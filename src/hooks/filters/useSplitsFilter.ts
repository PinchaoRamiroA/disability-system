import { useEffect, useState } from 'react'
import { filterSplitsSelector } from '@/store/slices/Filter'
import { updateTempFields } from '@/store/slices/Filter/temp_slice'
import { getSplits, splitsSelector } from '@/store/slices/splits'
import { Splits } from '@/types/Splits'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import { useCompanyAndIdVa } from '../useCompanyAndIdVa'

export const useSplitsFilter = () => {
	const dispatch = useAppDispatch()

	const { idOrg } = useCompanyAndIdVa()

	// Splits del filtro real
	const { splits: splitsState } = useAppSelector(filterSplitsSelector)

	// Splits: Options de autocomplete
	const { getStatus: status, resource: splits } =
		useAppSelector(splitsSelector)

	// Valores seleccionados en autocomplete
	const [splitsSelected, setSplitsSelected] = useState<Splits[]>([])

	// Actualizar valores de autocomplete
	const handleSetValue = (newValue: Splits[]) => setSplitsSelected(newValue)

	// Función que actualiza el filtro temporal
	const filterSplits = () => {
		dispatch(
			updateTempFields({ splits: splitsSelected.map((s) => s.idSplit) })
		)
	}

	// Recuperar valores del filtro y mostrarlos en el autocomplete
	const initAutocomplete = () => {
		if (splitsState?.length) {
			const temp: Splits[] = []
			splits.forEach((item) => {
				if (splitsState.includes(item.idSplit)) {
					temp.push(item)
				}
			})
			handleSetValue(temp)
		}
	}

	// Obtener splits
	useEffect(() => {
		if (idOrg) {
			dispatch(getSplits({ idOrg }))
		}
		initAutocomplete()
	}, [idOrg])

	// Actualiza filtro temporal (cada vez que se actualiza autocomplete)
	useEffect(() => {
		filterSplits()
	}, [splitsSelected])

	// Resetear autocomplete (cuando se resetea el filtro real)
	useEffect(() => {
		if (!splitsState) handleSetValue([])
	}, [splitsState])

	return {
		status,
		splits,
		splitsSelected,
		handleSetValue,
	}
}
