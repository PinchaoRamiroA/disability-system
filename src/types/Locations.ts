import { Status } from './status'

export type Region = {
	id: number
	name: string
	label?: string
}

export interface RegionsList extends Region {
	departaments: Department[]
}

export type Department = {
	id: number
	idRegional: number
	name: string
	label?: string
}

export type City = {
	id: number
	idDepartment: number
	name: string
	label?: string
}

export type Locations = {
	departments: Department[]
	regions: Region[]
	cities: City[]
}

export type UrlParams = {
	idOrg: number
	requireCities?: boolean
}

export type LocationsFilterProps = {
	status: Status
	regions: Region[]
	regionsSelected: Region[]
	handleRegionsSelected: (value: Region[]) => void
	departments: Department[]
	departmentsSelected: Department[]
	handleDepartmentsSelected: (value: Department[]) => void
	filterLocations?: () => void
}

export type CreateRegionalParams = {
	idOrg: number
	name: string
}

export type UpdateRegionalParams = {
	idOrg: number
	id: number
	name: string
}

export type DeleteRegionalParams = {
	idOrg: number
	id: number
}

export type UpdateDepartmentParams = {
	id: number
	idOrg: number
	idRegional: number
}
