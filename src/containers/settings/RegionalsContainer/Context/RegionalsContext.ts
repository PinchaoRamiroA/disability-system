import React from 'react'
import { RegionsList } from '@/types/Locations'

export type RegionalsContextType = {
	regionales: RegionsList[]
	currentRegional: RegionsList | null
	setRegional: (value: RegionsList) => void
}

export const RegionalsContext =
	React.createContext<RegionalsContextType | null>(null)
