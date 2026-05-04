import React, { useEffect } from 'react'
import { FilterItem } from '../FilterItem'
import { Autocomplete, TextField } from '@mui/material'
import { useChannelFilter } from '@/hooks/filters/useChannelFilter'

export const ChannelFilter = () => {
	const { status, channels, channelsSelected, handleSetValue } =
		useChannelFilter()

	useEffect(() => {
		handleSetValue(channels.filter((ch) => ch.checked === true))
	}, [channels])

	return (
		<FilterItem label="Canales" status={status}>
			<Autocomplete
				multiple
				options={channels}
				getOptionLabel={(option) => option.label ?? ''}
				value={channelsSelected}
				disableCloseOnSelect
				disablePortal
				fullWidth
				onChange={(_, values) => handleSetValue(values)}
				renderOption={(props, option) => (
					<li {...props} key={option.id}>
						{option.label}
					</li>
				)}
				isOptionEqualToValue={(option, value) => option.id === value.id}
				renderInput={(params) => (
					<TextField {...params} name="channels" label="Canales" />
				)}
				ListboxProps={{
					style: { backgroundColor: '#f9f9f9' },
				}}
			/>
		</FilterItem>
	)
}
