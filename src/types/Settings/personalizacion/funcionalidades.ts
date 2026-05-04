export interface ConfigFeature {
	idFeature: number
	name: string
	description: string
	status: boolean
}

export interface ConfigFeatureUpdate {
	idOrg: number
	idVa: number
	payload: ConfigFeature
}
