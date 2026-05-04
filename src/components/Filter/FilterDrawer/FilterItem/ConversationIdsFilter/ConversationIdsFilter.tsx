import React from 'react'
import { FilterClicked } from '@/types/Filter/Filter'
import { Autocomplete, Box, Chip, TextField } from '@mui/material'
import { FilterItem } from '../FilterItem'
import { useConversationIdsFilter } from '@/hooks/filters/useConversationIdsFilter'

export const ConversationIdsFilter = ({ clicked }: FilterClicked) => {
	const { values, handleSetValue } = useConversationIdsFilter()

	return (
		<FilterItem label="IDs de conversación" clicked={clicked}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					gap: 2,
				}}
			>
				<Autocomplete
					multiple
					freeSolo
					id="tags-filled"
					options={[]}
					value={values}
					// Cambiar el tipo de evento para que acepte strings del freeSolo
					onChange={(_, newValue) => handleSetValue(newValue)}
					renderTags={(value, getTagProps) =>
						value.map((option, index) => {
							const { key, ...tagProps } = getTagProps({ index })
							return (
								<Chip
									key={key}
									{...tagProps}
									variant="outlined"
									label={option}
								/>
							)
						})
					}
					renderInput={(params) => (
						<TextField
							{...params}
							variant="standard"
							label="Escribe un ID y presiona Enter"
							placeholder="Ej: 12345"
						/>
					)}
				/>
			</Box>
		</FilterItem>
	)
}
