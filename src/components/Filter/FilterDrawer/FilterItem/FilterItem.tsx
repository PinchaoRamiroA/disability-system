import React, { useEffect, useState } from 'react'
import Collapse from '@mui/material/Collapse'
import { Box, Divider, ListItemButton, ListItemText } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Status } from '@/types/status'
import CircularProgress from '@mui/material/CircularProgress'
import { FilterClicked } from '@/types/Filter/Filter'

export const SelectIcon = ({ toggleCollapse, status }: Props2) => {
	if (status === 'pending') {
		return <CircularProgress size={15} thickness={5} />
	}

	if (toggleCollapse) {
		return <ExpandLess fontSize="small" />
	} else {
		return <ExpandMore fontSize="small" />
	}
}

interface Props extends FilterClicked {
	children: React.ReactNode
	label: string
	status?: Status
	onlyChildren?: boolean
}

export const FilterItem = ({
	status,
	label,
	children,
	clicked,
	onlyChildren = false,
}: Props) => {
	const [toggleCollapse, setToggleCollapse] = useState(false)

	const handleToggleClick = () => {
		setToggleCollapse((prevState) => !prevState)
	}

	// Colapsar item en caso de que se haya clickeado en el resumen del filtro u ocultar en caso contrario
	useEffect(() => {
		setToggleCollapse(Boolean(clicked))
	}, [clicked])

	if (onlyChildren) {
		return <React.Fragment> {children} </React.Fragment>
	}
	return (
		<React.Fragment>
			<ListItemButton
				disabled={status === 'pending' || status === 'rejected'}
				onClick={handleToggleClick}
				sx={{
					background: (theme) =>
						status === 'rejected'
							? theme.palette.error.light
							: 'default',
					'&:hover': {
						background: (theme) =>
							status === 'rejected'
								? theme.palette.error.light
								: 'default',
					},
				}}
			>
				<ListItemText primary={label} />
				<SelectIcon status={status} toggleCollapse={toggleCollapse} />
			</ListItemButton>
			<Collapse in={toggleCollapse} timeout="auto">
				<Box sx={{ display: 'flex', flexDirection: 'column' }}>
					<Box
						sx={{
							padding: 2,
							display: 'flex',
							// justifyContent: 'center',
						}}
					>
						{children}
					</Box>
				</Box>
			</Collapse>
			<Divider />
		</React.Fragment>
	)
}

interface Props2 {
	toggleCollapse: boolean
	status?: Status
}
