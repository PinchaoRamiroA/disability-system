// src/components/Skeletons/ParametrosUsuariosSkeleton.tsx

import { Grid, Skeleton, Typography } from '@mui/material'

export const ParametrosUsuariosSkeleton = () => {
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Skeleton variant="text" width={400} height={40} />
			</Grid>

			<Grid item xs={12}>
				<Typography variant="body1">
					<Skeleton variant="text" width={300} />
				</Typography>
			</Grid>

			<Grid item xs={12} sm={8} md={4}>
				<Skeleton variant="rectangular" width="100%" height={56} />
			</Grid>

			<Grid item xs="auto">
				<Skeleton variant="rectangular" width={120} height={40} />
			</Grid>

			<Grid item xs={12}>
				<Typography variant="body1">
					<Skeleton variant="text" width={300} />
				</Typography>
			</Grid>

			<Grid item xs={12} sm={8} md={4}>
				<Skeleton variant="rectangular" width="100%" height={56} />
			</Grid>

			<Grid item xs="auto">
				<Skeleton variant="rectangular" width={120} height={40} />
			</Grid>
		</Grid>
	)
}
