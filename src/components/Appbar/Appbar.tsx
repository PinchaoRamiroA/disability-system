import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'
import Link from 'next/link'
import { UserMenu } from './UserMenu'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { routeTreeSelector } from '@/store/slices/routeTree'
import { useRouter } from 'next/router'
import { Analytics } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material'
import { LogoOrg } from './LogoOrg'

interface Props {
	handleDrawerToggle: () => void
}

export const Appbar = ({ handleDrawerToggle }: Props) => {
	const routeTree = useAppSelector(routeTreeSelector)
	const router = useRouter()

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
				<Link href="/" passHref>
					<Box component="a">
						<LogoOrg />
					</Box>
				</Link>

				<Box
					sx={{
						flexGrow: 1,
						// color: 'secondary.light',
						display: { xs: 'none', sm: 'flex' },
						alignItems: 'baseline',
					}}
				>
					<Typography
						variant="h6"
						component="div"
						mr={1}
						id="bepro-name"
					>
						Be-Pro Solutions
					</Typography>
					<Typography fontStyle="italic" mr={1}>
						-
						{router.asPath.includes('analitica')
							? 'Dashboard'
							: 'Configuración'}
						-
					</Typography>
				</Box>

				{/* Mostrar icono de configuración estando en analítica */}
				{router.asPath.includes('analitica') && routeTree.settings && (
					<Link href={`/${routeTree.settings.path}`}>
						<Tooltip title="Configuración">
							<IconButton
								sx={{ ml: 1 }}
								color="inherit"
								aria-label="Configuración"
							>
								<SettingsIcon />
							</IconButton>
						</Tooltip>
					</Link>
				)}

				{/* Mostrar icono de analítica estando en configuración */}
				{router.asPath.includes('configuracion') && (
					<Link href={'/'}>
						<Tooltip title="Analítica">
							<IconButton
								sx={{ ml: 1 }}
								color="inherit"
								aria-label="Analítica"
							>
								<Analytics />
							</IconButton>
						</Tooltip>
					</Link>
				)}
				<UserMenu />
			</Toolbar>
		</AppBar>
	)
}
