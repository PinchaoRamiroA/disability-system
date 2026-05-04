export interface PlantillasRespuestaResponse {
	templates: PlantillaRespuesta[]
}

export interface PlantillaRespuesta {
	templateName: string
	templateContent: string
	idTemplate: number
}

export type NormalizedPlantillaRespuesta = {
	id: string | number
	templateName: string
	templateContent: string
	idTemplate: number
}

export interface UpsertPlantillaRespuesta {
	idOrg: number
	payload: {
		templateName: string
		templateContent: string
		idTemplate?: number
	}
	handleClose: () => void
}

export interface DeletePlantillaRespuesta {
	idOrg: number
	payload: {
		idTemplate: number
	}
	handleClose: () => void
}
