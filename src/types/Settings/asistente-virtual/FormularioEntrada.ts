export interface FormEntrada {
	name: FieldName
	label: string
	isActive: boolean
	editable: boolean
	defaultText?: string
}

export interface FormEntradaUpdate {
	name: FieldName
	label: string
	isActive: boolean
}

export type FormEntradaFieldAction = 'add' | 'remove' | 'update'

export type FormConfigMode = 'add-remove' | 'reorder'

export interface UpdateFormEntrada {
	idOrg: number
	idVa: number
	payload: FormEntradaUpdate[]
}

export type FormStepContent = FormEntrada[]

export type FieldName =
	| 'generalTextHabeasData'
	| 'checkTextHabeasData'
	| 'endCustName'
	| 'endCustIdType'
	| 'endCustIdNumber'
	| 'endCustMail'
	| 'endCustPhone'
	| 'endCustLocation'
