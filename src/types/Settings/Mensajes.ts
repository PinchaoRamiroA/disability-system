import { EndConversationCommand } from '../HumanAgent/WebChat'

export interface MensajesConfig {
	idEndTypeConversation: number
	acronym: EndConversationCommand
	description: string
	clientMessage: string
	fin?: boolean
}
