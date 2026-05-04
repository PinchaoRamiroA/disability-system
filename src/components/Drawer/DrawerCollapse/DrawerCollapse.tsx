import React, { useEffect, useState } from 'react'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ListItemText from '@mui/material/ListItemText'

import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

import { CustomListItemButton } from '../styles'
import { useRouter } from 'next/router'
import { Divider } from '@mui/material'
import { useSidebarContext } from '@/hooks/contexts/useSidebarContext'

export const DrawerCollapse = ({
	label,
	height,
	children,
	parent,
	path,
}: {
	label: string
	path: string
	height: number
	children: React.ReactNode
	parent?: boolean
}) => {
	const router = useRouter()
	const [toggleCollapse, setToggleCollapse] = useState(false)
	const isActive = router.asPath.includes(path)
	const { collapsableItems, setCollapsableItems } = useSidebarContext()

	const handleToggleClick = () => {
		// Buscar path en context y pasar a false el estado collapse de todas opciones con el mismo height
		const temp = collapsableItems.map((item) => {
			// Colapsar opción clickeada
			if (item.path === path) {
				return {
					...item,
					collapsed: !toggleCollapse,
				}
			}
			// Descolapsar items del menú que están al mismo nivel de la opción clickeada
			else if (item.height >= height) {
				return {
					...item,
					collapsed: false,
				}
			}

			return item
		})
		setCollapsableItems(temp)
		setToggleCollapse((prevState) => !prevState)
	}

	const isRootCollapse = height === 0

	useEffect(() => {
		// Buscar item y obtener estado de collapse
		collapsableItems.forEach((item) => {
			if (item.path === path) {
				setToggleCollapse(item.collapsed)
			}
		})
	}, [collapsableItems])

	return (
		<>
			<CustomListItemButton
				selected={(parent && toggleCollapse) || isActive}
				onClick={handleToggleClick}
				sx={{
					...(!parent &&
						(toggleCollapse || isActive) && {
							backgroundColor: '#F5F5F5',
						}),
					...(isActive && {
						color: 'secondary.main',
					}),
				}}
			>
				{/* Subopciones */}
				{!isRootCollapse && (
					<FiberManualRecordIcon
						sx={{
							fontSize: 6,
							ml: 4,
							mr: 1,
							// ...(toggleCollapse && ! && { fontSize: 8, color: 'secondary.main' }),
						}}
					/>
				)}
				<ListItemText
					primary={label}
					primaryTypographyProps={{
						...(toggleCollapse && {
							fontWeight: 500,
							// color: !isRootCollapse ? 'secondary.main' : 'inherit',
						}),
						...(isActive && {
							fontWeight: 800,
						}),
					}}
				/>
				{toggleCollapse ? (
					<ExpandLess fontSize="small" />
				) : (
					<ExpandMore fontSize="small" />
				)}
			</CustomListItemButton>
			<Collapse in={toggleCollapse} timeout="auto">
				<List component="div" disablePadding>
					{isRootCollapse && (
						<Divider
							id="divider"
							orientation="vertical"
							sx={{
								left: 35,
								// top: 5,
								bottom: 5,
								position: 'absolute',
							}}
						/>
					)}
					{children}
				</List>
			</Collapse>
		</>
	)
}
