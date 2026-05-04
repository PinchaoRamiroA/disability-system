import React from 'react'
import { Box, Grid, IconButton, Paper, Skeleton } from '@mui/material'
import { ArrowBack, Edit, Delete } from '@mui/icons-material'

export const WorkspaceAnswerDetailsSkeleton = () => {
	return (
		<Box>
			<Grid container spacing={2}>
				{/* Título y botón de regresar */}
				<Grid item xs={12} display={'flex'} alignItems={'center'}>
					<IconButton>
						<ArrowBack />
					</IconButton>
					<Skeleton variant="text" width={200} height={40} />
				</Grid>

				{/* Descripción */}
				<Grid item xs={12}>
					<Paper elevation={0}>
						<Box p={2}>
							<Skeleton variant="text" width="80%" height={20} />
						</Box>
					</Paper>
				</Grid>

				{/* Lista de detalles con botones de editar/eliminar */}
				<Grid item xs={12}>
					<Paper>
						{[...Array(3)].map((_, index) => (
							<Grid
								container
								key={index}
								sx={{
									':hover': {
										backgroundColor: 'rgba(0, 0, 0, 0.04)',
									},
									borderBottom: '1px solid #f1f1f1',
								}}
								alignItems={'center'}
								p={2}
								gap={2}
							>
								<Grid
									item
									xs="auto"
									sm={2}
									md={1}
									textAlign="center"
								>
									<Skeleton
										variant="circular"
										width={40}
										height={40}
									/>
								</Grid>
								<Grid item xs>
									<Skeleton
										variant="text"
										width="100%"
										height={20}
									/>
								</Grid>
								<Grid item xs="auto">
									<IconButton>
										<Edit />
									</IconButton>
									<IconButton>
										<Delete />
									</IconButton>
								</Grid>
							</Grid>
						))}
					</Paper>
				</Grid>
			</Grid>
		</Box>
	)
}
