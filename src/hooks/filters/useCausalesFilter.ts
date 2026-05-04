import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import {
	causalesNegocioSelector,
	getCausalesNegocio,
} from '@/store/slices/causales-negocio'
import {
	causalesFinSelector,
	getCausalesFin,
} from '@/store/slices/causales-fin'
import { Causal, TipoCausal } from '@/types/Causales'
import {
	filterCausalesFinSelector,
	filterCausalesNegocioSelector,
	filterCausalesPasoAutomaticoSelector,
} from '@/store/slices/Filter'
import { updateTempFields } from '@/store/slices/Filter/temp_slice'
import {
	causalesPasoAutomaticoSelector,
	getCausalesPasoAutomatico,
} from '@/store/slices/causales-paso-automatico'
import { useCompanyAndIdVa } from '../useCompanyAndIdVa'

export const useCausalesFilter = (type: TipoCausal) => {
	const dispatch = useAppDispatch()

	// Reducer de causales
	const { resource: causalesReducer, getStatus: causalesStatus } =
		useAppSelector(
			type === 'negocio'
				? causalesNegocioSelector
				: type === 'finalizacion'
				? causalesFinSelector
				: causalesPasoAutomaticoSelector
		)
	// Reducer de causales seleccionadas en el filtro
	const { causales } = useAppSelector(
		type === 'negocio'
			? filterCausalesNegocioSelector
			: type === 'finalizacion'
			? filterCausalesFinSelector
			: filterCausalesPasoAutomaticoSelector
	)
	const { idOrg } = useCompanyAndIdVa()

	/**
	 * Autcomplete
	 */
	// Valores seleccionados
	const [causalesSelected, setCausalesSelected] = useState<Causal[]>([])

	// Actualiza valores del Autocomplete
	const handleUpdateValues = (values: Causal[]) => {
		setCausalesSelected(values)
	}

	/**
	 * Validar si hay causales en el reducer, sino cargarlas
	 */
	useEffect(() => {
		if (causalesStatus === 'idle' && idOrg) {
			if (type === 'negocio') {
				dispatch(getCausalesNegocio({ idOrg }))
			} else if (type === 'finalizacion') {
				dispatch(getCausalesFin({ idOrg }))
			} else {
				dispatch(getCausalesPasoAutomatico({ idOrg }))
			}
		}
	}, [idOrg, causalesStatus])

	/**
	 * Validar si hay causales marcadas en el filtro y recuperarlas para mostrar en Autcomplete
	 */
	useEffect(() => {
		if (causales?.length) {
			const tempValues: Causal[] = []
			causalesReducer.forEach((causal) => {
				if (causales.includes(causal.idCausal)) {
					tempValues.push(causal)
				}
			})
			// Actualizar Autocomplete
			handleUpdateValues(tempValues)
		}
	}, [])

	/**
	 * Detecta cambios en Autocomplete y actualiza campos seleccionados en reducer temporal
	 */
	useEffect(() => {
		const ids = causalesSelected.map((item) => item.idCausal)
		const name =
			type === 'negocio'
				? 'causalesNegocio'
				: type === 'finalizacion'
				? 'causalesFin'
				: 'causalesPasoAutomatico'
		dispatch(updateTempFields({ [name]: ids }))
	}, [causalesSelected])

	/**
	 * Detectar si no hay filtros seleccionados para resetear valores
	 */
	useEffect(() => {
		if (!causales?.length) {
			handleUpdateValues([])
		}
	}, [causales])

	return {
		options: causalesReducer,
		causalesSelected,
		handleUpdateValues,
		status: causalesStatus,
	}
}
