export type GenericObject = {
	id: number | string
	[name: string]:
		| string
		| boolean
		| number
		| GenericObject
		| GenericObject[]
		| undefined
		| null
}
