import * as React from 'react'

import ListItemIcon from '@mui/material/ListItemIcon'
import IconButton from '@mui/material/IconButton'
import Logout from '@mui/icons-material/Logout'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import MuiMenu from '@mui/material/Menu'

import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import Settings from '@mui/icons-material/Settings'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { routeTreeSelector } from '@/store/slices/routeTree'

import Link from 'next/link'

import { RouteTree } from '@/types/GrantAccess'
import { thunkLogout, userSelector } from '@/store/slices/authentication'
import { ListItem } from '@mui/material'
import { ChangeCircleOutlined } from '@mui/icons-material'
import { useChangePasswordState } from '@/hooks/useChangePasswordState'
import { AlertDialog } from '@/components/Dialog'
import { ChangePasswordForm } from '@/components/ChangePasswordForm'

export const UserMenu = () => {
	const dispatch = useAppDispatch()
	const routeTree = useAppSelector(routeTreeSelector)
	const user = useAppSelector(userSelector)
	const { openPassword, handleClosePassword, handleOpenPassword } =
		useChangePasswordState()
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleCloseSession = () => {
		dispatch(thunkLogout())
	}

	return (
		<>
			<IconButton
				sx={{ ml: 1 }}
				onClick={handleClick}
				color="inherit"
				aria-label="Configuración y cuenta"
				aria-controls={open ? 'account-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
			>
				<Avatar sx={{ bgcolor: 'secondary.main' }} color="inherit">
					{user.email[0]?.toUpperCase()}
				</Avatar>
			</IconButton>

			<MuiMenu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				//onClick={handleClose}
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
				<ListItem>Usuario: {user.email}</ListItem>
				<ListItem>
					Versión {process.env.NEXT_PUBLIC_API_VERSION}
				</ListItem>

				<Divider />

				{Object.keys(routeTree).map((mainRouteName: string) => {
					const label =
						routeTree[mainRouteName as keyof RouteTree]?.label
					const route = routeTree[mainRouteName as keyof RouteTree]
					const path = route?.path ?? ''

					return (
						<Link key={label} href={`/${path}`} passHref>
							<MenuItem component="a" onClick={handleClose}>
								<>
									{findIcon(path)}
									{label}
								</>
							</MenuItem>
						</Link>
					)
				})}
				<MenuItem onClick={handleOpenPassword}>
					<ListItemIcon>
						<ChangeCircleOutlined fontSize="small" />
					</ListItemIcon>
					Cambiar contraseña
				</MenuItem>

				<MenuItem onClick={handleCloseSession}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Cerrar sesión
				</MenuItem>
			</MuiMenu>
			{/*codigo para poppup de cambio de contraseña*/}

			<AlertDialog
				open={openPassword}
				onClose={handleClosePassword}
				title="Actualizar contraseña"
				formikFormId="change-password-form"
			>
				<ChangePasswordForm
					successCallback={() => handleClosePassword()}
				/>
			</AlertDialog>
		</>
	)
}

const findIcon = (iconName: string | undefined) => {
	switch (iconName) {
		case 'configuracion':
			return (
				<ListItemIcon>
					<Settings fontSize="small" />
				</ListItemIcon>
			)
		case 'analitica':
			return (
				<ListItemIcon>
					<AnalyticsIcon fontSize="small" />
				</ListItemIcon>
			)
		case 'chat':
			return (
				<ListItemIcon>
					<QuestionAnswerIcon fontSize="small" />
				</ListItemIcon>
			)
		default:
			return null
	}
}
