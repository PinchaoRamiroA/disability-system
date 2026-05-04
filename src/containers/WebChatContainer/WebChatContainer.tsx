import React, { useEffect, useState, useMemo } from 'react'

import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import { WebChatAppbar } from '@/components/WebChatAppbar'

import { ConversationsListContainer } from './ConversationsListContainer'
import { ChatBoxContainer } from './ChatBoxContainer'

import useNotifier from '@/hooks/useNotifier'
import { ChatContext, ChatContextType } from '@/contexts/ChatContext'

import { useWebChat } from '@/hooks/asesor-humano/useWebChat'
import { HUMAN_AGENT_STATUS_COLOR } from '@/utils/constants/chatStatus'
import { AlertDialog } from '@/components/Dialog'
import { useDetectDisconnection } from '@/hooks/asesor-humano/useDetectDisconnection'
import { CausalDialog } from '@/components/Causales/HumanAgent'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	getCausalesFinActivas,
	selectCausalesFinAH,
} from '@/store/slices/causales-fin'
import {
	getCausalesNegocioActivas,
	saveCausalesNegocio,
	selectCausalesNegocioAH,
} from '@/store/slices/causales-negocio'
import { Loader } from '@/components/Loader'
import { useLoading } from '@/hooks/useLoading'
import {
	causalesConversacionSelector,
	removeCausalConversacion,
	updateCausalFromTransferError,
} from '@/store/slices/causales-conversacion'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import {
	humanAgentDirectorySelector,
	setBusinessCausals,
	setCheckedCausals,
	setEndingCausals,
} from '@/store/slices/humanAgent'
import {
	removeBeforeUnloadHandler,
	setBeforeUnloadHandler,
} from '@/utils/helpers/beforeUnloadManager'

/**
 * Contenedor principal del chat de asesor humano
 */
