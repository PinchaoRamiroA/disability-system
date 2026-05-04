import { useState, useEffect } from 'react'

import { socket } from '@/containers/WebChatContainer/Socket'
import { IFrame, StompSubscription } from '@stomp/stompjs'

import {
	AgentData,
	AgentStatus,
	Client,
	PlainMessageReceived,
	PlainMessageSend,
	Adjunto,
	EndConversationCommand,
	Command,
	StartConversationCommand,
	TipoMensaje,
	LogEventoPausa,
	RespuestaEventoPausa,
	HistorialMensajes,
	RecuperarHistorialPublish,
	PublishMessage,
	AgentDisconnectionCommand,
	AgentManualDisconnectionCommand,
} from '@/types/HumanAgent/WebChat'
import { Splits } from '@/types/Splits'

import {
	ACCESS_TOKEN_NAME,
	AGENT_STATUS,
	PAUSE_EVENT_ID,
} from '@/utils/constants/userSession'

import { chatsSelector } from '@/store/slices/humanAgent'
import { filterIdOrgSelector } from '@/store/slices/Filter'

import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import { useWebChatState } from './useWebChatState'
import {
	agentDisconnectionWithChatsCommand,
	agentDisconnectionCommand,
	ASESOR_INACTIVO,
	endConversationCommands,
	generalCommands,
	INVALID_TOKEN_MESSAGE,
	startConversationCommand,
	transferSplitCommand,
	transferSplitError,
	transferSplitSuccess,
	agentManualDisconnectionCommand,
} from '@/utils/constants/webchatCommands'
import { useSnackbar } from 'notistack'
import { useDetectDisconnection } from './useDetectDisconnection'
import { useLoading } from '../useLoading'
import { refreshTokenAction, thunkLogout } from '@/store/slices/authentication'
import { autoLogOut, cleanAndReload } from '@/utils/helpers/autoLogOut'
import { ContactBAHPayload } from '@/types/Settings/asesor-humano/directorio'
import moment from 'moment'
import { useCustomMessages } from './useCustomMessages'
import { getCommandMessage } from '@/utils/helpers/formatConversation'

const stompSubscribe: StompSubscription[] = []
let agentIdDB = 0

