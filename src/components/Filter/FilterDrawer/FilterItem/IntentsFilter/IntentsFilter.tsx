import React from 'react'
import { useIntentsFilter } from '@/hooks/filters/useIntentsFilter'
import { Autocomplete, Box, TextField } from '@mui/material'
import { FilterItem } from '../FilterItem'
import { FilterClicked } from '@/types/Filter/Filter'

export const IntentsFilter = ({ clicked }: FilterClicked) => {
	const { status, intents, intentsSelected, handleSetValue } =
		useIntentsFilter()
	return (
		<FilterItem label="Intenciones" status={status} clicked={clicked}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					// border: '1px solid red',
					width: '100%',
					gap: 2,
				}}
			>
				<Autocomplete
					multiple
					filterSelectedOptions
					disablePortal
					id="combo-box-demo"
					options={intents}
					getOptionLabel={(option) =>
						option.label +
						` ${option.quantity ? `(${option.quantity})` : ''}`
					}
					value={intentsSelected}
					onChange={(_, values) => handleSetValue(values)}
					disableCloseOnSelect
					isOptionEqualToValue={(option, value) =>
						option.id === value.id
					}
					renderInput={(params) => (
						<TextField
							{...params}
							name="intents"
							label="Intenciones"
						/>
					)}
					limitTags={3}
					ListboxProps={{
						style: { backgroundColor: '#f9f9f9' },
					}}
				/>
			</Box>
		</FilterItem>
	)
}
