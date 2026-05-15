import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { UserMenu } from './UserMenu'
import { Box } from '@mui/material'
import { LogoOrg } from './LogoOrg'
import { useEffect, useState } from 'react'
import { getCountNotificacionesNoLeidas } from '@/services/api/notificaciones'

interface Props {
	handleDrawerToggle: () => void
}

export const Appbar = ({ handleDrawerToggle }: Props) => {
	const router = useRouter()
	const [unreadCount, setUnreadCount] = useState(0)

	useEffect(() => {
		const loadCount = async () => {
			try {
				const res = await getCountNotificacionesNoLeidas()
				setUnreadCount(res.data.data?.count || 0)
			} catch {
			}
		}
		loadCount()
		const interval = setInterval(loadCount, 60000)
		return () => clearInterval(interval)
	}, [])

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
				<Link href="/dashboard" passHref legacyBehavior>
					<LogoOrg />
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

				<IconButton
					color="inherit"
					onClick={() => router.push('/alertas')}
					aria-label="Ver alertas"
				>
					<Badge badgeContent={unreadCount} color="error">
						<NotificationsIcon />
					</Badge>
				</IconButton>

				<UserMenu />
			</Toolbar>
		</AppBar>
	)
}