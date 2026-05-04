import { filterSingleSplitSelector } from '@/store/slices/Filter'
import { updateTempFields } from '@/store/slices/Filter/temp_slice'
import { getSplits, splitsSelector } from '@/store/slices/splits'
import { Splits } from '@/types/Splits'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import { useCompanyAndIdVa } from '../useCompanyAndIdVa'

export const useSingleSplitsFilter = () => {
	const dispatch = useAppDispatch()

	const { idOrg } = useCompanyAndIdVa()

	// Splits del filtro real
	const { singleSplit } = useAppSelector(filterSingleSplitSelector)

	// Splits: Options de autocomplete
	const { getStatus: status, resource: splits } =
		useAppSelector(splitsSelector)

	// Valor seleccionado en autocomplete
	const [splitSelected, setSplitSelected] = useState<Splits | null>(null)

	// Actualizar valor de autocomplete
	const handleSetValue = (newValue: Splits | null) =>
		setSplitSelected(newValue)

	// Función que actualiza el filtro temporal
	const filterSplits = () => {
		dispatch(updateTempFields({ singleSplit: splitSelected?.idSplit }))
	}

	// Recuperar valores del filtro y mostrarlos en el autocomplete
	const initAutocomplete = () => {
		// Verificar si splits tiene elementos antes de hacer el find
		if (splits.length && singleSplit) {
			const split = splits.find((split) => split.idSplit === singleSplit)
			handleSetValue(split ?? null)
		}
	}

	// Obtener splits
	useEffect(() => {
		if (splits.length > 0) {
			initAutocomplete()
		}
	}, [splits])

	useEffect(() => {
		if (idOrg) {
			dispatch(getSplits({ idOrg }))
		}
	}, [idOrg])

	// Actualiza filtro temporal (cada vez que se actualiza autocomplete)
	useEffect(() => {
		filterSplits()
	}, [splitSelected])

	// Resetear autocomplete (cuando se resetea el filtro real)
	useEffect(() => {
		if (!singleSplit) handleSetValue(null)
	}, [singleSplit])

	return {
		status,
		splits,
		splitSelected,
		handleSetValue,
	}
}
