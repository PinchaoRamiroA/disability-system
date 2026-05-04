import React from 'react'
import { FilterName } from '@/types/Filter/Filter'

export type FilterContextType = {
	filtersOpen: boolean
	openFilters: () => void
	closeFilters: () => void
	clickedFilter: FilterName | undefined
	setClickedFilter: (filter: FilterName) => void
}
export const FilterContext = React.createContext<FilterContextType | null>(null)