export const WebChatContainer = () => {
	useNotifier()
	const dispatch = useAppDispatch()
	const { idOrg } = useCompanyAndIdVa()

	const {
		agentSplits,
		agentSocketStatus,
		conversationId,
		connectionIssues,
		currentChat,
		finishConversation,
		recovering,
		sendMessage,
		setAgentStatus,
		setConversationId,
		setShowEndedChatsPopup,
		setShowServerDisconnectionPopup,
		showEndedChatsPopup,
		showServerDisconnectionPopup,
		startConversation,
		togglePauseAgent,
		transferConversation,
		triggerCausalNegocio,
		setTriggerCausalNegocio,
		setTransferFailedIds,
		transferFailedIds,
		sendDirectoryMessage,
	} = useWebChat()

	const { resource: causalesNegocio } = useAppSelector(
		selectCausalesNegocioAH
	)
	const { resource: causalesFin } = useAppSelector(selectCausalesFinAH)
	const directoryContact = useAppSelector(humanAgentDirectorySelector)

	const { connectionLost, disconnectionType } = useDetectDisconnection()
	const { startLoading, stopLoading } = useLoading()

	const [agentStatusColor, setAgentStatusColor] = useState('')
	const [prevConversationId, setPrevConversationId] = useState(-1)
	const [openCausales, setOpenCausales] = useState(false)
	const [mostrarCausalesFin, setMostrarCausalesFin] = useState(false)
	const [mostrarCausalesNegocio, setMostrarCausalesNegocio] = useState(false)
	const [causalesPorIdConversacion, setCausalesPorIdConversacion] = useState<
		number[]
	>([])
	const [isTransfer, setIsTransfer] = useState(false)
	// Modal de transferencia
	const [openTransferModal, setOpenTransferModal] = useState(false)
	// Input de envío de mensajes
	const [inputValue, setInputValue] = useState('')

	const chatContextValue = useMemo<ChatContextType>(
		() => ({
			drawerWidth: 350,
			chatHeaderHeigth: 64,
			chatListBg: '#FFFFFF',
			chatHeaderFooterBg: '#F7F7F7',
			chatContentBg: '#FAFAFA',
			conversationId,
			setConversationId,
			agentSplits,
			agentSocketStatus,
			setAgentStatus,
			agentStatusColor,
			currentChat,
			sendMessage,
			sendDirectoryMessage,
			startConversation,
			finishConversation,
			transferConversation,
			prevConversationId,
			setPrevConversationId,
			togglePauseAgent,
			inputValue,
			setInputValue,
		}),
		[
			conversationId,
			agentSplits,
			agentSocketStatus,
			agentStatusColor,
			currentChat,
			sendMessage,
			sendDirectoryMessage,
			startConversation,
			finishConversation,
			transferConversation,
			prevConversationId,
			togglePauseAgent,
			setAgentStatus,
			setConversationId,
			inputValue,
			setInputValue,
		]
	)

	const causalesConversacion = useAppSelector(causalesConversacionSelector)

	/**
	 * Verificar estado de funcionalidad de causales para abrir el popup de causales
	 */
	const checkCausales = (loadEndCausals = false) => {
		if (currentChat) {
			const { idVa, conversationId, causalsChecked } = currentChat
			startLoading()
			if (loadEndCausals) {
				dispatch(
					setCheckedCausals({ conversationId, status: 'checking' })
				)
				dispatch(
					getCausalesFinActivas({
						callback: () => {
							dispatch(setEndingCausals({ conversationId }))
						},
						payload: { idVa, idOrg },
					})
				).then(() => {
					checkCausales()
				})
			} else {
				if (causalsChecked === 'idle') {
					dispatch(
						setCheckedCausals({
							conversationId,
							status: 'checking',
						})
					)
				}
				dispatch(
					getCausalesNegocioActivas({
						callback: () => {
							dispatch(setBusinessCausals({ conversationId }))
						},
						payload: { idVa, idOrg },
					})
				).then(() => {
					dispatch(
						setCheckedCausals({ conversationId, status: 'checked' })
					)
					stopLoading()
				})
			}
		}
	}

	// Quitar conversaciones del state de causales por que ya guardaron las causales o falló la transferencia
	const removeConversacionesTipificadas = (conversationId: number) => {
		setTriggerCausalNegocio(
			triggerCausalNegocio.filter((item) => item !== conversationId)
		)
		// Quitar registro de id de conversación
		setCausalesPorIdConversacion(
			causalesPorIdConversacion.filter((item) => item !== conversationId)
		)
		handleCloseCausal()
	}

	// Cerrar modal de causales y reiniciar states
	const handleCloseCausal = () => {
		setOpenCausales(false)
		setMostrarCausalesFin(false)
		setMostrarCausalesNegocio(false)
		setIsTransfer(false)
	}

	// Ocultar overflow del body para evitar efecto causado cuando se agranda el textarea de mensajes al hacer un salto de línea
	useEffect(() => {
		document.body.style.overflow = 'hidden'
	}, [])

	// Detecta cambios en el estado del asesor para actualizar el color del badge
	useEffect(() => {
		setAgentStatusColor(HUMAN_AGENT_STATUS_COLOR[agentSocketStatus])
	}, [agentSocketStatus])

	/**
	 * Validar estado de funcionalidad de causales
	 */
	useEffect(() => {
		if (currentChat) {
			const {
				status,
				causalsChecked,
				businessCausals,
				endCausals,
				causalsSetted,
				transfer,
				transfering,
			} = currentChat

			if (status === 'FINALIZADO') {
				// Se presenta un caso en el que está abierto el popup de transferencia o causales y la conversación finaliza por inactividad, aquí se asegura que se cierren si hay cambios en el estado de la conversación
				setOpenCausales(false)
				setOpenTransferModal(false)

				// Cerrar popup de causales si está abierto y se guardaron las causales
				if (causalsSetted) {
					setOpenCausales(false)
				} else {
					// Validar si la conversación debe mostrar causales después de finalizar
					if (causalsChecked === 'idle') {
						checkCausales(true)
					}
					// Verificar si se deben mostrar o no causales
					else if (
						causalsChecked === 'checked' &&
						(businessCausals || endCausals) &&
						(causalesFin.length > 0 || causalesNegocio.length > 0)
					) {
						// Abrir popup de causales
						setIsTransfer(false)
						setOpenCausales(true)
						setMostrarCausalesNegocio(businessCausals)
						setMostrarCausalesFin(endCausals)
						return
					}
				}
			}
			// Status no es finalizado, pero puede ser una transferencia
			else if (transfer) {
				// Se presenta un caso en el que está abierto el popup de transferencia o causales y la conversación finaliza por inactividad, aquí se asegura que se cierren si hay cambios en el estado de la conversación
				setOpenCausales(false)
				setOpenTransferModal(false)

				// Cerrar popup de causales si está abierto y ya se guardaron las causales
				if (causalsSetted) {
					setOpenCausales(false)
				} else {
					// Validar si es una transferencia e iniciar chequeo de funcionalidad
					if (causalsChecked === 'idle') {
						const conversacion = causalesConversacion.find(
							(item) => item.conversationId === conversationId
						)
						// Iniciar chequeo estado de causales
						if (conversacion) {
							checkCausales()
							return
						}
					}
					// Chequeo finalizado
					else if (causalsChecked === 'checked') {
						// Abrir popup de causales en modo transferencia
						if (businessCausals) {
							if (
								!currentChat.transfering &&
								causalesNegocio.length > 0
							) {
								setOpenCausales(true)
								setIsTransfer(true)
								setMostrarCausalesNegocio(true)
								setMostrarCausalesFin(false)
							}
							return
						}
						// Funcionalidad deshabilitada, realizar transferencia sin selección de causales
						else if (!transfering) {
							const conversacion = causalesConversacion.find(
								(item) => item.conversationId === conversationId
							)
							if (conversacion?.splitId) {
								transferConversation(
									conversacion.splitId,
									conversacion.conversationId
								)
							}
							setIsTransfer(false)
							setMostrarCausalesNegocio(false)
							setMostrarCausalesFin(false)
							return
						}
					}
				}
			}
			// Asegurar cierre de popup de causales
			setOpenCausales(false)
		}
	}, [currentChat, causalesConversacion])

	/**
	 * Guardar causales de negocio (luego de una transferencia exitosa TCOSOK)
	 * Las causales de negocio se seleccionan antes de enviar el comando de transferencia TCOS
	 */
	useEffect(() => {
		// Guardar causales
		if (triggerCausalNegocio.length > 0) {
			const transferedConvId = triggerCausalNegocio[0]
			// Buscar conversación en el reducer de causales
			const conversacionReducer = causalesConversacion.find(
				(item) => item.conversationId === transferedConvId
			)

			if (conversacionReducer) {
				// No hay causales para guardar, saltar proceso
				if (conversacionReducer.business.length === 0) {
					dispatch(
						removeCausalConversacion({
							conversationId: transferedConvId,
						})
					)
					removeConversacionesTipificadas(transferedConvId)
					return
				}
				startLoading()
				dispatch(
					saveCausalesNegocio({
						body: {
							idConversacion: transferedConvId,
							listIdCausales: conversacionReducer.business.map(
								(e) => ({
									idCausal: e.idCausal,
								})
							),
						},
						callback: () => {
							dispatch(
								removeCausalConversacion({
									conversationId: transferedConvId,
								})
							)
							removeConversacionesTipificadas(transferedConvId)
						},
						logErrorPayload: {
							idOrg,
							idadviser:
								currentChat?.conversacionAgenteHumano
									.idAsesor ?? 0,
						},
					})
				).then(stopLoading)
			}
		}
	}, [triggerCausalNegocio])

	/**
	 * Consultar transferencias fallidas
	 */
	useEffect(() => {
		// La conversación actual es una transferencia fallida
		if (transferFailedIds.find((id) => id === conversationId)) {
			// Resetear estado de la conversación para un nuevo intento
			dispatch(updateCausalFromTransferError({ conversationId }))
			removeConversacionesTipificadas(conversationId)
			dispatch(removeCausalConversacion({ conversationId }))
			// Eliminar de array de intentos fallidos
			setTransferFailedIds(
				transferFailedIds.filter((id) => id !== conversationId)
			)
		}
	}, [transferFailedIds])

	// Definir el manejador de beforeunload de forma estable
	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault()
		}

		// Filtrar los chats que no están finalizados
		// const filtrados = allChats.filter((ch) => ch.status !== 'FINALIZADO')

		if (agentSocketStatus !== 'DESCONECTADO') {
			setBeforeUnloadHandler(handleBeforeUnload)
		} else {
			removeBeforeUnloadHandler()
		}

		return () => {
			removeBeforeUnloadHandler()
		}
	}, [agentSocketStatus])

	return (
		<ChatContext.Provider value={chatContextValue}>
			<Loader drawerWidth={chatContextValue.drawerWidth} />

			<Box sx={{ display: 'flex' }}>
				<CssBaseline />

				{/* Appbar */}
				<WebChatAppbar connectionIssues={connectionIssues} />

				{/* Listado de chats del asesor */}
				<ConversationsListContainer />

				{/* Contenedor de la sección del chat  */}
				<ChatBoxContainer
					openTransfer={openTransferModal}
					setOpenTransfer={setOpenTransferModal}
					showComponent={
						(currentChat && !currentChat.transfering) ||
						directoryContact.active
					}
				/>

				{/* Popup de desconexión por internet */}
				<AlertDialog
					open={connectionLost && disconnectionType === 'INTERNET'}
					title="Fallo en la conexión. Intentando reconectar..."
					description="Verifica tu conexión a internet o comúnicate con un administrador."
					actions={false}
					backdropProps={{
						left: chatContextValue.drawerWidth,
						top: 64,
					}}
				/>

				{/* Popup informativo sobre chats finalizados por desconexión */}
				<AlertDialog
					open={showEndedChatsPopup}
					title="Conversaciones finalizadas"
					description="Se han finalizado las conversaciones debido a una falla de conexión."
					onClose={() => setShowEndedChatsPopup(false)}
					backdropProps={{
						left: chatContextValue.drawerWidth,
						top: 64,
					}}
				/>

				{/* Popup de desconexión por fallas en socket */}
				<AlertDialog
					open={showServerDisconnectionPopup}
					title="Falla en la conexión."
					description="Se ha detectado una falla en la conexión. Comunícate con un administrador."
					onClose={() => setShowServerDisconnectionPopup(false)}
					backdropProps={{
						left: chatContextValue.drawerWidth,
						top: 64,
					}}
				/>

				{/* Popup  */}
				<AlertDialog
					open={recovering}
					title="Reconectando..."
					description="Recuperando información de las conversaciones."
					actions={false}
					backdropProps={{
						left: chatContextValue.drawerWidth,
						top: 64,
					}}
				/>

				{/* Popup para seleccionar causal */}
				{conversationId > 0 && (
					<CausalDialog
						causalesFin={causalesFin}
						causalesNegocio={causalesNegocio}
						handleClose={handleCloseCausal}
						idConversacion={conversationId}
						mostrarCausalesFin={mostrarCausalesFin}
						mostrarCausalesNegocio={mostrarCausalesNegocio}
						open={openCausales}
						isTransfer={isTransfer}
					/>
				)}
			</Box>
		</ChatContext.Provider>
	)
}
