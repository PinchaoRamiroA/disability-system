import React from 'react'
import { Divider, Grid } from '@mui/material'

interface Props {
	cols?: number
	my?: number
	padding?: boolean
	order?: number
}

export const GridDivider = ({
	cols = 12,
	my = 2,
	padding = true,
	order,
}: Props) => {
	return (
		<>
			{padding && <Grid item xs={12} />}
			<Grid item xs={cols} my={my} order={order}>
				<Divider />
			</Grid>
		</>
	)
}
