export interface PauseEvent {
	[key: string]: string | number | boolean
	id: number
	name: string
	description: string
	logicDelete: boolean
}

export type CreatePauseEvent = {
	name: string
	description: string
}

export type DeletePauseEvent = {
	pauseEventId: number
}
