import React from 'react'
import {
	Adjunto,
	AgentStatus,
	ClientState,
	EndConversationCommand,
	TipoMensaje,
} from '@/types/HumanAgent/WebChat'
import { Splits } from '@/types/Splits'
import { ContactBAHPayload } from '@/types/Settings/asesor-humano/directorio'

export type ChatContextType = {
	drawerWidth: number
	chatHeaderHeigth: number
	chatListBg: string
	chatHeaderFooterBg: string
	chatContentBg: string
	conversationId: number
	setConversationId: (id: number) => void
	prevConversationId: number // Este valor sirve para guardar en el state la información del input en antes de cambiar de conversación
	setPrevConversationId: (id: number) => void
	agentSocketStatus: AgentStatus
	setAgentStatus: (status: AgentStatus) => void
	agentSplits: Splits[]
	agentStatusColor: string
	currentChat: ClientState | undefined
	sendMessage: (
		message: string,
		_conversationId: number,
		file: Adjunto | null,
		tipoMensaje?: TipoMensaje
	) => void
	sendDirectoryMessage: (
		contact: ContactBAHPayload,
		message: string,
		file?: Adjunto | null,
		refreshingToken?: boolean
	) => void
	startConversation: () => void
	finishConversation: (
		conversationId?: number,
		command?: EndConversationCommand
	) => void
	transferConversation: (idSplit: number, conversationId?: number) => void
	togglePauseAgent: (id?: number) => void
	inputValue: string
	setInputValue: (value: string) => void
}

export const ChatContext = React.createContext<ChatContextType | null>(null)
