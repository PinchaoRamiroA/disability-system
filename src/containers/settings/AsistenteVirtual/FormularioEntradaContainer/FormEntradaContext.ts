import {
	FormConfigMode,
	FormEntradaFieldAction,
	FormEntradaUpdate,
} from '@/types/Settings/asistente-virtual/FormularioEntrada'
import React from 'react'

export type FormEntradaContextType = {
	handleUpdateField: (
		field: FormEntradaUpdate | null,
		action: FormEntradaFieldAction
	) => void
	isGrabbing: boolean
	mode: FormConfigMode
}

export const FormEntradaContext =
	React.createContext<FormEntradaContextType | null>(null)
