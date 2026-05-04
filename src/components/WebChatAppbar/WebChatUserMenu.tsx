import React, { useState, useEffect } from 'react'
import ListItemIcon from '@mui/material/ListItemIcon'
import IconButton from '@mui/material/IconButton'
import Logout from '@mui/icons-material/Logout'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import MuiMenu from '@mui/material/Menu'
import { Box, ListItem } from '@mui/material'
import { StatusBadge } from '@/components/StatusBadge'

import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'

import { thunkLogout, userSelector } from '@/store/slices/authentication'

import { DisconnectAlertModal } from '../WebChat/Agent/DisconnectAlertModal'
import { HUMAN_AGENT_STATUS_COLOR } from '@/utils/constants/chatStatus'
import { AgentStatus } from '@/types/HumanAgent/WebChat'
import { PauseEventsModal } from '../WebChat/Agent/PauseEventsModal'
import { useChatContext } from '@/hooks/asesor-humano/useChatContext'
import { useChangePasswordState } from '@/hooks/useChangePasswordState'
import { ChangeCircleOutlined } from '@mui/icons-material'
import { AlertDialog } from '../Dialog'
import { ChangePasswordForm } from '../ChangePasswordForm'
import { useCheckActiveConnection } from '@/hooks/asesor-humano/useCheckActiveConnection'

export function WebChatUserMenu({
	connectionIssues,
}: {
	connectionIssues: boolean
}) {
	const dispatch = useAppDispatch()
	const user = useAppSelector(userSelector)
	const { openPassword, handleClosePassword, handleOpenPassword } =
		useChangePasswordState()
	const {
		checkForActiveConversations,
		closeDisconnectionModal,
		handleCloseSessionClick,
		logout,
		openDisconnectionModal,
	} = useCheckActiveConnection()

	// Color del badge del estado del asesor
	const {
		agentSocketStatus,
		agentStatusColor,
		setAgentStatus,
		agentSplits,
		togglePauseAgent,
	} = useChatContext()

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)

	// Modal con eventos de pausa
	const [openPauseModal, setOpenPauseModal] = useState(false)

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}
	const handleClosePauseEvents = () => {
		setOpenPauseModal(false)
	}

	// Cerrar sesión cuando el estado se haya cambiado a DESCONECTADO
	useEffect(() => {
		if (agentSocketStatus === 'DESCONECTADO' && logout) {
			dispatch(thunkLogout())
		}
	}, [agentSocketStatus, logout])

	const renderMenuItem = (
		status: AgentStatus,
		label: string,
		paused = false
	) => {
		return (
			<MenuItem
				onClick={() => {
					updateAgentStatus(status, paused)
					handleClose()
				}}
				sx={{ width: '100%' }}
				key={status}
			>
				<StatusBadge
					color={HUMAN_AGENT_STATUS_COLOR[status]}
					floating={false}
				/>
				{label}
			</MenuItem>
		)
	}

	const renderStatus = () => {
		switch (agentSocketStatus) {
			case 'CONECTADO':
				return [
					renderMenuItem('PAUSA', 'PAUSAR'),
					renderMenuItem('DESCONECTADO', 'DESCONECTAR'),
				]
			case 'DESCONECTADO':
				return renderMenuItem('CONECTADO', 'CONECTAR')
			case 'PAUSA':
				return [
					renderMenuItem('CONECTADO', 'FINALIZAR PAUSA', true),
					renderMenuItem('DESCONECTADO', 'DESCONECTAR'),
				]
		}
	}

	const updateAgentStatus = (status: AgentStatus, paused: boolean) => {
		if (status === 'CONECTADO') {
			setAgentStatus(status)
		} else if (status === 'DESCONECTADO') {
			checkForActiveConversations(() => {
				setAgentStatus('DESCONECTADO')
			})
		} else {
			setOpenPauseModal(true)
		}

		// Despausar
		if (paused) {
			togglePauseAgent()
		}
	}

	const handleCloseSession = () => {
		handleCloseSessionClick(() => {
			setAgentStatus('DESCONECTADO')
		})
	}

	return (
		<Box>
			<strong>{user.email}</strong>
			<IconButton
				onClick={handleClick}
				color="inherit"
				aria-label="Configuración y cuenta"
				aria-controls={open ? 'account-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				disabled={connectionIssues}
			>
				<StatusBadge color={agentStatusColor}>
					<Avatar sx={{ bgcolor: 'secondary.main' }} color="inherit">
						{user.email[0]?.toUpperCase()}
					</Avatar>
				</StatusBadge>
			</IconButton>
			<MuiMenu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				slotProps={{
					paper: {
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
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				{/* <ListItem>
          <strong>Usuario: &nbsp;</strong> {user.email}
        </ListItem> */}
				{/* <ListItem>
					<strong>Versión: &nbsp;</strong>{' '}
					{process.env.NEXT_PUBLIC_API_VERSION}
				</ListItem> */}
				<ListItem>
					<strong>Mis splits: &nbsp;</strong>{' '}
					{agentSplits.length > 0
						? agentSplits.map((split) => split.nombre).join(', ')
						: 'Conéctate para ver tus splits'}
				</ListItem>
				<Divider sx={{ my: 1 }} />
				{renderStatus()}
				<Divider />
				{/*codigo para poppup de cambio de contraseña */}
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
			<PauseEventsModal
				open={openPauseModal}
				handleClose={handleClosePauseEvents}
				confirmAction={(idPauseEvent: number) => {
					togglePauseAgent(idPauseEvent)
					setAgentStatus('PAUSA')
					handleClosePauseEvents()
				}}
			/>
			<DisconnectAlertModal
				open={openDisconnectionModal}
				handleClose={closeDisconnectionModal}
			/>
		</Box>
	)
}
