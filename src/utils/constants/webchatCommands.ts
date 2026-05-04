import {
	AgentDisconnectionCommand,
	AgentDisconnectionWithChatsCommand,
	AgentManualDisconnectionCommand,
	EndConversationCommand,
	GeneralCommand,
	StartConversationCommand,
	TransferCommand,
} from '@/types/HumanAgent/WebChat'

export const endConversationCommands: EndConversationCommand[] = [
	'FCTIC',
	'FCTIA',
	'FCCC',
	'FCCA',
	'FCFHL',
]

export const startConversationCommand: StartConversationCommand = 'IC'

export const generalCommands: GeneralCommand[] = [
	'NDF',
	'NAPA',
	'FHSONR',
	'SASONR',
	'NPASD',
	'NAC',
	'ECANPR',
	'ECCNPR',
	'Cliente en cola',
	'',
]

export const transferSplitCommand: TransferCommand = 'TCOS'
export const transferSplitSuccess: TransferCommand = 'TCOSOK'
export const transferSplitError: TransferCommand = 'TCOSERROR'

export const agentDisconnectionCommand: AgentDisconnectionCommand = 'CCCNE'
export const agentManualDisconnectionCommand: AgentManualDisconnectionCommand =
	'DAM'
export const agentDisconnectionWithChatsCommand: AgentDisconnectionWithChatsCommand =
	'DACA'

export const INVALID_TOKEN_MESSAGE = 'invalid_token'

export const ASESOR_INACTIVO = 'Asesor inactivo'
