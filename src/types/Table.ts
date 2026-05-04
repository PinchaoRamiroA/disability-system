import { ReactElement } from 'react'

export type TableHeader = {
	propertyName: string
	label: string
	align?: Align
	type?: Type
}

export type SubtableHeader = {
	propertyName: string
	label: string
	align?: Align
}

export type Type = 'badge' | 'switch' | 'link' | 'actions' | 'expand'

export type Align = 'center' | 'inherit' | 'justify' | 'left' | 'right'

export type TableAction = {
	id: string
	label: string
	action: () => void
}

export type RowAction<T> = {
	id: string
	label: string
	icon?: ReactElement
	lock?: boolean
	canBeDisabled?: boolean
	action: (param: T) => void
}

export type RowSwitchAction<T> = (param: T) => void

export type NoDataText = {
	title: string
	description: string
}
