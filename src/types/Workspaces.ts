export interface Workspace {
	descName: string
	idWorkSpc: number
	watsonWorkSpcId: string
}

export interface WorkspaceAnswer {
	defaultTextResponse: string
	nodeDescription: string
	nodeId: string
	nodeLabel: string
	workspace: number
	id: string
	[key: string]: string | number
}

export interface WorkspaceAnswerDetailPayload {
	workspaceId: number
	nodeId: string
}

export interface WorkspaceAnswerDetail {
	elementOrderPos: number
	elementTypesIdType: number
	elementValue: string
	idResponse: number
	idVa: number
	respNodeIdWrkspc: number
	respNodeWatsonNodeId: string
}

export interface UpdateWorkspaceAnswerPayload {
	idVa: number
	idResponse: number
	elementValue: string
	elementTypesIdType: number
	elementOrderPos: number
	respNodeIdWrkspc: number
	respNodeWatsonNodeId: string
}

export interface UpdateWorkspace {
	includeWorkpaceData: boolean
	integrationResult: string
	listNewAnswersConfigElement: string[]
	listNewAnswersConfigElementFromMaster: string[]
	listNewResponseNodes: string[]
	listUpdatedResponseNodes: string[]
	workpaceData: string
	workspaceUpdateResponse: string
}

export interface DeleteWorkspaceAnswerPayload {
	idResponse: number
	idVa: number
	elementOrderPos: number
	respNodeIdWrkspc: number
	respNodeWatsonNodeId: string
}

export interface ItemType {
	label: string
	value: number
}
