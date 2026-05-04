export interface Splits {
	[key: string]: string | number | boolean | HorariosAtencion[] | Derivacion[]
	id: number | string
	idSplit: number
	nombre: string
	descripcion: string
	fechaCreacion: string
	fechaActualizacion: string
	activo: boolean
	timeInactivityClient: number
	timeInactivityAgent: number
	timeMaxInitConversation: number
	horariosAtencion: HorariosAtencion[]
	derivaciones: Derivacion[]
	logicDelete: number
}

export interface Derivacion {
	[key: string]: string | number | boolean
	id: string | number
	id_splits_derive: number
	split_origin: number
	split_derive: number
	nameSplitDerive: string
	priority: number
}

export type CreateSplitParams = {
	descripcion: string
	nombre: string
	logicDelete: number
	timeInactivityAgent: number
	timeInactivityClient: number
	timeMaxInitConversation: number
}

export type UpdateSplitParams = {
	idSplit: number
	activo: boolean
	descripcion: string
	nombre: string
	timeInactivityAgent: number
	timeInactivityClient: number
	timeMaxInitConversation: number
}

export interface DeleteSplitParams {
	codigoSplit: number
}

export interface HorarioSplit {
	id_hours_by_splits: number
	id_split: number
	id_day: number
	hour_init: string
	hour_end: string
}

export interface HorariosAtencion extends HorarioSplit {
	[key: string]: string | number
	id: string | number
}

export type HorariosDia = {
	label: string
	horarios: HorariosAtencion[]
}

export interface SplitAsesorParams {
	idUsuario: number
}

export interface DeleteSplitAsesorParams {
	idSplitUsuario: number
}
export interface CreateSplitAsesorParams {
	idSplit: number
	idUsuario: number
	idorg: number
	idva: number
}

export interface SplitsAsesor {
	id: number
	idSplit: number
	idUsuario: number
	fechaCreacion: string
	fechaActualizacion: null
	borrado: boolean
	idva: number
	idorg: number
}

export interface SplitsAutocomplete {
	idSplit: number
	nombre: string
}

export type CreateSplitSchedule = {
	id_split: number
	id_day: number
	hour_init: string
	hour_end: string
}

export interface UpdateSplitSchedule {
	horarios: HorariosAtencion[]
	idSplit: number
}

export interface DeleteSplitSchedule {
	codigoRegistro: number
	idSplit: number
}

export type CreateSplitDerive = {
	split_origin: number
	split_derive: number
	priority: number
}

export interface UpdateSplitDerive {
	idSplit: number
	derivaciones: Derivacion[]
}

export type DeleteSplitDerive = {
	codigoRegistro: number
	idSplit: number
}
