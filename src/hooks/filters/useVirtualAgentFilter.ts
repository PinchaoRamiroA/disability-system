import { updateFields } from '@/store/slices/Filter'
import { updateTempFields } from '@/store/slices/Filter/temp_slice'
import { virtualAgentsSelector } from '@/store/slices/virtualAgent'
import { VirtualAgent } from '@/types/VirtualAgent'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import { useCompanyAndIdVa } from '../useCompanyAndIdVa'

export const useVirtualAgentFilter = () => {
	const dispatch = useAppDispatch()
	// Reducer de asesor virtuales
	const { getStatus, resource: agents } = useAppSelector(
		virtualAgentsSelector
	)
	const { idVa } = useCompanyAndIdVa()

	const [value, setValue] = useState<VirtualAgent | null>(null)
	const [inputValue, setInputValue] = useState('')

	const handleChange = (newValue: VirtualAgent | null) => setValue(newValue)
	const handleSetInputValue = (value: string) => setInputValue(value)

	const setDefaultAgent = (_dispatch = false) => {
		setValue(agents[0])

		if (_dispatch) {
			dispatch(updateFields({ idVa: agents[0].idVa }))
		}
	}

	// Actualiza el state del filtro temporal
	const filterVirtualAgent = () => {
		if (value) {
			dispatch(updateTempFields({ idVa: value.idVa }))
		}
		// Valor por defecto (evita que el autocomplete quede en blanco)
		else {
			setDefaultAgent()
		}
	}

	// Definir asesor virtual por defecto
	useEffect(() => {
		if (agents.length) {
			setDefaultAgent()
		} else {
			setValue(null)
		}
	}, [agents])

	// Actualizar state del asesor virtual (al cambiar en autocomplete o resetear)
	useEffect(() => {
		filterVirtualAgent()
	}, [value])

	// Detectar cambios en state y actualizarlo si se se resetea
	useEffect(() => {
		if (!idVa) {
			if (agents.length) {
				setDefaultAgent(true)
			}
		}
	}, [idVa])

	return {
		status: getStatus,
		agents,
		value,
		inputValue,
		handleChange,
		handleSetInputValue,
		setDefaultAgent,
	}
}
