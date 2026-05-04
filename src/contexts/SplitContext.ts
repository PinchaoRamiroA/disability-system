import React from 'react'
import { Splits } from '@/types/Splits'

export type SplitContextType = {
	currentSplit: Splits
	setCurrentSplit: (value: Splits) => void
}

export const SplitContext = React.createContext<SplitContextType | null>(null)
