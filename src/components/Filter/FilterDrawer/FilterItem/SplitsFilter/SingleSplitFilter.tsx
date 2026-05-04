import React from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { FilterItem } from '../FilterItem'
import { useSingleSplitsFilter } from '@/hooks/filters/useSingleSplitFilter'
import { FilterClicked } from '@/types/Filter/Filter'

export const SingleSplitFilter = ({ clicked }: FilterClicked) => {
	const { status, splits, splitSelected, handleSetValue } =
		useSingleSplitsFilter()

	return (
		<FilterItem label="Split" status={status} clicked={clicked}>
			<Autocomplete
				options={splits}
				getOptionLabel={(option) => option.nombre ?? ''}
				value={splitSelected}
				fullWidth
				disablePortal
				onChange={(_, value) => handleSetValue(value)}
				renderOption={(props, option) => (
					<li {...props} key={option.idSplit}>
						{option.nombre}
					</li>
				)}
				renderInput={(params) => (
					<TextField {...params} name="splits" label="Splits" />
				)}
				ListboxProps={{
					style: { backgroundColor: '#f9f9f9' },
				}}
			/>
		</FilterItem>
	)
}
