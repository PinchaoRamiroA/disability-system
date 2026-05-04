import { Divider, Drawer } from '@mui/material'
import React from 'react'
import { DrawerHeader } from './DrawerHeader'
import { DrawerBody } from './DrawerBody'
import { ApplyFilters } from '@/types/Filter/Filter'

import { resetFilter, updateFields } from '@/store/slices/Filter'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { useFilterContext } from '@/hooks/contexts/useFilterContext'

const drawerMaxWidth = 430
const drawerMinWidth = 320
interface Props {
	filters: ApplyFilters
}

export const FilterDrawer = ({ filters }: Props) => {
	const dispatch = useAppDispatch()
	const { closeFilters, filtersOpen } = useFilterContext()

	const state = useAppSelector((state) => state)

	// Aplicar filtros (actualiza el state con los valores del estado temporal del filtro 'tempFilter')
	const handleFilter = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		// Setear undefined para los filtros de tipo array si su longitud es 0
		dispatch(
			updateFields({
				...state.filter,
				...state.tempFilter,
			})
		)
		closeFilters()
		// console.log(state)
		// console.log(state.tempFilter)
	}

	const resetFilters = () => {
		// Resetear filtro
		dispatch(resetFilter())
	}

	return (
		<Drawer
			sx={{
				zIndex: (theme) => ({ sm: theme.zIndex.drawer * 3 + 1 }),
				width: '100%',
				maxWidth: drawerMaxWidth,
				minWidth: drawerMinWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: '100%',

					maxWidth: drawerMaxWidth,
					minWidth: drawerMinWidth,
					boxSizing: 'border-box',
				},
			}}
			anchor="right"
			open={filtersOpen}
			onClose={closeFilters}
			ModalProps={{
				keepMounted: true,
			}}
		>
			<DrawerHeader resetFilters={resetFilters} />
			<Divider />
			<DrawerBody filters={filters} handleFilter={handleFilter} />
		</Drawer>
	)
}
