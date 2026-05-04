import React from 'react'
import { Grid, IconButton, TextField, Typography } from '@mui/material'
import { FilterItem } from '../FilterItem'
import ClearIcon from '@mui/icons-material/Clear'
import { useEntriesFilter } from '@/hooks/filters/useEntriesFilter'
import { FilterClicked } from '@/types/Filter/Filter'

export const EntriesFilter = ({ clicked }: FilterClicked) => {
	const { since, until, handleSetSince, handleSetUntil } = useEntriesFilter()

	return (
		<FilterItem label="Rango de ingresos" clicked={clicked}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography
						variant="caption"
						component="small"
						color="#0298b1"
					>
						El valor Desde no debe ser mayor a Hasta
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6} marginTop={1.5}>
					<TextField
						label="Desde"
						type="number"
						name="userId"
						value={since}
						onChange={(e) => handleSetSince(e.target.value)}
						InputProps={{
							inputProps: {
								// max: 100,
								min: 0,
							},
							endAdornment: (
								<IconButton
									size="small"
									onClick={() => handleSetSince('')}
								>
									<ClearIcon />
								</IconButton>
							),
						}}
						fullWidth
					/>
				</Grid>
				<Grid item xs={12} sm={6} marginTop={1.5}>
					<TextField
						label="Hasta"
						type="number"
						name="userId"
						value={until}
						onChange={(e) => handleSetUntil(e.target.value)}
						InputProps={{
							inputProps: {
								// max: 100,
								min: 0,
							},
							endAdornment: (
								<IconButton
									size="small"
									onClick={() => handleSetUntil('')}
								>
									<ClearIcon />
								</IconButton>
							),
						}}
						fullWidth
					/>
				</Grid>
			</Grid>
		</FilterItem>
	)
}
