import React from 'react'
import { HorariosContext } from '@/contexts/HorariosSplitContex'
import { HorariosAtencion } from '@/types/Splits'
import { RenderDay } from './RenderDay'

interface Props {
	horarios: HorariosAtencion[]
	idSplit: number
}

export const Horario = ({ horarios, idSplit }: Props) => {
	const getDayLabel = (id: number) => {
		if (id === 10) return 'Lunes'
		else if (id === 20) return 'Martes'
		else if (id === 30) return 'Miércoles'
		else if (id === 40) return 'Jueves'
		else if (id === 50) return 'Viernes'
		else if (id === 60) return 'Sábado'
		else if (id === 70) return 'Domingo'
		else return ''
	}

	return (
		<HorariosContext.Provider value={{ horarios }}>
			{[10, 20, 30, 40, 50, 60, 70].map((day) => (
				<RenderDay
					idDay={day}
					idSplit={idSplit}
					label={getDayLabel(day)}
					key={day}
				/>
			))}
		</HorariosContext.Provider>
	)
}
