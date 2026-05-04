import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import {
	filterIntentsSelector,
	filterSelector,
	updateFields,
} from '@/store/slices/Filter'
import { intentsQuantitiesSelector } from '@/store/slices/intents'
import { useEffect, useState } from 'react'
import { IntentsQuantities } from '@/types/Intents'
import { getIntentsQuantities } from '@/store/slices/intents/actions'
import {
	filterTempSelector,
	updateTempFields,
} from '@/store/slices/Filter/temp_slice'
import { useCompanyAndIdVa } from '../useCompanyAndIdVa'
import { userSelector } from '@/store/slices/authentication'
import { SUPERADMIN_ROLE } from '@/utils/constants/roles'

export const useIntentsFilter = () => {
	const dispatch = useAppDispatch()
	const filterIntentsSel = useAppSelector(filterIntentsSelector)
	const { idOrg } = useCompanyAndIdVa()
	const { role } = useAppSelector(userSelector)
	const [loaded, setLoaded] = useState(false)

	// Estado completo del filtro (necesario para resetear campos)
	const { intents: stateIntents } = useAppSelector(filterSelector)
	// Valores temporales del filtro (antes de aplicar)
	const {
		start,
		end,
		channels,
		idVa,
		idOrg: tempIdOrg,
	} = useAppSelector(filterTempSelector)

	// intents: Options del autocomplete
	const { getStatus: status, resource: intents } = useAppSelector(
		intentsQuantitiesSelector
	)

	// Valores seleccionados en autocomplete
	const [intentsSelected, setIntentsSelected] = useState<IntentsQuantities[]>(
		[]
	)

	// Actualiza valores seleccionados en autocomplete
	const handleSetValue = (newValue: IntentsQuantities[]) =>
		setIntentsSelected(newValue)

	// Actualizar state.filter
	const filterIntents = () => {
		dispatch(
			updateTempFields({
				intents: intentsSelected.map((el) => el.id),
			})
		)
	}

	// Limpia el autocomplete
	const resetValues = () => {
		handleSetValue([])

		// Resetar valores en state de filtro (no el temporal)
		dispatch(updateFields({ intents: undefined }))
	}

	// Recuperar valores del filtro y mostrarlos en el autocomplete
	const initIntents = () => {
		if (filterIntentsSel.intents?.length) {
			const temp: IntentsQuantities[] = []
			intents.forEach((item) => {
				if (filterIntentsSel.intents?.includes(item.id)) {
					temp.push(item)
				}
			})
			handleSetValue(temp)
		}
	}

	useEffect(() => {
		initIntents()
	}, [])

	// Actualizar state temporal del filtro cuando se seleccionen intenciones
	useEffect(() => {
		filterIntents()
	}, [intentsSelected])

	// Cargar intenciones
	useEffect(() => {
		let idOrgParam: number | null = null
		if (role === SUPERADMIN_ROLE && tempIdOrg) {
			idOrgParam = tempIdOrg
		} else if (idOrg) {
			idOrgParam = idOrg
		}

		// Verificar que es el primer acceso al useEffect
		if (!loaded) {
			setLoaded(true)
			// Evitar consumo de canales vacíos
			if (channels?.length === 0) {
				return
			}
		}

		if (idOrgParam && start && end && idVa) {
			resetValues()

			dispatch(
				getIntentsQuantities({
					idOrg: idOrgParam,
					filters: { start, end, channels, idVa },
				})
			)
		}
	}, [idOrg, tempIdOrg, start, end, channels, idVa])

	// Limpiar autocomplete validando el state
	useEffect(() => {
		if (!stateIntents) handleSetValue([])
	}, [stateIntents])

	return {
		status,
		intents,
		intentsSelected,
		handleSetValue,
	}
}
