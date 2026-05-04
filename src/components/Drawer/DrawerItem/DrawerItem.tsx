import React from 'react'
import ListItemText from '@mui/material/ListItemText'
import { CustomListItemButton } from '../styles'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLoading } from '@/hooks/useLoading'

export const DrawerItem = ({
	path,
	label,
	height,
}: {
	path: string
	label: string
	height: number
}) => {
	const router = useRouter()
	const { startLoading } = useLoading()
	const isActive = router.asPath === `/${path}`

	let marginLeft: 0 | 4 | 7 = 0

	if (height === 1) {
		marginLeft = 4
	} else if (height > 1) {
		marginLeft = 7
	}

	const isBackgroundHighlighted = height === 0 && isActive

	const styleColor = isActive && { color: 'secondary.main' }

	return (
		<Link href={`/${path}`} passHref>
			<CustomListItemButton
				{...{ component: 'a' }}
				selected={isBackgroundHighlighted || isActive}
				{...(!isActive && {
					onClick: () => startLoading(),
				})}
			>
				<>
					<FiberManualRecordIcon
						sx={{
							fontSize: 6,
							ml: marginLeft,
							mr: 1,
							...(isActive && { fontSize: 8, ...styleColor }),
						}}
					/>
					<ListItemText
						primary={label}
						primaryTypographyProps={{
							...(isActive && { fontWeight: 800, ...styleColor }),
						}}
					/>
				</>
			</CustomListItemButton>
		</Link>
	)
}
