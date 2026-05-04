import React from 'react'
import { GridContainer } from '@/components/GridContainer'
import {
	Box,
	Button,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Skeleton,
	Tooltip,
	Typography,
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

export const WorkspaceAnswersSkeleton = () => {
	return (
		<GridContainer>
			{/* Encabezado */}
			<Grid
				item
				xs={12}
				alignItems={'center'}
				display={'flex'}
				justifyContent={'space-between'}
			>
				<Box display={'flex'} alignItems={'center'}>
					<Tooltip title="Volver a Workspaces">
						<IconButton>
							<ArrowBack />
						</IconButton>
					</Tooltip>
					<Typography variant="h5">
						<Skeleton width={180} height={32} />
					</Typography>
				</Box>
				<Skeleton variant="rectangular">
					<Button
						variant="contained"
						disabled
						sx={{ width: 160, height: 36 }}
					/>
				</Skeleton>
			</Grid>

			{/* Búsqueda */}
			<Grid item xs={12}>
				<Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
			</Grid>

			{/* Listado de respuestas */}
			<Grid item xs={12}>
				<Box
					sx={{
						backgroundColor: 'background.paper',
						overflow: 'auto',
						maxHeight: `calc(100vh - ${56 * 4}px)`,
					}}
				>
					<List>
						{[1, 2, 3, 4].map((_, index) => (
							<ListItem
								key={index}
								sx={{ borderBottom: '1px solid #f1f1f1' }}
								disablePadding
							>
								<ListItemButton>
									<ListItemText
										primary={
											<Skeleton
												variant="text"
												width="60%"
											/>
										}
										secondary={
											<Skeleton
												variant="text"
												width="80%"
											/>
										}
									/>
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Box>
			</Grid>
		</GridContainer>
	)
}
