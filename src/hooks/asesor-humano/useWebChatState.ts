import moment from 'moment'
import { nanoid } from '@reduxjs/toolkit'
import { formatConversation } from '@/utils/helpers/formatConversation'
import {
	Adjunto,
	ChatStatus,
	Client,
	ClientState,
	FormatedChat,
	InteractionFact,
	LogSocket,
	TipoUsuario,
} from '@/types/HumanAgent/WebChat'
import { useAppDispatch } from '../useReduxHooks'
import {
	finishChat,
	newChat,
	removeChat,
	newInputInfo,
	startChat,
	updateChat,
	removeInputInfo,
	sortChats,
	recoverChats,
	updateHistory,
	updateBlobURL,
	markAsTransfer,
	toggleTransfering,
	setSendingMessage,
	updateConversation,
	updateDirectoryChat,
} from '@/store/slices/humanAgent'
import { ContactBAHPayload } from '@/types/Settings/asesor-humano/directorio'
import { saveLog } from '@/store/slices/web-chat-human-agent'

let sendMessageTimer: NodeJS.Timeout
const loaderTimer: { conv: number; timer: NodeJS.Timeout }[] = []

export const useWebChatState = () => {
	const dispatch = useAppDispatch()

	const clearLoaderTimer = (conversationId: number) => {
		const index = loaderTimer.findIndex(
			(item) => item.conv === conversationId
		)
		if (index > -1) {
			clearInterval(loaderTimer[index].timer) // Limpiar el timer
			loaderTimer.splice(index, 1) // Remover del array
		}
	}
	/**
	 * Agrega una conversación entrante al state
	 * Inicializa la información del input en el reducer chatsInputInfoReducer
	 * Si el chat no es un nuevo chat (recuperación de chat), se puede determinar el
	 * estado validando si el array listadoMensajes[] está vacío o no
	 */
	const addConversationToState = (body: Client, refresh = false) => {
		const messages = formatConversation(
			body.listadoMensajesVirtual,
			body.listadoMensajes
		)
		const lastMessage = messages[messages.length - 1]
		const possibleStatus: ChatStatus[] = [
			'ACTIVO',
			'ENTRANTE',
			'FINALIZADO',
		]
		const status: ChatStatus = possibleStatus.includes(
			body.conversationStatus
		)
			? body.conversationStatus
			: 'ENTRANTE'

		const newBody: ClientState = {
			active: false,
			recover: false,
			channel: body.channel,
			ciudad: body.ciudad,
			conversationId: Number(body.conversationId),
			conversationStatus: status,
			conversacionAgenteHumano: body.conversacionAgenteHumano,
			currentChatTime: '',
			departamento: body.departamento,
			email: body.email,
			escalado: body.escalado,
			identificacion: body.identificacion,
			lastMessage: lastMessage.messageTime,
			lastInteraction: lastMessage.message,
			messages: messages,
			nombre: body.nombre,
			split: body.split,
			status,
			telefono: body.telefono,
			tipoIdentificacion: body.tipoIdentificacion,
			typeAlert: body.typeAlert,
			unreadMessages: 0,
			uploadFile: {
				error: false,
				loading: false,
			},
			idVa: body.idVa,
			causalsChecked: 'idle',
			businessCausals: true,
			endCausals: true,
			causalsSetted: false,
			transfer: false,
			transfering: false,
			transferCompleted: refresh ? 'idle' : 'false',
			sendingMessage: false,
			fromDirectory: body.fromDirectory,
		}
		dispatch(newChat(newBody))
		dispatch(newInputInfo({ conversationId: newBody.conversationId }))

		// Ordenar chats
		dispatch(sortChats())

		// Timeout para quitar loader de botón IC luego de transferencia
		if (newBody.escalado && !refresh) {
			loaderTimer.push({
				conv: newBody.conversationId,
				timer: setTimeout(() => {
					updateConversationFields(newBody.conversationId, {
						transferCompleted: 'true',
					})
					// Limpiar timer
					clearLoaderTimer(newBody.conversationId)
				}, 3500),
			})
		}
	}

	/**
	 * Actualiza una conversación existente en el state
	 */
	const updateConversationState = (
		conversationId: number,
		file: Adjunto | null,
		message: string,
		tipoUsuario: TipoUsuario
	) => {
		const formatedMessage: FormatedChat = {
			id: nanoid(),
			client: tipoUsuario === 'CLIENTE',
			message: message,
			file: file,
			messageTime: moment().format('DD/MM/YY, h:mm:ss'),
			itemOptions: [],
			itemType: 1,
		}

		dispatch(
			updateChat({
				conversationId: conversationId,
				message: formatedMessage,
			})
		)

		// Ordenar chats
		dispatch(sortChats())
	}

	/**
	 * Actualiza el blobURL de un mensaje
	 */
	const updateMessageBlobUrlState = (
		blobUrl: string | undefined,
		conversationId: number,
		id: string
	) => {
		dispatch(updateBlobURL({ blobUrl, conversationId, id }))
	}

	/**
	 * Conversación a transferir
	 */
	const updateTransferConversation = (
		conversationId: number,
		transfer: boolean
	) => {
		dispatch(markAsTransfer({ conversationId, transfer }))
	}

	/**
	 * Conversación en estado de transferencia
	 */
	const toggleTransferingConversation = (
		conversationId: number,
		transfering: boolean
	) => {
		dispatch(toggleTransfering({ conversationId, transfering }))
	}

	/**
	 * Setea el atributo 'status' de la conversación a ACTIVO
	 */
	const startConversationState = (conversationId: number) => {
		dispatch(startChat({ conversationId }))
	}

	/**
	 * Setea el atributo 'status' de la conversación a FINALIZADO
	 * Elimina la información de la conversación del reducer chatsInputInfoReducer
	 */
	const finishConversationState = (conversationId: number) => {
		dispatch(finishChat({ conversationId }))
		dispatch(removeInputInfo({ conversationId }))
	}

	/**
	 * Elimina una conversación del state (la conversación no sigue siendo visible)
	 * Elimina la información de la conversación del reducer chatsInputInfoReducer (para el caso de transferencia)
	 */
	const removeConversationFromState = (conversationId: number) => {
		dispatch(removeChat({ conversationId }))
		dispatch(removeInputInfo({ conversationId }))
	}

	const recoverConversations = (clientes: Client[]) => {
		const ids = clientes.map((cli) => Number(cli.conversationId))
		dispatch(recoverChats(ids))
		// console.log('STATE ACTUALIZADO CON CONVERSACIONES FINALIZADAS')
	}

	const updateConversationHistory = (
		interactionFacts: InteractionFact[],
		conversationId: number
	) => {
		console.log('interactionFacts', interactionFacts)
		const messages = formatConversation(interactionFacts, [])
		const lastMessage = messages[messages.length - 1]

		// console.log('HISTORIAL', messages)

		dispatch(
			updateHistory({
				conversationId,
				lastMessage: lastMessage.messageTime,
				lastInteraction: lastMessage.message,
				messages,
			})
		)
	}

	// Actualiza bandera que indica que se está un mensaje en una conversación
	const updateSendingMessage = (conversationId: number) => {
		dispatch(setSendingMessage({ conversationId, sendingMessage: false }))
	}

	// Fuerza actualización de bandera que indica que se está enviando un mensaje en una conversación
	const updateSendingMessageTimeout = (
		conversationId: number,
		callback?: () => void
	) => {
		clearTimeout(sendMessageTimer)
		sendMessageTimer = setTimeout(() => {
			dispatch(
				setSendingMessage({
					conversationId,
					sendingMessage: false,
					callback,
				})
			)
		}, 10000)
	}

	// Actualiza los campos de la conversación que se pasen como argumentos
	const updateConversationFields = (
		conversationId: number,
		body: Partial<ClientState>
	) => {
		// Limpiar timer
		clearLoaderTimer(conversationId)
		dispatch(updateConversation({ body, conversationId }))
	}

	const setDirectoryMessage = (payload: Partial<ContactBAHPayload>) => {
		dispatch(updateDirectoryChat(payload))
	}

	// Guardar log
	const saveLogPivot = async (params: LogSocket) => {
		dispatch(saveLog(params))
	}

	return {
		addConversationToState,
		finishConversationState,
		recoverConversations,
		removeConversationFromState,
		startConversationState,
		updateConversationState,
		updateConversationHistory,
		updateMessageBlobUrlState,
		updateTransferConversation,
		toggleTransferingConversation,
		updateSendingMessage,
		updateSendingMessageTimeout,
		updateConversationFields,
		setDirectoryMessage,
		saveLog: saveLogPivot,
	}
}
