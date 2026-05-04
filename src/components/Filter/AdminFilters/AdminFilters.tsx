import React from 'react'
import { Grid, Paper } from '@mui/material'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { userSelector } from '@/store/slices/authentication'
import { ADMIN_ROLE, SUPERADMIN_ROLE } from '@/utils/constants/roles'
import { CompanyFilter } from '../FilterDrawer/FilterItem/CompanyFilter'
import { VirtualAgentFilter } from '../FilterDrawer/FilterItem/VirtualAgentFilter'
import { GridDivider } from '@/components/GridDivider'

interface Props {
	includeIdVa?: boolean
}

export const AdminFilters = ({ includeIdVa = true }: Props) => {
	const { role } = useAppSelector(userSelector)

	return (
		<React.Fragment>
			{/* Filtro de organización y asistente virtual */}
			<Grid container item xs gap={2} justifyContent="flex-start">
				{role === SUPERADMIN_ROLE && (
					<Grid item xs sm={6} md={4}>
						<Paper elevation={0}>
							<CompanyFilter settings />
						</Paper>
					</Grid>
				)}
				{includeIdVa &&
					(role === SUPERADMIN_ROLE || role === ADMIN_ROLE) && (
						<Grid item xs sm={6} md={4}>
							<Paper elevation={0}>
								<VirtualAgentFilter settings />
							</Paper>
						</Grid>
					)}
			</Grid>

			{includeIdVa && <GridDivider my={1} padding={false} />}
		</React.Fragment>
	)
}
