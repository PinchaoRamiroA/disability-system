import React from 'react'
import { FilterItem } from '../FilterItem'
import { Autocomplete, TextField } from '@mui/material'
import { useAgentsFilter } from '@/hooks/filters/useAgentsFilter'
import { FilterClicked } from '@/types/Filter/Filter'

export const AgentsFilter = ({ clicked }: FilterClicked) => {
	const { agents, agentsSelected, handleSetValue, status } = useAgentsFilter()

	return (
		<FilterItem label="Asesores" status={status} clicked={clicked}>
			<Autocomplete
				multiple
				options={agents}
				getOptionLabel={(option) => option.fullName ?? ''}
				value={agentsSelected}
				limitTags={3}
				disableCloseOnSelect
				disablePortal
				fullWidth
				onChange={(_, values) => handleSetValue(values)}
				renderOption={(props, option) => (
					<li {...props} key={option.idUser}>
						{option.fullName}
					</li>
				)}
				renderInput={(params) => (
					<TextField {...params} name="agents" label="Asesores" />
				)}
				ListboxProps={{
					style: { backgroundColor: '#f9f9f9' },
				}}
			/>
		</FilterItem>
	)
}
