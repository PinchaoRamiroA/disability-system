import React from 'react'
import { Card, CardContent, Grid, Skeleton } from '@mui/material'
import { Email, LocationOn, Phone } from '@mui/icons-material'

export const ContactCardSkeleton = () => {
	return (
		<Grid item xs={12} sm={4}>
			<Card
				sx={{
					m: 1,
					height: '100%', // Para que todas las tarjetas tengan la misma altura
					transition: '0.3s',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between', // Mantener la consistencia interna
				}}
			>
				<CardContent>
					<Grid container gap={1}>
						<Grid item xs={12}>
							<Skeleton />
						</Grid>
						<Grid item xs="auto">
							<Phone fontSize="small" />
						</Grid>
						<Grid item xs>
							<Skeleton />
						</Grid>
						<Grid item xs={12} />
						<Grid item xs="auto">
							<Email fontSize="small" />
						</Grid>
						<Grid item xs>
							<Skeleton />
						</Grid>
						<Grid item xs={12} />
						<Grid item xs="auto">
							<LocationOn fontSize="small" />
						</Grid>
						<Grid item xs>
							<Skeleton />
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</Grid>
	)
}
