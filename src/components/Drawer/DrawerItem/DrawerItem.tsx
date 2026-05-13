import React from 'react'
import ListItemText from '@mui/material/ListItemText'
import { CustomListItemButton } from '../styles'
import { useRouter } from 'next/router'

export const DrawerItem = ({
	path,
	label,
}: {
	path: string
	label: string
}) => {
	const router = useRouter()
	const isActive = router.asPath.includes(`/${path}`)

	const handleClick = () => {
		router.push(`/${path}`)
	}

	return (
		<CustomListItemButton selected={isActive} onClick={handleClick}>
			<ListItemText
				primary={label}
				primaryTypographyProps={{
					...(isActive && { fontWeight: 600 }),
				}}
			/>
		</CustomListItemButton>
	)
}