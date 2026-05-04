import { useEventsFilter } from '@/hooks/filters/useEventsFilter'
import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { FilterItem } from '../FilterItem'
import { FilterClicked } from '@/types/Filter/Filter'

export const EventsFilter = ({ clicked }: FilterClicked) => {
	const { status, events, eventsSelected, handleSetValue } = useEventsFilter()

	return (
		<FilterItem label="Eventos" status={status} clicked={clicked}>
			<Autocomplete
				multiple
				options={events}
				getOptionLabel={(option) => option.eventName ?? ''}
				value={eventsSelected}
				limitTags={3}
				disableCloseOnSelect
				disablePortal
				fullWidth
				onChange={(_, values) => handleSetValue(values)}
				renderInput={(params) => (
					<TextField {...params} name="events" label="Eventos" />
				)}
				ListboxProps={{
					style: { backgroundColor: '#f9f9f9' },
				}}
			/>
		</FilterItem>
	)
}
