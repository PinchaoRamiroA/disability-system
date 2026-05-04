import { filterAgentsSelector, updateFields } from '@/store/slices/Filter'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import { agentsSelector, getAgents } from '@/store/slices/humanAgent/filter'
import { useEffect, useState } from 'react'
import { Agents } from '@/types/HumanAgent/Agents'
import {
	filterTempSelector,
	updateTempFields,
} from '@/store/slices/Filter/temp_slice'
import { userSelector } from '@/store/slices/authentication'
import { SUPERADMIN_ROLE } from '@/utils/constants/roles'
import { useCompanyAndIdVa } from '../useCompanyAndIdVa'

export const useAgentsFilter = () => {
	const dispatch = useAppDispatch()

	// Asesores del filtro
	const { agents: agentsState } = useAppSelector(filterAgentsSelector)

	// Valores temporales del filtro (antes de aplicar)
	const { idOrg } = useCompanyAndIdVa()
	const { idOrg: tempIdOrg } = useAppSelector(filterTempSelector)
	const { role } = useAppSelector(userSelector)

	// Asesores cargados por el servicio (van en Autocomplete)
	const { getStatus, resource: agents } = useAppSelector(agentsSelector)

	// Valores seleccionados en Autocomplete
	const [agentsSelected, setAgentsSelected] = useState<Agents[]>([])

	// Actualizar valores de autocomplete
	const handleSetValue = (newValue: Agents[]) => setAgentsSelected(newValue)

	// Función que actualiza el filtro temporal
	const filterAgents = () => {
		dispatch(
			updateTempFields({ agents: agentsSelected.map((a) => a.idUser) })
		)
	}

	// Limpia el autocomplete
	const resetValues = () => {
		handleSetValue([])

		// Resetar valores en state de filtro (no el temporal)
		dispatch(updateFields({ agents: [] }))
	}

	// Recuperar valores del filtro y mostrarlos en el autocomplete
	const initAutocomplete = () => {
		if (agentsState?.length) {
			const temp: Agents[] = []
			agents.forEach((item) => {
				if (agentsState.includes(item.idUser)) {
					temp.push(item)
				}
			})
			handleSetValue(temp)
		}
	}

	useEffect(() => {
		initAutocomplete()
	}, [])

	// Obtener Asesores
	useEffect(() => {
		// Ejecutar servicio
		let idOrgParam: number | null = null
		if (role === SUPERADMIN_ROLE && tempIdOrg) {
			idOrgParam = tempIdOrg
		} else if (idOrg) {
			idOrgParam = idOrg
		}

		if (idOrgParam) {
			resetValues()
			dispatch(getAgents({ idOrg: idOrgParam }))
		}
	}, [tempIdOrg, idOrg, role])

	// Actualiza filtro temporal (cada vez que se actualiza autocomplete)
	useEffect(() => {
		filterAgents()
	}, [agentsSelected])

	// Resetear autocomplete (cuando se resetea el filtro real)
	useEffect(() => {
		if (!agentsState) handleSetValue([])
	}, [agentsState])

	return {
		status: getStatus,
		agents,
		agentsSelected,
		handleSetValue,
	}
}
