import React from 'react'
import { HorariosAtencion } from '@/types/Splits'

export type HorariosContextType = {
	horarios: HorariosAtencion[]
}

export const HorariosContext = React.createContext<HorariosContextType | null>(
	null
)
