import React from 'react'
import { Workspace } from '@/types/Workspaces'
import { GridContainer } from '@/components/GridContainer'
import { Box, Grid, Paper, Tooltip, Typography } from '@mui/material'
import { useWorkspaceContext } from '@/hooks/contexts/useWorkspaceContext'

import WorkspacesIcon from '@mui/icons-material/Workspaces'

interface Props {
	workspaces: Workspace[]
}

export const Workspaces = ({ workspaces }: Props) => {
	const { setWorkspace } = useWorkspaceContext()

	const handleClick = (_workspace: Workspace) => {
		setWorkspace(_workspace)
	}

	return (
		<GridContainer>
			<Grid item xs={12}>
				<Typography variant="h5">Workspaces configurados</Typography>
			</Grid>

			{/* Tarjetas con workspaces */}
			<Grid item xs={12}>
				<Box display={'flex'} flexWrap={'wrap'}>
					{workspaces.map((workspace) => (
						<Paper
							key={workspace.idWorkSpc}
							sx={{ mr: 2, mb: 2 }}
							elevation={2}
						>
							<Tooltip title={workspace.descName}>
								<Box
									display={'flex'}
									p={2}
									flexDirection={'column'}
									alignItems={'center'}
									sx={{
										cursor: 'pointer',
									}}
									onClick={() => handleClick(workspace)}
								>
									<WorkspacesIcon />
									<Typography
										sx={{
											width: 180,
											textAlign: 'center',
											overflow: 'hidden',
											whiteSpace: 'nowrap',
											textOverflow: 'ellipsis',
										}}
									>
										{workspace.descName}
									</Typography>
								</Box>
							</Tooltip>
						</Paper>
					))}
				</Box>
			</Grid>
		</GridContainer>
	)
}
