import React, { useState } from 'react'
import { FilterContext } from '@/contexts/FilterContext'
import { FilterName } from '@/types/Filter/Filter'

export const FilterLayout = ({ children }: { children: React.ReactNode }) => {
	const [filtersOpen, setFiltersOpen] = useState(false)
	const [clickedFilter, setClickedFilter] = useState<FilterName | undefined>()

	const openFilters = () => {
		setFiltersOpen(true)
	}

	const closeFilters = () => {
		setClickedFilter(undefined)
		setFiltersOpen(false)
	}

	return (
		<FilterContext.Provider
			value={{
				clickedFilter,
				closeFilters,
				filtersOpen,
				openFilters,
				setClickedFilter,
			}}
		>
			{children}
		</FilterContext.Provider>
	)
}
