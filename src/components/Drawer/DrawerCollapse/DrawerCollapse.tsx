import React, { useState } from 'react'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ListItemText from '@mui/material/ListItemText'

import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import { CustomListItemButton } from '../styles'

export const DrawerCollapse = ({
	label,
	children,
}: {
	label: string
	children: React.ReactNode
}) => {
	const [toggleCollapse, setToggleCollapse] = useState(false)

	const handleToggleClick = () => {
		setToggleCollapse((prevState) => !prevState)
	}

	return (
		<>
			<CustomListItemButton onClick={handleToggleClick}>
				<ListItemText primary={label} />
				{toggleCollapse ? (
					<ExpandLess fontSize="small" />
				) : (
					<ExpandMore fontSize="small" />
				)}
			</CustomListItemButton>
			<Collapse in={toggleCollapse} timeout="auto">
				<List component="div" disablePadding>
					{children}
				</List>
			</Collapse>
		</>
	)
}