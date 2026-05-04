import React from 'react'
import { IconButton, TextField } from '@mui/material'
import { FilterItem } from '../FilterItem'

import ClearIcon from '@mui/icons-material/Clear'
import { useConversationIdFilter } from '@/hooks/filters/useConversationIdFilter'
import { FilterClicked } from '@/types/Filter/Filter'

export const ConversationIdFilter = ({ clicked }: FilterClicked) => {
	const { handleSetValue, idConv } = useConversationIdFilter()

	return (
		<FilterItem label="Id conversación" clicked={clicked}>
			<TextField
				label="Id conversación"
				type="number"
				name="idConv"
				value={idConv}
				onChange={(e) => handleSetValue(e.target.value)}
				InputProps={{
					endAdornment: (
						<IconButton
							size="small"
							onClick={() => handleSetValue('')}
						>
							<ClearIcon />
						</IconButton>
					),
				}}
				fullWidth
			/>
		</FilterItem>
	)
}
