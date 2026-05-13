import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'
import { UserMenu } from './UserMenu'
import { Box } from '@mui/material'
import { LogoOrg } from './LogoOrg'

interface Props {
	handleDrawerToggle: () => void
}

export const Appbar = ({ handleDrawerToggle }: Props) => {
	return (
		<AppBar
			position="fixed"
			sx={{ zIndex: (theme) => ({ sm: theme.zIndex.drawer + 1 }) }}
			color="primary"
		>
			<Toolbar>
				<IconButton
					onClick={handleDrawerToggle}
					color="inherit"
					sx={{ mr: 2 }}
					aria-label="Abrir y cerrar barra de navegación lateral"
					id="toggle-sidebar-button"
				>
					<MenuIcon />
				</IconButton>
				<Link href="/dashboard" passHref>
					<Box component="a">
						<LogoOrg />
					</Box>
				</Link>

				<Box
					sx={{
						flexGrow: 1,
						display: { xs: 'none', sm: 'flex' },
						alignItems: 'baseline',
					}}
				>
					<Typography
						variant="h6"
						component="div"
						mr={1}
						id="app-name"
					>
						Sistema de Gestión de Incapacidades
					</Typography>
				</Box>

				<UserMenu />
			</Toolbar>
		</AppBar>
	)
}