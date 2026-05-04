import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { AppState } from '@/store/index'
import {
	ClientState,
	FormatedChat,
	MessagesHistoryPayload,
	UpdateChatPayload,
} from '@/types/HumanAgent/WebChat'
import { revokeObjectURLs } from '@/utils/helpers/formatConversation'
import moment from 'moment'

const initialState: ClientState[] = []

// Organiza los chats priorizando sobre el chats finalizados y según el último mensaje recibido
const compareObjects = (a: ClientState, b: ClientState) => {
	if (
		(a.status === 'ACTIVO' || a.status === 'ENTRANTE') &&
		b.status === 'FINALIZADO'
	)
		return -1
	else if (a.lastMessage >= b.lastMessage) return -1
	else return 0
}

const chatsSlice = createSlice({
	name: 'chats',
	initialState,
	reducers: {
		newChat: (state, action: PayloadAction<ClientState>) => {
			const newChat = action.payload
			const newState: ClientState[] = []
			let duplicated = false

			// Validar si la conversación ya existe y eliminarla para reemplazarla por la nueva
			state.forEach((item) => {
				// Conversación existente, eliminar el original del state (tiene historial desactualizado)
				if (item.conversationId === newChat.conversationId) {
					newState.push(newChat)
					duplicated = true
				} else {
					newState.push(item)
				}
			})

			if (duplicated) {
				return newState
			}
			return [...state, newChat]
		},
		updateChat: (state, action: PayloadAction<UpdateChatPayload>) => {
			return state.map((chat) => {
				// Chat a modificar
				if (chat.conversationId === action.payload.conversationId) {
					const { client, message } = action.payload.message
					let unreadMessages = 0

					// El mensaje no es del chat activo y es enviado por el cliente
					if (!chat.active && client) {
						unreadMessages = chat.unreadMessages + 1
					}

					return {
						...chat,
						currentChatTime: moment().format().slice(0, -6),
						lastMessage: moment().format('DD/MM/YY, h:mm:ss'),
						lastInteraction: (client ? '' : 'Tú: ') + message,
						messages: [...chat.messages, action.payload.message],
						unreadMessages: unreadMessages,
						uploadFile: {
							error: false,
							loading: false,
						},
					} as ClientState
				}
				return chat
			})
		},
		updateConversation: (
			state,
			action: PayloadAction<{
				conversationId: number
				body: Partial<ClientState>
			}>
		) => {
			const { body, conversationId } = action.payload
			return state.map((item) => {
				if (item.conversationId === conversationId) {
					return {
						...item,
						...body,
					}
				}
				return item
			})
		},
		updateBlobURL: (
			state,
			action: PayloadAction<{
				blobUrl: string | undefined
				conversationId: number
				id: string
			}>
		) => {
			const { blobUrl, conversationId, id } = action.payload
			return state.map((chat) => {
				// Buscar conversación
				if (chat.conversationId === conversationId) {
					// Buscar mensaje
					const messages = chat.messages.map((message) => {
						// Mensaje encontrado
						if (message.id === id) {
							return {
								...message,
								file: {
									...message.file,
									blobUrl,
								},
							}
						}
						return message
					}) as FormatedChat[]

					return {
						...chat,
						messages,
					}
				}
				return chat
			})
		},
		updateActiveChat: (
			state,
			action: PayloadAction<{ conversationId: number }>
		) => {
			return state.map((chat) => {
				if (chat.conversationId === action.payload.conversationId) {
					return {
						...chat,
						active: true,
						unreadMessages: 0,
					}
				}
				return {
					...chat,
					active: false,
				}
			})
		},
		resetActiveChat: (state) =>
			state.map((chat) => ({ ...chat, active: false })),
		uploadingFile: (
			state,
			action: PayloadAction<{ conversationId: number }>
		) => {
			return state.map((chat) => {
				if (chat.conversationId === action.payload.conversationId) {
					return {
						...chat,
						uploadFile: {
							loading: true,
							error: false,
						},
					}
				}
				return chat
			})
		},
		uploadedFile: (
			state,
			action: PayloadAction<{ conversationId: number }>
		) => {
			return state.map((chat) => {
				if (chat.conversationId === action.payload.conversationId) {
					return {
						...chat,
						uploadFile: {
							loading: false,
							error: false,
						},
					}
				}
				return chat
			})
		},
		startChat: (
			state,
			action: PayloadAction<{ conversationId: number }>
		) => {
			return state.map((chat) => {
				if (chat.conversationId === action.payload.conversationId) {
					return { ...chat, status: 'ACTIVO' } as ClientState
				}
				return chat
			})
		},
		finishChat: (
			state,
			action: PayloadAction<{ conversationId: number }>
		) => {
			return state.map((chat) => {
				if (chat.conversationId === action.payload.conversationId) {
					return {
						...chat,
						status: 'FINALIZADO',
						recover: false,
					} as ClientState
				}
				return chat
			})
		},
		removeChat: (
			state,
			action: PayloadAction<{ conversationId: number }>
		) => {
			return state.filter((chat) => {
				if (chat.conversationId === action.payload.conversationId) {
					revokeObjectURLs(chat.messages)
					return false
				}
				return true
			})
		},
		recoverChats: (state, action: PayloadAction<number[]>) => {
			const newChats = action.payload

			// console.log('Reducer: recoverChats')
			// Marcar chats finalizados
			return state.map((chat) => {
				// console.log(
				// 	'chat.conversationId',
				// 	chat.conversationId,
				// 	chat.status
				// )
				// Chat existe en state y continúa activo o existe en state pero finalizado
				if (
					newChats.includes(chat.conversationId) ||
					chat.status === 'FINALIZADO'
				) {
					// console.log('Existe')
					return chat
				}
				// Chat existe en el state como activo (marcar como finalizado)
				else {
					// console.log('YA NO Existe, status modificado')
					return { ...chat, recover: true, status: 'FINALIZADO' }
				}
			})
		},
		updateHistory: (
			state,
			action: PayloadAction<MessagesHistoryPayload>
		) => {
			const { conversationId, lastMessage, lastInteraction, messages } =
				action.payload
			return state.map((chat) => {
				if (chat.conversationId === conversationId) {
					return {
						...chat,
						lastMessage,
						lastInteraction,
						messages,
					}
				}
				return chat
			})
		},
		sortChats: (state) => {
			const sortedChats = [...state].sort(compareObjects)
			return sortedChats
		},
		markAsTransfer: (
			state,
			action: PayloadAction<{ conversationId: number; transfer: boolean }>
		) => {
			const { conversationId, transfer } = action.payload
			return state.map((item) => {
				if (item.conversationId === conversationId) {
					return {
						...item,
						transfer,
						causalsChecked: 'idle',
						businessCausals: true,
						endCausals: true,
						causalsSetted: false,
					}
				}
				return item
			})
		},
		toggleTransfering: (
			state,
			action: PayloadAction<{
				conversationId: number
				transfering: boolean
			}>
		) => {
			const { conversationId, transfering } = action.payload
			return state.map((item) => {
				if (item.conversationId === conversationId) {
					return {
						...item,
						transfering,
					}
				}
				return item
			})
		},
		setCheckedCausals: (
			state,
			action: PayloadAction<{
				conversationId: number
				status: 'checking' | 'checked'
			}>
		) => {
			const { conversationId, status } = action.payload
			return state.map((item) => {
				if (item.conversationId === conversationId) {
					return {
						...item,
						causalsChecked: status,
					}
				}
				return item
			})
		},
		setEndingCausals: (
			state,
			action: PayloadAction<{ conversationId: number }>
		) => {
			const { conversationId } = action.payload
			return state.map((item) => {
				if (item.conversationId === conversationId) {
					return {
						...item,
						endCausals: false,
					}
				}
				return item
			})
		},
		setBusinessCausals: (
			state,
			action: PayloadAction<{ conversationId: number }>
		) => {
			const { conversationId } = action.payload
			return state.map((item) => {
				if (item.conversationId === conversationId) {
					return {
						...item,
						businessCausals: false,
					}
				}
				return item
			})
		},
		causalsSetted: (
			state,
			action: PayloadAction<{ conversationId: number }>
		) => {
			const { conversationId } = action.payload
			return state.map((item) => {
				if (item.conversationId === conversationId) {
					return {
						...item,
						causalsSetted: true,
					}
				}
				return item
			})
		},
		setSendingMessage: (
			state,
			action: PayloadAction<{
				conversationId: number
				sendingMessage: boolean
				callback?: () => void
			}>
		) => {
			const { conversationId, sendingMessage, callback } = action.payload

			return state.map((item) => {
				if (item.conversationId === conversationId) {
					// Ejecutar callback cuando:
					// Se está enviando un mensaje en la conversación (item.sendingMessage === true)
					// y pero se recibe el parámetro para detener el envío ( ! sendingMessage)
					if (item.sendingMessage && !sendingMessage && callback) {
						callback()
					}
					return {
						...item,
						sendingMessage,
					}
				}
				return item
			})
		},
	},
})

export const {
	finishChat,
	newChat,
	recoverChats,
	removeChat,
	sortChats,
	startChat,
	updateActiveChat,
	updateBlobURL,
	updateChat,
	updateHistory,
	uploadedFile,
	uploadingFile,
	setCheckedCausals,
	setBusinessCausals,
	setEndingCausals,
	causalsSetted,
	markAsTransfer,
	toggleTransfering,
	setSendingMessage,
	updateConversation,
	resetActiveChat,
} = chatsSlice.actions

export const chatsState = (state: AppState) => state.humanAgentChats
export const chatsSelector = createSelector(chatsState, (state) => state)

export const humanAgentChatReducer = chatsSlice.reducer
