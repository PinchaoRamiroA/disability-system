import React from 'react'
import { useAttentionFilter } from '@/hooks/filters/useAttentionFilter'
import { Box, FormControlLabel, ListItemText, Switch } from '@mui/material'
import { FilterClicked } from '@/types/Filter/Filter'
import { FilterItem } from '../FilterItem'

export const AttentionFilter = ({ clicked }: FilterClicked) => {
	const { attentionState, handleChange } = useAttentionFilter()

	return (
		<FilterItem onlyChildren clicked={clicked} label="">
			<Box p={2} display="flex" justifyContent="space-between">
				<ListItemText primary="Atención" />
				<FormControlLabel
					key={attentionState.value}
					control={
						<Switch
							value={attentionState.value}
							onChange={handleChange}
							checked={attentionState.checked}
						/>
					}
					label={attentionState.label}
				/>
			</Box>
		</FilterItem>
	)
}