export const useWebChat = () => {
	const dispatch = useAppDispatch()
	const { startLoading, stopLoading } = useLoading()
	// Información del asesor
	const [accessToken, setAccessToken] = useState<string | null>(null)
	const [agentStatus, setAgentStatus] = useState<AgentStatus | undefined>()
	const [refreshStomp, setRefreshStomp] = useState(false)
	const [agentSocketStatus, setAgentSocketStatus] =
		useState<AgentStatus>('DESCONECTADO')
	const [agentId, setAgentId] = useState<string | null>('')
	const [agentSplits, setAgentSplits] = useState<Splits[]>([])
	const [connectionIssues, setConnectionIssues] = useState(false)

	// Almacena id de conversaciones que deben mostrar modal de causal de negocios
	const [triggerCausalNegocio, setTriggerCausalNegocio] = useState<number[]>(
		[]
	)
	// Almacena id de conversaciones que no se pudieron transferir correctamente
	const [transferFailedIds, setTransferFailedIds] = useState<number[]>([])
	// Almacena ids de conversaciones que se mandaron a transferir
	const [sentTransferIds, setSentTransferIds] = useState<
		{ conversationId: number; split: number }[]
	>([])

	// Popup de desconexión
	const [showEndedChatsPopup, setShowEndedChatsPopup] = useState(false)
	const [showServerDisconnectionPopup, setShowServerDisconnectionPopup] =
		useState(false)

	const [sendEndConversationCommand, setSendEndConversationCommand] =
		useState(true)

	const [recoverHistory, setRecoverHistory] = useState(false)

	// Información de la conversación
	const [currentConversationId, setConversationId] = useState<number>(-1)
	const idOrg = useAppSelector(filterIdOrgSelector)
	const allChats = useAppSelector(chatsSelector)
	const currentChat = allChats.find(
		(e) => e.conversationId === currentConversationId
	)
	const { enqueueSnackbar } = useSnackbar()

	// Mensajes no enviados por falla en el token
	const [sendPendingMessages, setSendPendingMessages] = useState(false)
	const [pendingMessages, setPendingMessages] = useState<PublishMessage[]>([])

	// Acción de evento de pausa fallida por refresco de token
	const [sendPendingPauseEvent, setSendPendingPauseEvent] = useState(false)
	const [pendingPauseEvent, setPendingPauseEvent] = useState<
		{ id: number | undefined }[]
	>([])

	// Mensaje pendiente de enviar por refresco de token
	const [pendingDirectoryMessage, setPendingDirectoryMessage] =
		useState(false)
	const [lastDirectoryMessage, setLastDirectoryMessage] = useState<
		Partial<ContactBAHPayload> | undefined
	>()
	// Nueva conversación proveniente de directorio
	const [chatFromDirectory, setChatFromDirectory] = useState<
		{ phone: string; convId: number } | undefined
	>()

	// Valida si después de un cierre de sesión automático
	const [closeWindow, setCloseWindow] = useState(false)
	const [checkCloseWindow, setCheckCloseWindow] = useState(false)

	// State del webchat
	const {
		addConversationToState,
		finishConversationState,
		recoverConversations,
		removeConversationFromState,
		startConversationState,
		updateConversationState,
		updateConversationHistory,
		updateTransferConversation,
		toggleTransferingConversation,
		updateSendingMessage,
		updateSendingMessageTimeout,
		updateConversationFields,
		setDirectoryMessage,
		saveLog,
	} = useWebChatState()

	// State de mensajes configurados
	const { getCustomMessages } = useCustomMessages()

	const {
		connectionLost,
		disconnectionType,
		onServerDisconnection,
		recovering,
		setRecovering,
		resetDisconnectionState,
	} = useDetectDisconnection()

	/**
	 * Obtener token del asesor de localStorage
	 */
	const getLSToken = () => {
		return localStorage.getItem(ACCESS_TOKEN_NAME)
	}

	/**
	 * Validar estado de la conexión
	 */
	useEffect(() => {
		setConnectionIssues(
			(connectionLost && disconnectionType === 'INTERNET') ||
				showServerDisconnectionPopup ||
				recovering
		)
	}, [
		connectionLost,
		disconnectionType,
		recovering,
		showServerDisconnectionPopup,
	])

	/**
	 * Revisa si una conversación entrante es la última iniciada desde el directorio
	 */
	useEffect(() => {
		// 0 significa que es un chat seleccionado del directorio
		if (
			currentConversationId === 0 &&
			lastDirectoryMessage &&
			chatFromDirectory
		) {
			// La conversación entrante coincide con la última enviada desde el directorio, marcarla como activa
			if (
				lastDirectoryMessage.telefono &&
				chatFromDirectory.phone.endsWith(lastDirectoryMessage.telefono)
			) {
				setConversationId(chatFromDirectory.convId)
				setLastDirectoryMessage(undefined)
				setChatFromDirectory(undefined)
			}
		}
	}, [currentConversationId, lastDirectoryMessage, chatFromDirectory])

	/**
	 * Validar si el asesor tiene conversaciones activas y pasar callback al autologout
	 */
	useEffect(() => {
		if (agentId && idOrg) {
			console.log('autologout disconnect')
			autoLogOut(() => {
				setCloseWindow(true)
				publishDisconnectAgent(agentId, idOrg, 'CCCNE', false)
			})
		}
	}, [agentId, idOrg])

	useEffect(() => {
		const status: AgentStatus[] = ['CONECTADO', 'DESCONECTADO', 'PAUSA']
		const lsAgentStatus = localStorage.getItem(AGENT_STATUS) as AgentStatus

		setAccessToken(localStorage.getItem(ACCESS_TOKEN_NAME))

		if (status.includes(lsAgentStatus)) {
			setAgentSocketStatus(lsAgentStatus)
			setAgentStatus(lsAgentStatus)
		} else {
			setAgentStatus('DESCONECTADO')
		}

		aceptarNotificaciones()
	}, [])

	/**
	 * Detecta cambios en el estado del asesor (CONECTADO, DESCONECTADO, PAUSA)
	 */
	useEffect(() => {
		// Conectar socket
		if (
			agentStatus &&
			(agentStatus === 'CONECTADO' ||
				agentStatus === 'PAUSA' ||
				refreshStomp)
		) {
			const connect = () => {
				startLoading()
				connectSocket(() => {
					setAgentSocketStatus(agentStatus)
					agentListener()
					socketErrorListener()
					publishAgent()
					setRefreshStomp(false)
					stopLoading()
				})
			}
			if (refreshStomp) {
				console.log('refreshing')
				connect()
				return
			}
			if (!socket.active) {
				connect()
			}
		}
		// Desconectar socket
		else if (agentStatus === 'DESCONECTADO') {
			sendDisconnectionCommand()
			// Resetear state agentStatus para un posible reintento de conexión
			setAgentStatus(undefined)
		}
	}, [agentStatus, refreshStomp])

	useEffect(() => {
		// Actualizar localstorage
		if (agentSocketStatus) {
			localStorage.setItem(AGENT_STATUS, agentSocketStatus)
		}
	}, [agentSocketStatus])

	useEffect(() => {
		// console.log('CHAT STATE', allChats, recoverHistory)
		if (recoverHistory) {
			if (allChats.some((chat) => chat.recover)) {
				sessionRecovery()
			}
		}
	}, [allChats])

	useEffect(() => {
		if (connectionLost && disconnectionType === null) {
			// console.log('SERVER DISCONNECTION')
			serverDisconnectionActions()
		}

		if (recoverHistory && recovering) {
			setRecovering(false)
		}
	}, [connectionLost])

	// Validar unsubscribe después de transferencia
	useEffect(() => {
		if (sentTransferIds.length) {
			// Extraer idSplit de splits del asesor
			const splits = agentSplits.map((split) => split.idSplit)

			// Recorrer splits del asesor y validar si coinciden con los splits de transferencia
			sentTransferIds.forEach(({ conversationId, split }) => {
				// Indica que el split de la transferencia no es del asesor actual y por ende se debe hacer unsubscribe
				if (!splits.includes(split)) {
					triggerCausal(conversationId)
					unsubscribeClient(conversationId)
					removeConversationFromState(conversationId)

					// Mostrar mensaje de transferencia exitosa
					enqueueSnackbar('Transferencia exitosa', {
						variant: 'success',
						autoHideDuration: 5000,
					})
					return
				}
				// El TCOSOK llegó porque se recibe una transferencia
				else {
					updateConversationFields(conversationId, {
						transferCompleted: 'true',
					})
				}
			})

			// Vaciar array de splits transferidos
			setSentTransferIds([])
		}
	}, [sentTransferIds])

	useEffect(() => {
		if (sendPendingMessages) {
			pendingMessages.forEach((pendingMessage) => {
				publishMessage(pendingMessage)
			})
			setSendPendingMessages(false)
			setPendingMessages([])
		}
	}, [pendingMessages, sendPendingMessages])

	/**
	 * Reenviar mensaje de directorio después de refrescar token
	 */
	useEffect(() => {
		if (pendingDirectoryMessage && lastDirectoryMessage) {
			sendDirectoryMessage(lastDirectoryMessage, '', null, true)
			setPendingDirectoryMessage(false)
		}
	}, [pendingDirectoryMessage, lastDirectoryMessage])

	useEffect(() => {
		if (sendPendingPauseEvent) {
			pendingPauseEvent.forEach((pauseEvent) => {
				publishTogglePauseAgent(pauseEvent.id)
			})
			setSendPendingMessages(false)
			setPendingPauseEvent([])
		}
	}, [pendingPauseEvent, sendPendingPauseEvent])

	useEffect(() => {
		console.log('closeWindow', closeWindow)
		console.log('checkCloseWindow', checkCloseWindow)

		if (checkCloseWindow && closeWindow) {
			// console.log('CERRAAAAAAAAAAAAAAAAR 2')
			cleanAndReload()
		}
	}, [closeWindow, checkCloseWindow])

	const sessionRecovery = () => {
		// console.log('BUSCAR CHATS FINALIZADOS Y RECUPERAR SU HISTORIAL')
		let allFinished = true

		allChats.forEach((chat) => {
			if (chat.recover && chat.status === 'FINALIZADO') {
				finishConversationAfterReconnect(chat.conversationId)
			}
			// Verificar si hay por lo menos un chat sin finalizar
			else if (allFinished && chat.status !== 'FINALIZADO') {
				allFinished = false
			}
		})

		// Todos los chats se han finalizado tras la reconexión
		if (allFinished) {
			setShowEndedChatsPopup(true)
		}

		setRecoverHistory(false)
		stopLoading()
	}

	const aceptarNotificaciones = () => {
		if (!('Notification' in window)) {
			alert('Este navegador no soporta las notificaciones del sistema')
		} else if (
			Notification.permission !== 'denied' &&
			Notification.permission !== 'granted'
		) {
			Notification.requestPermission((permission) => {
				if (permission === 'granted') {
					const notification = new Notification(
						'Notificaciones aceptadas'
					)
					notification.onclick = () => {
						window.focus()
						notification.close()
					}
				}
			})
		}
	}

	const showNotification = (title: string, body?: string) => {
		if (document.hidden) {
			if (Notification.permission === 'granted') {
				const notif = new Notification(title, {
					body,
				})
				notif.onclick = () => {
					window.focus()
					notif.close()
				}
			}
		}
	}

	const serverDisconnectionActions = () => {
		let chatsFinished = false

		setSendEndConversationCommand(false)
		setAgentStatus('DESCONECTADO')
		setAgentSocketStatus('DESCONECTADO')

		// Finalizar chats visualmente
		allChats.forEach((chat) => {
			if (chat.status !== 'FINALIZADO') {
				finishConversationState(Number(chat.conversationId))
				// console.log('## serverDisconnectionActions')
				chatsFinished = true
			}
		})

		// Habían chats en el state, se muestra mensaje que indica que se finalizaron los chats
		if (chatsFinished) {
			setShowEndedChatsPopup(true)
		} else {
			setShowServerDisconnectionPopup(true)
		}

		resetDisconnectionState()
		stopLoading()
	}

	/**
	 * Socket method:
	 * Conectar socket
	 */
	const connectSocket = (callback: () => void) => {
		// Socket activo - El callback pueden ser nuevos subscribes (como el de recuperar historial)
		if (socket.active) {
			callback()
		}
		// Conectar socket
		else {
			socket.onConnect = () => {
				setSendEndConversationCommand(true)
				resetDisconnectionState()
				callback()
			}
			socket.onWebSocketError = (event: Event) => {
				// Mostrar mensaje de error
				enqueueSnackbar('Falla en la conexión (onWebSocketError)', {
					variant: 'error',
					autoHideDuration: null,
				})

				saveLog({
					idOrg,
					payload: {
						callback: 'onWebSocketError',
						detail: `{currentTarget: ${JSON.stringify(
							event.currentTarget
						)}, type: ${event.type}}`,
						idadviser: agentIdDB,
					},
				})
				onServerDisconnection()

				// Resetear state agentStatus para un posible reintento de conexión
				setAgentStatus(undefined)
				stopLoading()
			}

			socket.onStompError = (frame: IFrame) => {
				// Resetear state agentStatus para un posible reintento de conexión
				setAgentStatus(undefined)
				// Mostrar mensaje de error
				enqueueSnackbar('Falla en la conexión (onStompError)', {
					variant: 'error',
					autoHideDuration: null,
				})

				saveLog({
					idOrg,
					payload: {
						callback: 'onStompError',
						detail: frame.headers['message'],
						idadviser: agentIdDB,
					},
				})
			}

			socket.onWebSocketClose = (closeEvent: CloseEvent) => {
				// Resetear state agentStatus para un posible reintento de conexión
				setAgentStatus(undefined)

				// 1000 es código exitoso
				if (closeEvent.code !== 1000) {
					// Mostrar mensaje de error
					// enqueueSnackbar('Falla en la conexión (onWebSocketClose)', {
					// 	variant: 'error',
					// 	autoHideDuration: null,
					// })

					saveLog({
						idOrg,
						payload: {
							callback: 'onWebSocketClose',
							detail: `{code: ${closeEvent.code}, reason: ${closeEvent.reason}, wasClean: ${closeEvent.wasClean}}`,
							idadviser: agentIdDB,
						},
					})
				}
			}

			socket.activate()
		}
	}

	/**
	 * Socket method:
	 * Desconectar socket.
	 * Cuando el parámetro deactivate es false, se envía el comando de desconexión y al recibirlo nuevamente
	 * se desconecta el cliente del socket y se limpia el localStorage (se vuelve a llamar la función pero con el
	 * parámetro deactivate true)
	 */
	const disconnectSocket = () => {
		localStorage.removeItem(AGENT_STATUS)
		setAgentSplits([])
		socket.deactivate()
		setAgentStatus(undefined)
		setAgentSocketStatus('DESCONECTADO')
		stopLoading()
		setCheckCloseWindow(true)
		console.log('close', closeWindow)
	}
	const sendDisconnectionCommand = () => {
		if (sendEndConversationCommand) {
			sendDisconnectAgent()
		} else {
			disconnectSocket()
		}
	}

	/**
	 * Socket subscribe:
	 * Listener para la activación del asesor (solo si el socket está conectado)
	 */
	const agentListener = (overwriteAccessToken?: string | null) => {
		const token = overwriteAccessToken ? overwriteAccessToken : accessToken
		if (token) {
			// El asesor ya está activo (esta condición es accesible cuando se cierra la pestaña o cuando se recarga la página)
			socket.subscribe(
				`/topic/mensajes/asesor/datos/${token}`,
				(message) => {
					const agentData: AgentData = JSON.parse(message.body)
					const {
						idUsuario,
						listadoClientes,
						listadoSplit,
						idUsuarioBd,
						idOrganizacion,
					} = agentData

					// Recuperar id de evento de pausa
					if (agentData.conexionAsesor.logEventoPausa) {
						if (agentData.conexionAsesor.logEventoPausa.id) {
							localStorage.setItem(
								PAUSE_EVENT_ID,
								agentData.conexionAsesor.logEventoPausa.id.toString()
							)
							setAgentStatus('PAUSA')
							setAgentSocketStatus('PAUSA')
						}
					}

					// Setear valores en state
					setAgentId(idUsuario)
					agentIdDB = Number(idUsuarioBd)
					setAgentSplits(listadoSplit)

					// Activar listener de chats entrantes
					newChatsListener(idUsuario)

					// Suscribir eventos de pausa
					pauseEventsListener(idUsuario)

					// Suscribir evento de desconexión
					disconnectAgentListener(idUsuario, idOrganizacion)

					// Recuperar chats
					listadoClientes.forEach((client) => {
						console.log('RECUPERANDO CHATS', client)
						newMessageListener(client.conversationId, client.nombre)
						addConversationToState(client, true)
					})

					recoverConversations(listadoClientes)
					setRecoverHistory(true)
					setRecovering(false)
				},
				{ id: token }
			)
		}
	}

	/**
	 * Socket subscribe:
	 * Listener de chats entrantes
	 * también escucha conversaciones existentes pero que se recuperaron por ej por recargar la página
	 */
	const newChatsListener = (agentId: string) => {
		socket.subscribe(
			`/topic/mensajes/asesor/${agentId}`,
			(message) => {
				const body: Client = JSON.parse(message.body)

				console.log('CHAT ENTRANTE', body)
				if (body.fromDirectory) {
					// Guardar chat entrante para validar si se debe marcar como activo
					setChatFromDirectory({
						convId: Number(body.conversationId),
						phone: body.telefono,
					})
				}
				addConversationToState(body)
				newMessageListener(body.conversationId, body.nombre)

				showNotification(
					'Nuevo cliente',
					'Nuevo cliente: ' + body.nombre
				)
			},
			{ id: agentId }
		)
	}

	/**
	 * Socket subscribe:
	 * Listener de chats entrantes
	 * también escucha conversaciones existentes pero que se recuperaron por ej por recargar la página
	 */
	const disconnectAgentListener = (
		agentId: string,
		idOrganizacion: number
	) => {
		socket.subscribe(
			`/topic/asesor/desconexion/${agentId}/${idOrganizacion}`,
			(message) => {
				// Desactivar loader
				stopLoading()
				const body: PlainMessageReceived = JSON.parse(message.body)
				console.log('SUBSCRIBE DISCONNECTION BODY', body)

				// Refrescar token y reintentar desconexión del asesor
				if (body.error) {
					if (body.error === INVALID_TOKEN_MESSAGE) {
						dispatch(refreshTokenAction(setAccessToken)).then(
							() => {
								publishDisconnectAgent(agentId, idOrganizacion)
							}
						)
					} else {
						// Mostrar mensaje de error
						enqueueSnackbar(body.content, {
							variant: 'error',
							autoHideDuration: null,
						})

						// Loguear error
						saveLog({
							idOrg,
							payload: {
								callback: `/topic/asesor/desconexion/${agentId}`,
								detail: JSON.stringify({
									error: body.error,
									content: body.content,
								}),
								idadviser: agentIdDB,
							},
						})
					}
				} else if (body.tipoMensaje === 'COMMAND') {
					if (
						body.content === agentDisconnectionCommand ||
						body.content === agentManualDisconnectionCommand
					) {
						disconnectSocket()
					} else if (
						body.content === agentDisconnectionWithChatsCommand
					) {
						// Mostrar mensaje de error
						enqueueSnackbar(
							'No es posible desconectar al asesor ya que se detectaron chats entrantes.',
							{
								variant: 'info',
								autoHideDuration: null,
							}
						)
					}
				}
			}
		)
	}

	/**
	 * Socket subscribe:
	 * Listener de mensajes entrantes (para chats existentes)
	 */
	const newMessageListener = (conversationId: number, clientName: string) => {
		conversationId = Number(conversationId)
		const stomp = socket.subscribe(
			`/topic/mensajes/${conversationId}/${idOrg}`,
			(message) => {
				const body: PlainMessageReceived = JSON.parse(message.body)
				stompSubscribe[conversationId] = stomp

				console.log('MENSAJE ENTRANTE', body, 'TIPO', body.tipoUsuario)
				updateSendingMessage(conversationId)

				// Validar si hay un error
				if (body.error) {
					// Validar error de token
					if (body.error === INVALID_TOKEN_MESSAGE) {
						dispatch(refreshTokenAction(setAccessToken)).then(
							() => {
								setSendPendingMessages(true)
							}
						)
					} else {
						// Mostrar mensaje de error
						enqueueSnackbar(body.content, {
							variant: 'error',
							autoHideDuration: null,
						})

						// Loguear error
						saveLog({
							idOrg,
							payload: {
								callback: `/topic/mensajes/${conversationId}/${idOrg}`,
								detail: JSON.stringify({
									error: body.error,
									content: body.content,
								}),
								idadviser: agentIdDB,
							},
						})
					}
				} else {
					// Guardar log de error en caso de transferencia fallida
					if (
						[transferSplitError].includes(body.content as Command)
					) {
						// Loguear error que llega en mensaje tipo comando
						saveLog({
							idOrg,
							payload: {
								callback: `/topic/mensajes/${conversationId}/${idOrg}`,
								detail: body.content,
								idadviser: agentIdDB,
							},
						})
					}

					// Limpiar mensajes pendientes ya que el token es válido y no se deben recuperar
					setPendingMessages([])

					// Validar nombre del cliente para poder mostrar la notificación correctamente
					clientName =
						clientName.trim().length > 0 ? `${clientName}: ` : ''

					// Mensaje tipo COMMAND
					if (body.tipoMensaje === 'COMMAND') {
						checkCommand(body)

						const command = body.content as Command

						if (
							endConversationCommands.includes(command) ||
							startConversationCommand === command ||
							generalCommands.includes(command)
						) {
							getCustomMessages(() => {
								const message = getCommandMessage(command)
								showNotification(
									'Mensaje recibido',
									`${clientName}${message}`
								)
								updateConversationState(
									conversationId,
									body.adjunto,
									message,
									body.tipoUsuario
								)
							})
						}
					}
					// Solo se actualiza el state si es un mensaje enviado por el CLIENTE
					else {
						showNotification(
							'Mensaje recibido',
							`${clientName}${body.content}`
						)
						updateConversationState(
							conversationId,
							body.adjunto,
							body.content,
							body.tipoUsuario
						)
					}
				}
				stopLoading()
			},
			{ id: conversationId.toString() }
		)
	}

	/**
	 * Socket subscribe:
	 * Listener de errores del socket
	 */
	const socketErrorListener = (overwriteAccessToken?: string | null) => {
		const token = overwriteAccessToken ? overwriteAccessToken : accessToken
		if (token) {
			socket.subscribe(`/topic/asesor/errors/${token}`, (message) => {
				const body: PlainMessageReceived = JSON.parse(message.body)

				// Validar error
				if (body.error) {
					// Validar refresco de token
					if (body.error === INVALID_TOKEN_MESSAGE) {
						dispatch(refreshTokenAction(setAccessToken)).then(
							() => {
								publishAgent()
								socketErrorListener(getLSToken())
								agentListener(getLSToken())
								setPendingDirectoryMessage(true)
							}
						)
					} else {
						// Mostrar mensaje de error
						enqueueSnackbar(body.content, {
							variant: 'error',
							autoHideDuration: null,
						})

						// Loguear error
						saveLog({
							idOrg,
							payload: {
								callback: '/topic/asesor/errors',
								detail: JSON.stringify({
									error: body.error,
									content: body.content,
								}),
								idadviser: agentIdDB,
							},
						}).then(() => {
							// Desconectar socket al detectar al usuario como inactivo
							if (body.error === ASESOR_INACTIVO) {
								// Desconectar asesor y socket
								sendDisconnectAgent()
								disconnectSocket()
								// Cerrar sesión
								dispatch(thunkLogout())
							}
						})

						// sendDisconnectionCommand()
					}
				}
				stopLoading()
			})
		}
	}

	/**
	 * Socket subscribe:
	 * Listener para eventos de pausa
	 */
	const pauseEventsListener = (agentId: string) => {
		socket.subscribe(
			`/topic/mensajes/eventospausa/${agentId}`,
			(message) => {
				stopLoading()
				const body: RespuestaEventoPausa = JSON.parse(message.body)

				// Validar error en la pausa
				if (body.error) {
					// Error - Validar refresco de token
					if (body.error === INVALID_TOKEN_MESSAGE) {
						// Refrescar token y reintentar pausa
						dispatch(refreshTokenAction(setAccessToken)).then(
							() => {
								setSendPendingPauseEvent(true)
							}
						)
					} else {
						// Mostrar error en snackbar
						enqueueSnackbar(body.error, {
							variant: 'error',
							autoHideDuration: null,
						})

						// Loguear error
						saveLog({
							idOrg,
							payload: {
								callback: `/topic/mensajes/eventospausa/${agentId}`,
								detail: body.error,
								idadviser: agentIdDB,
							},
						})
					}
				}
				// Asesor pausado
				else if (body.logEventoPausa) {
					localStorage.setItem(
						PAUSE_EVENT_ID,
						body.logEventoPausa.id ?? ''
					)
					// Confirmar estado en pausa
					if (body.logEventoPausa.id) {
						setPendingPauseEvent([])
						setAgentSocketStatus('PAUSA')
					}
				}
				// Asesor activado
				else if (body.mensajeActivado) {
					localStorage.removeItem(PAUSE_EVENT_ID)
					setPendingPauseEvent([])
					setAgentSocketStatus('CONECTADO')
				} else {
					localStorage.removeItem(PAUSE_EVENT_ID)
				}
			}
		)
	}

	/**
	 * Socket subscribe:
	 * Listener para recuperar historial
	 */
	const recoverHistoryListener = (conversationId: number) => {
		// console.log('SUSCRITO A RECUPERAR HISTORIAL', conversationId)
		socket.subscribe(
			`/topic/mensajes/historial/${conversationId}/${idOrg}`,
			(message) => {
				stopLoading()
				const body: HistorialMensajes = JSON.parse(message.body)

				// Validar error
				if (body.error) {
					// Validar refresco de token
					if (body.error === INVALID_TOKEN_MESSAGE) {
						// Refrescar token y reintentar recuperación de historial
						dispatch(refreshTokenAction(setAccessToken)).then(
							() => {
								publishRecuperarHistorial(conversationId)
							}
						)
					} else {
						// Mostrar mensaje de error
						enqueueSnackbar(body.error, {
							variant: 'error',
							autoHideDuration: null,
						})

						// Loguear error
						saveLog({
							idOrg,
							payload: {
								callback: `/topic/mensajes/historial/${conversationId}/${idOrg}`,
								detail: body.error,
								idadviser: agentIdDB,
							},
						})
					}
				} else {
					if (body.listadoMensajes) {
						updateConversationHistory(
							body.listadoMensajes,
							conversationId
						)
					}
				}
			}
		)
	}

	/**
	 * Socket publish:
	 * Agregar asesor
	 */
	const publishAgent = () => {
		if (!connectionIssues && socket.active) {
			socket.publish({
				destination: '/app/agregar-asesor',
				body: JSON.stringify({ idUsuario: getLSToken() }),
			})
		}
	}

	/**
	 * Socket publish:
	 * Enviar mensaje
	 */
	const publishMessage = (publishMessage: PublishMessage) => {
		publishMessage.tipoMensaje = publishMessage.tipoMensaje ?? 'CHAT'
		const {
			conversationId,
			file,
			message,
			tipoMensaje,
			idSplitDestino, // Se utiliza solo cuando se hace transferencia
		} = publishMessage

		if (agentId) {
			const body: PlainMessageSend = {
				adjunto: file,
				asesorId: agentId,
				mensaje: message,
				tipoUsuario: 'ASESOR',
				tipoMensaje,
			}
			const isTransfer =
				tipoMensaje === 'COMMAND' && message === transferSplitCommand

			// Agregar parámetro adicional que requiere la transferencia
			if (isTransfer) {
				body.idSplitDestino = idSplitDestino
				// Activar banderita transfering en state de conversación
				toggleTransferingConversation(conversationId, true)
			}
			console.log('PUBLISH PAYLOAD', body)
			// console.log('SOCKET ACTIVE', socket.active)

			if (!connectionIssues && socket.active) {
				updateSendingMessageTimeout(conversationId, () => {
					console.log(
						'Snackbar -> Error al enviar el mensaje',
						publishMessage
					)
					// enqueueSnackbar('Error al enviar el mensaje', {
					// 	variant: 'error',
					// })
					setRefreshStomp(true)
				})
				setPendingMessages(pendingMessages.concat(publishMessage))
				socket.publish({
					destination: `/app/enviar-mensaje/${conversationId}/${idOrg}`,
					body: JSON.stringify(body),
					headers: {
						Authorization: `Bearer ${getLSToken()}`,
					},
				})
			}
		}
	}

	/**
	 * Socket publish:
	 * Desconectar asesor
	 */
	const publishDisconnectAgent = (
		agentId: string | null,
		idOrg: number,
		command:
			| AgentDisconnectionCommand
			| AgentManualDisconnectionCommand = 'DAM',
		sendToken = true
	) => {
		console.log('agentId', agentId + '#')
		console.log('idOrg', idOrg)
		if (agentId) {
			const body: PlainMessageSend = {
				adjunto: null,
				asesorId: agentId,
				mensaje: command,
				tipoUsuario: 'ASESOR',
				tipoMensaje: 'COMMAND',
			}

			console.log('PUBLISH DISCONNECTION BODY', body)

			if (!connectionIssues && socket.active) {
				startLoading()
				socket.publish({
					destination: `/app/asesor/desconexion/${agentId}/${idOrg}`,
					body: JSON.stringify(body),
					...(sendToken && {
						headers: {
							Authorization: `Bearer ${getLSToken()}`,
						},
					}),
				})
			}
		}
	}

	/**
	 * Socket publish:
	 * Pausar asesor
	 */
	const publishTogglePauseAgent = (id?: number) => {
		if (!connectionIssues && agentId && socket.active) {
			startLoading()
			const body: LogEventoPausa = {
				id: localStorage.getItem(PAUSE_EVENT_ID),
				endTime: null,
				idLogConnectionAgentHuman: null,
				idPauseEvent: id ?? null,
				pauseEventName: null,
				startTime: null,
			}

			setPendingPauseEvent(pendingPauseEvent.concat({ id }))
			socket.publish({
				destination: `/app/eventos-pausa/${Boolean(id)}/${agentId}`,
				body: JSON.stringify(body),
				headers: {
					Authorization: `Bearer ${getLSToken()}`,
				},
			})
		}
	}

	/**
	 * Socket publish:
	 * Recuperar historial de una conversación
	 */
	const publishRecuperarHistorial = (conversationId: number) => {
		const body: RecuperarHistorialPublish = {
			idAsesor: null,
			tipoUsuario: 'ASESOR',
		}
		console.log('BODY recuperar-historial', body)

		if (!connectionIssues && socket.active) {
			socket.publish({
				destination: `/app/recuperar-historial/${conversationId}/${idOrg}`,
				body: JSON.stringify(body),
				headers: {
					Authorization: `Bearer ${getLSToken()}`,
				},
			})
		}
	}

	/**
	 * Socket unsubscribe
	 */
	const unsubscribeClient = (conversationId: number) => {
		// Stomp unsubscribe
		if (stompSubscribe[conversationId]) {
			stompSubscribe[conversationId].unsubscribe()
			stompSubscribe.splice(conversationId, 1)
		}
	}

	/**
	 * Validar comando y ejecutar las acciones respectivas
	 */
	const checkCommand = (body: PlainMessageReceived) => {
		const command = body.content as Command
		const conversationId = Number(body.conversationId)

		console.log('COMMAND RECEIVED', command)
		// Comando de inicio de conversación (modificar state)
		if (command === startConversationCommand) {
			startConversationState(conversationId)
		}
		// Comando de fin de conversación (modificar state)
		else if (endConversationCommands.includes(command)) {
			finishConversationState(conversationId)
			// console.log('## checkCommand')
			// Unsubscribe
			unsubscribeClient(conversationId)
		}
		// Quitar conversación después de transferir (TCOSOK)
		else if (command === transferSplitSuccess) {
			// Consultar split de origen
			if (body.idSplit) {
				setSentTransferIds(
					sentTransferIds.concat({
						conversationId,
						split: Number(body.idSplit),
					})
				)
			}
		}
		// Error en la transferencia (TCOSERROR)
		else if (command === transferSplitError) {
			// Mostrar conversación nuevamente (desactivar bandera transfering)
			toggleTransferingConversation(conversationId, false)
			updateTransferConversation(conversationId, false)
			setTransferFailedIds(transferFailedIds.concat(conversationId))
			enqueueSnackbar('Error al realizar la transferencia', {
				variant: 'error',
				autoHideDuration: null,
			})
		}
	}

	/**
	 * Función para el envío de mensajes que no altera el estado del socket
	 */
	const sendMessage = (
		message: string,
		conversationId: number,
		file: Adjunto | null,
		tipoMensaje?: TipoMensaje
	) => {
		publishMessage({
			conversationId: Number(conversationId),
			file,
			message,
			tipoMensaje,
		})
	}

	const sendDirectoryMessage = (
		contact: Partial<ContactBAHPayload>,
		message: string,
		file?: Adjunto | null,
		refreshingToken?: boolean
	) => {
		if (agentId) {
			let body: Partial<ContactBAHPayload> = refreshingToken
				? contact
				: {
						...contact,
						listadoMensajes: [
							{
								adjunto: file ?? null,
								fechaMensaje:
									moment().format('DD/MM/YY, h:mm:ss'),
								mensaje: message,
								tipoMensaje: 'CHAT',
								tipoUsuario: 'ASESOR',
							},
						],
				  }
			const { email, identificacion, tipoIdentificacion, ...payload } =
				body

			body = {
				...payload,
				...(email && {
					email,
				}),
				...(tipoIdentificacion && {
					tipoIdentificacion,
				}),
				...(identificacion && {
					identificacion,
				}),
			}

			setLastDirectoryMessage(body)
			setDirectoryMessage(body)
			console.log('PUBLISH DIRECTORY PAYLOAD', body)

			if (!connectionIssues && socket.active) {
				// startLoading()
				socket.publish({
					destination: '/app/agregar-cliente-directorio',
					body: JSON.stringify(body),
					headers: {
						Authorization: `Bearer ${getLSToken()}`,
					},
				})
			}
		}
	}

	/**
	 * Función para el envío de mensajes que no altera el estado del socket
	 */
	const sendDisconnectAgent = () => {
		publishDisconnectAgent(agentId, idOrg)
	}

	/**
	 * Función para el publish que pausa el asesor
	 * @param id, para pausar, se envía el idPauseEvent, para activar, se envía el idLogEventPause
	 */
	const togglePauseAgent = (id?: number) => {
		publishTogglePauseAgent(id)
	}

	/**
	 * Iniciar conversación
	 * Activa el chat y envía el comando de inicio de conversación
	 * Si no se provee conversationId, se toma el id de la conversación actual
	 */
	const startConversation = (command: StartConversationCommand = 'IC') => {
		sendMessage(command, currentConversationId, null, 'COMMAND')
		startConversationState(currentConversationId)
	}

	/**
	 * Finalizar conversación
	 * Stomp unsuscribe y finalizar en el state
	 * Si no se provee conversationId, se toma el id de la conversación actual
	 */
	const finishConversation = (
		conversationId?: number,
		command: EndConversationCommand = 'FCCA'
	) => {
		conversationId = conversationId ?? currentConversationId

		sendMessage(command, conversationId, null, 'COMMAND')
	}

	/**
	 * Finalizar conversación después de reconexión
	 * Suscribirse a endpoint que recupera el historial
	 */
	const finishConversationAfterReconnect = (conversationId: number) => {
		// console.log('ENTRA A RECUPERAR HISTORIAL')

		// Finalizar en el state
		finishConversationState(Number(conversationId))
		// console.log('## finishConversationAfterReconnect')

		startLoading()
		connectSocket(() => {
			recoverHistoryListener(conversationId)
			stopLoading()
		})

		if (socket.active) {
			publishRecuperarHistorial(conversationId)
		}
	}

	/**
	 * Transferir conversación
	 * Si la transferencia de split es exitosa, se envia el comando de transferencia al back, se hace hace unsubscribe
	 * y se elimina la conversación del state
	 */
	const transferConversation = (idSplit: number, conversationId?: number) => {
		conversationId = conversationId ?? currentConversationId

		publishMessage({
			conversationId,
			file: null,
			message: transferSplitCommand,
			tipoMensaje: 'COMMAND',
			idSplitDestino: idSplit,
		})
	}

	/**
	 * Agrega una conversación finalizada al estado de causales por mostrar
	 */
	const triggerCausal = (conversationId: number) => {
		setTriggerCausalNegocio([...triggerCausalNegocio, conversationId])
	}

	return {
		agentSplits,
		conversationId: currentConversationId,
		connectionIssues,
		currentChat,
		finishConversation,
		recovering,
		sendMessage,
		sendDirectoryMessage,
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
		transferFailedIds,
		setTransferFailedIds,
		agentSocketStatus,
	}
}
