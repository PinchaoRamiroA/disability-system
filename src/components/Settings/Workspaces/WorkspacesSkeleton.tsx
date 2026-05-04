import React from 'react'
import { GridContainer } from '@/components/GridContainer'
import { Box, Grid, Paper, Skeleton, Typography } from '@mui/material'

export const WorkspacesSkeleton = () => {
	return (
		<GridContainer>
			<Grid item xs={12}>
				<Typography variant="h5">
					<Skeleton width={200} height={32} />
				</Typography>
			</Grid>

			{/* Skeleton para las tarjetas de workspaces */}
			<Grid item xs={12}>
				<Box display="flex" flexWrap="wrap">
					{/* Generar varios skeletons para simular varias tarjetas */}
					{[1, 2, 3].map((_, index) => (
						<Paper
							key={index}
							sx={{ mr: 2, mb: 2, width: 200, height: 120, p: 2 }}
							elevation={2}
						>
							<Box
								display="flex"
								flexDirection="column"
								alignItems="center"
								sx={{ cursor: 'pointer' }}
							>
								<Skeleton
									variant="circular"
									width={40}
									height={40}
								/>
								<Skeleton
									variant="text"
									width={120}
									height={24}
									sx={{ mt: 1 }}
								/>
							</Box>
						</Paper>
					))}
				</Box>
			</Grid>
		</GridContainer>
	)
}
