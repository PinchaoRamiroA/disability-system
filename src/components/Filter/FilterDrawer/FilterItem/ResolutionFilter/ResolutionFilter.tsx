import { useResolutionFilter } from '@/hooks/filters/useResolutionFilter'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import React from 'react'
import { FilterItem } from '../FilterItem'
import { FilterClicked } from '@/types/Filter/Filter'
// import { CheckBox } from '../Inputs/CheckBox'

export const ResolutionFilter = ({ clicked }: FilterClicked) => {
	const { resolutions, handleChange } = useResolutionFilter()

	return (
		<FilterItem label="Resolución" clicked={clicked}>
			<FormGroup sx={{ paddingInlineStart: 5 }}>
				{resolutions.map((res) => {
					return (
						<FormControlLabel
							key={res.value}
							name="channels"
							control={
								<Checkbox
									value={res.value}
									onChange={handleChange}
									checked={res.checked}
								/>
							}
							label={res.label}
						/>
					)
				})}
			</FormGroup>
		</FilterItem>
	)
}
