import React from 'react'
import {
	Avatar,
	Box,
	IconButton,
	Toolbar,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material'
import { LogoTab } from './LogoTab'
import { Analytics, Menu } from '@mui/icons-material'

export const MiniAppbar = ({ icons = true }: { icons?: boolean }) => {
	const { toolbar } = useTheme()

	return (
		<Box width="100%">
			<Tooltip
				title="Appbar"
				sx={{
					backgroundColor: toolbar.background,
					color: toolbar.color,
				}}
			>
				<Toolbar>
					{icons && (
						<IconButton color="inherit" sx={{ mr: 2 }}>
							<Menu />
						</IconButton>
					)}
					<LogoTab />
					<Typography
						variant="h6"
						component="div"
						sx={{
							ml: 2,
							flexGrow: 1,
							// color: 'secondary.light',
							display: { xs: 'none', sm: 'block' },
						}}
					>
						BE-PRO SOLUTIONS
					</Typography>

					{/* Icono de analítica */}
					{icons && (
						<IconButton sx={{ ml: 1 }} color="inherit">
							<Analytics />
						</IconButton>
					)}

					<IconButton sx={{ ml: 1 }} color="inherit">
						<Avatar
							sx={{ bgcolor: 'secondary.main' }}
							color="inherit"
						>
							U
						</Avatar>
					</IconButton>
				</Toolbar>
			</Tooltip>
		</Box>
	)
}
