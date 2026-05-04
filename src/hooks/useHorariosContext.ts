import { HorariosContext } from '@/contexts/HorariosSplitContex'
import { useContext } from 'react'

export const useHorariosContext = () => {
	const context = useContext(HorariosContext)

	if (!context) {
		throw new Error(
			'useHorariosContext must be used within a HorariosContextProvider'
		)
	}

	return context
}
