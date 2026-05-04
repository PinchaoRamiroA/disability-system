export type LocationsParams = {
	idRegionals?: number[]
	idDepartments?: number[]
	idCities?: number[]
}

export type DatesParams = {
	start?: string
	end?: string
}

export interface FilterParams extends DatesParams {
	idVa: number
}
