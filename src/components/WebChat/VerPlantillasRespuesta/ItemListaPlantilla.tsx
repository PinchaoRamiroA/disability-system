import React from 'react'
import { ListItem, ListItemButton, ListItemText } from '@mui/material'

interface Props {
	handleClick: () => void
	templateName: string
	selected: boolean
}

export const ItemListaPlantilla = ({
	handleClick,
	templateName,
	selected,
}: Props) => {
	return (
		<ListItem disablePadding>
			<ListItemButton
				selected={selected}
				onClick={handleClick}
				sx={{
					borderBottom: 1,
					borderColor: '#E5E5E5',
				}}
			>
				<ListItemText primary={templateName} />
			</ListItemButton>
		</ListItem>
	)
}
