import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import { filterEntriesSelector, filterSelector } from '@/store/slices/Filter'
import {
	filterTempSelector,
	updateTempFields,
} from '@/store/slices/Filter/temp_slice'
import { useCompanyAndIdVa } from '../useCompanyAndIdVa'
import { getMaxEntries } from '@/store/slices/reports/humanAgent/history'
import { locationsFilters } from '@/utils/helpers/locationsFilters'

export function useEntriesFilter(max?: number) {
	const dispatch = useAppDispatch()
	const entriesSelector = useAppSelector(filterEntriesSelector)
	const { idOrg } = useCompanyAndIdVa()
	const {
		start,
		end,
		idVa,
		channels,
		regionals,
		departments,
		cities,
		id,
		idType,
	} = useAppSelector(filterTempSelector)

	const [since, setSince] = useState('')
	const [until, setUntil] = useState('')

	// Estado completo del filtro (necesario para resetear campos)
	const { until: stateUntil, since: stateSince } =
		useAppSelector(filterSelector)

	// Setear states
	const handleSetSince = (value: string) => {
		setSince(value)
	}
	const handleSetUntil = (value: string) => {
		if (max) {
			setUntil(Number(value) > max ? max.toString() : value)
		} else {
			setUntil(value)
		}
	}

	const invalidRange = (): boolean => {
		return Boolean(Number(since) > Number(until))
	}

	const filterEntries = () => {
		// Si el rango es inválido, igualar el valor de Desde al de Hasta
		if (until.length && invalidRange()) {
			setSince(until)
			return
		}

		if (since && until) {
			dispatch(
				updateTempFields({ since: Number(since), until: Number(until) })
			)
		} else if (since) {
			dispatch(
				updateTempFields({ since: Number(since), until: undefined })
			)
		} else if (until) {
			dispatch(
				updateTempFields({ since: undefined, until: Number(until) })
			)
		} else {
			dispatch(updateTempFields({ since: undefined, until: undefined }))
		}
	}

	useEffect(() => {
		if (entriesSelector.since) setSince(entriesSelector.since.toString())
		else setSince('')

		if (entriesSelector.until) setUntil(entriesSelector.until.toString())
		else setUntil('')
	}, [])

	// Resetear filtro (limpiar inputs)
	useEffect(() => {
		if (!(stateUntil || stateSince)) {
			setSince('')
			setUntil('')
		}
	}, [stateUntil, stateSince])

	// Validar valores desde - hasta
	useEffect(() => {
		filterEntries()
	}, [since, until])

	// Obtener máximo de registros
	useEffect(() => {
		if (idOrg && idVa && start && end) {
			const { idCities, idDepartments, idRegionals } = locationsFilters(
				regionals,
				departments,
				cities
			)
			dispatch(
				getMaxEntries({
					filters: {
						idRegionals,
						idDepartments,
						idCities,
						id,
						idType,
						idVa,
						end,
						start,
						channels,
					},
					idOrg,
				})
			)
		}
	}, [
		start,
		end,
		idVa,
		regionals?.toString(),
		idOrg,
		channels?.toString(),
		departments?.toString(),
		cities?.toString(),
		id,
		idType,
	])

	return {
		since,
		until,
		handleSetSince,
		handleSetUntil,
	}
}
