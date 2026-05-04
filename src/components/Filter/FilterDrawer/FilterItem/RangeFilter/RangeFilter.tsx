import React from 'react'
import { Grid, IconButton, TextField, Typography } from '@mui/material'
import { FilterItem } from '../FilterItem'
import { useEntriesFilter } from '@/hooks/filters/useEntriesFilter'
import ClearIcon from '@mui/icons-material/Clear'
import { maxEntriesSelector } from '@/store/slices/reports/humanAgent/history'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { GridContainer } from '@/components/GridContainer'
import { FilterClicked } from '@/types/Filter/Filter'

export const RangeFilter = ({ clicked }: FilterClicked) => {
	const { resource: maxEntries, getStatus } =
		useAppSelector(maxEntriesSelector)
	const { since, until, handleSetSince, handleSetUntil } =
		useEntriesFilter(maxEntries)

	return (
		<FilterItem
			label="Número de conversaciones"
			clicked={clicked}
			status={getStatus}
		>
			<GridContainer>
				<Grid item xs={12}>
					<Typography variant="body2">
						El número máximo de conversaciones es{' '}
						<strong>{maxEntries}</strong>
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
						value={Number(until) > maxEntries ? maxEntries : until}
						onChange={(e) => handleSetUntil(e.target.value)}
						InputProps={{
							inputProps: {
								max: maxEntries,
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
			</GridContainer>
		</FilterItem>
	)
}
