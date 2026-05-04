import { useSplitsFilter } from '@/hooks/filters/useSplitsFilter'
import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { FilterItem } from '../FilterItem'
import { FilterClicked } from '@/types/Filter/Filter'

export const SplitsFilter = ({ clicked }: FilterClicked) => {
	const { status, splits, splitsSelected, handleSetValue } = useSplitsFilter()

	return (
		<FilterItem label="Splits" status={status} clicked={clicked}>
			<Autocomplete
				multiple
				options={splits}
				getOptionLabel={(option) => option.nombre ?? ''}
				value={splitsSelected}
				limitTags={3}
				disableCloseOnSelect
				disablePortal
				fullWidth
				onChange={(_, values) => handleSetValue(values)}
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
