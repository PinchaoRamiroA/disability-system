import * as React from 'react'

import ListItemIcon from '@mui/material/ListItemIcon'
import IconButton from '@mui/material/IconButton'
import Logout from '@mui/icons-material/Logout'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import MuiMenu from '@mui/material/Menu'

import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { userSelector, thunkLogout } from '@/store/slices/authentication'
import { ListItem } from '@mui/material'
import { useRouter } from 'next/router'

export const UserMenu = () => {
	const router = useRouter()
	const dispatch = useAppDispatch()
	const user = useAppSelector(userSelector)
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleCloseSession = async () => {
		await dispatch(thunkLogout())
		router.push('/login')
	}

	return (
		<>
			<IconButton
				sx={{ ml: 1 }}
				onClick={handleClick}
				color="inherit"
				aria-label="Cuenta de usuario"
				aria-controls={open ? 'account-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
			>
				<Avatar sx={{ bgcolor: 'secondary.main' }} color="inherit">
					{user?.email?.[0]?.toUpperCase() || 'U'}
				</Avatar>
			</IconButton>

			<MuiMenu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<ListItem>Usuario: {user?.email || 'Usuario'}</ListItem>
				<Divider />
				<MenuItem onClick={handleCloseSession}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Cerrar sesión
				</MenuItem>
			</MuiMenu>
		</>
	)
}