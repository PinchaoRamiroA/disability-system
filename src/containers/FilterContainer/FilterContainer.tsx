import React, { useEffect } from 'react'

import { FilterDrawer } from '@/components/Filter/FilterDrawer'
import { FilterResume } from '@/components/Filter/FilterResume'
import { Box, Button, Grid, Paper } from '@mui/material'
import TuneIcon from '@mui/icons-material/Tune'

import { ApplyFilters } from '@/types/Filter/Filter'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { userSelector } from '@/store/slices/authentication'
import {
	ADMIN_ROLE,
	SUPERADMIN_ROLE,
	SUPERVIEWER_ROLE,
	VIEWER_ROLE,
} from '@/utils/constants/roles'
import { useFilterContext } from '@/hooks/contexts/useFilterContext'

interface Props {
	filters?: ApplyFilters
}

const defaultFilters: ApplyFilters = {
	dates: true,
}

export const FilterContainer = ({ filters = {} }: Props) => {
	const mergedFilters = { ...defaultFilters, ...filters }
	const { openFilters, clickedFilter } = useFilterContext()

	const { role } = useAppSelector(userSelector)

	// Abrir filtros cuando se da click en un filtro del resumen
	useEffect(() => {
		if (clickedFilter) {
			openFilters()
		}
	}, [clickedFilter])

	// Función para saber si se oculta la sección "Filtros aplicados"
	const showOtherFilters = () => {
		let totalFilters = Object.keys(mergedFilters).length

		// Restar filtros que no aparecen dependiendo del rol
		if (!(role === SUPERADMIN_ROLE || role === SUPERVIEWER_ROLE)) {
			if (mergedFilters.companies) {
				totalFilters--
			}
		}

		if (!(role === ADMIN_ROLE || role === VIEWER_ROLE)) {
			if (mergedFilters.virtualAgent) {
				totalFilters--
			}
		}

		if (mergedFilters.dates && mergedFilters.channels)
			return totalFilters > 2
		else if (mergedFilters.dates || mergedFilters.channels)
			return totalFilters > 1
		return false
	}

	return (
		<React.Fragment>
			<Grid item xs={12} container>
				<Paper sx={{ width: '100%' }}>
					<Box padding={1}>
						<Grid container>
							<Grid item xs={12} sm paddingX={1}>
								<FilterResume
									filters={mergedFilters}
									role={role}
									showFilters={showOtherFilters()}
								/>
							</Grid>

							<Grid
								item
								xs
								sm="auto"
								paddingRight={1}
								textAlign="end"
							>
								<Button
									variant="contained"
									color="primary"
									onClick={openFilters}
									endIcon={<TuneIcon />}
								>
									Filtrar
								</Button>
							</Grid>
						</Grid>
					</Box>
				</Paper>
			</Grid>

			<FilterDrawer filters={mergedFilters} />
		</React.Fragment>
	)
}
