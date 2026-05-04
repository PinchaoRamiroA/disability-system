import React, { useEffect, useState } from 'react'
import {
	Box,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Typography,
	useTheme,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { TransferModal } from './TransferModal'
import { FinishModal } from './FinishModal'
import { DiscardModal } from './DiscardModal'
import { useChatContext } from '@/hooks/asesor-humano/useChatContext'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { humanAgentDirectorySelector } from '@/store/slices/humanAgent'

interface Props {
	height: number
	openTransferModal: boolean
	setOpenTransferModal: (value: boolean) => void
}

interface HeaderData {
	nombre?: string
	ciudad?: string
	departamento?: string
	email?: string
	identificacion?: string
	split?: string
	telefono?: string
	tipoIdentificacion?: string
}

const Text = ({ label, value }: { label: string; value: string }) => {
	return (
		<Typography fontSize={12}>
			<strong>{label}:</strong> {value}
		</Typography>
	)
}

export const WebChatHeader = ({
	height,
	openTransferModal,
	setOpenTransferModal,
}: Props) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const { asesorHumano } = useTheme()

	const [openFinishModal, setOpenFinishModal] = useState(false)
	const [openDiscardModal, setOpenDiscardModal] = useState(false)

	const { currentChat } = useChatContext()
	const directoryContact = useAppSelector(humanAgentDirectorySelector)
	const [userData, setUserData] = useState<HeaderData>()

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	// Abrir modales
	const handleTransfer = () => {
		handleClose()
		setOpenTransferModal(true)
	}
	const handleFinish = () => {
		handleClose()
		setOpenFinishModal(true)
	}
	const handleDiscard = () => {
		handleClose()
		setOpenDiscardModal(true)
	}

	// Cerrar modales
	const handleCloseTransferModal = () => setOpenTransferModal(false)
	const handleCloseFinishModal = () => setOpenFinishModal(false)
	const handleCloseDiscardModal = () => setOpenDiscardModal(false)

	useEffect(() => {
		if (directoryContact.active) {
			setUserData({
				ciudad: directoryContact.ciudad,
				departamento: directoryContact.departamento,
				email: directoryContact.email,
				identificacion: directoryContact.identificacion,
				nombre: directoryContact.nombre,
				telefono: directoryContact.telefono,
				tipoIdentificacion: directoryContact.tipoIdentificacion,
			})
		} else {
			setUserData({
				ciudad: currentChat?.ciudad,
				departamento: currentChat?.departamento,
				email: currentChat?.email,
				identificacion: currentChat?.identificacion,
				split: currentChat?.split.nombre,
				telefono: currentChat?.telefono,
				tipoIdentificacion: currentChat?.tipoIdentificacion,
			})
		}
	}, [currentChat, directoryContact])

	return (
		<Box borderBottom={1} borderColor="#EEE">
			<Grid
				container
				bgcolor={asesorHumano.header.background}
				color={asesorHumano.header.color}
				height={height}
				alignItems="center"
				overflow="auto"
			>
				<Grid item xs={6} padding={1} display="flex">
					<Box display="flex" flexDirection="column" ml={1}>
						<Text
							label={userData?.nombre ? 'Nombre' : 'Split'}
							value={
								userData?.nombre
									? userData.nombre
									: userData?.split ?? ''
							}
						/>
						<Text label="Email" value={userData?.email ?? ''} />
						<Text
							label="Teléfono"
							value={userData?.telefono ?? ''}
						/>
					</Box>
				</Grid>
				<Grid item xs={6}>
					<Grid
						container
						padding={1}
						paddingLeft={0}
						alignItems="center"
					>
						<Grid item xs display="flex" flexDirection="column">
							<Text
								label="Tipo identificación"
								value={userData?.tipoIdentificacion ?? ''}
							/>
							<Text
								label="Nº Identificación"
								value={userData?.identificacion ?? ''}
							/>
							<Text
								label="Ubicación"
								value={
									userData?.ciudad
										? `${userData.ciudad}, ${userData.departamento}`
										: ''
								}
							/>
						</Grid>
						{!directoryContact.active && (
							<Grid item xs="auto" ml={1}>
								<IconButton
									aria-controls={
										open ? 'basic-menu' : undefined
									}
									aria-haspopup="true"
									aria-expanded={open ? 'true' : undefined}
									onClick={handleClick}
									color="inherit"
								>
									<MoreVertIcon />
								</IconButton>
							</Grid>
						)}
					</Grid>
				</Grid>
			</Grid>

			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				{currentChat?.status === 'FINALIZADO' ? (
					<MenuItem onClick={handleDiscard}>
						Descartar conversación
					</MenuItem>
				) : (
					<div>
						<MenuItem onClick={handleTransfer}>
							Transferir cliente
						</MenuItem>
						<MenuItem onClick={handleFinish}>
							Finalizar conversación
						</MenuItem>
					</div>
				)}
			</Menu>

			<TransferModal
				open={openTransferModal}
				handleClose={handleCloseTransferModal}
			/>
			<FinishModal
				open={openFinishModal}
				handleClose={handleCloseFinishModal}
			/>
			<DiscardModal
				open={openDiscardModal}
				handleClose={handleCloseDiscardModal}
			/>
		</Box>
	)
}
