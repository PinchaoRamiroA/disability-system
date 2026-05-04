import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { AppState } from '../..'
import { Color, Fuente } from '@/types/Settings/General/Dashboard'
import { WidgetConfig } from '@/types/Settings/General/Widget'
import { WIDGET_CONFIG_DEFAULT } from '@/utils/constants/widgetConfigDefault'

const initialState: WidgetConfig = WIDGET_CONFIG_DEFAULT

export const Slice = createSlice({
	name: 'widget-preview',
	initialState,
	reducers: {
		updateWidgetPreview: (_, action: PayloadAction<WidgetConfig>) => {
			return action.payload
		},
		updateHeader: (state, action: PayloadAction<Color>) => {
			const { background, color } = action.payload

			return {
				...state,
				colores: {
					...state.colores,
					header: {
						background,
						color,
					},
				},
			}
		},
		updateFormButtons: (state, action: PayloadAction<Color>) => {
			const { background, color } = action.payload

			return {
				...state,
				colores: {
					...state.colores,
					steps: {
						buttons: {
							background,
							color,
						},
					},
				},
			}
		},
		updateSecondaryColor: (state, action: PayloadAction<Color>) => {
			const { background, color } = action.payload

			return {
				...state,
				colores: {
					...state.colores,
					secundario: {
						background,
						color,
					},
				},
			}
		},
		updateMensajeAsesor: (state, action: PayloadAction<Color>) => {
			const { background, color } = action.payload

			return {
				...state,
				colores: {
					...state.colores,
					chat: {
						...state.colores.chat,
						messages: {
							...state.colores.chat.messages,
							agent: {
								background,
								color,
							},
						},
					},
				},
			}
		},
		updateMensajeCliente: (state, action: PayloadAction<Color>) => {
			const { background, color } = action.payload

			return {
				...state,
				colores: {
					...state.colores,
					chat: {
						...state.colores.chat,
						messages: {
							...state.colores.chat.messages,
							client: {
								background,
								color,
							},
						},
					},
				},
			}
		},
		updateChatFooter: (
			state,
			action: PayloadAction<{ background: string; icons: string }>
		) => {
			const { background, icons } = action.payload

			return {
				...state,
				colores: {
					...state.colores,
					footer: {
						background,
						icons,
					},
				},
			}
		},
		updatePopupHeader: (state, action: PayloadAction<Color>) => {
			return {
				...state,
				colores: {
					...state.colores,
					popups: {
						...state.colores.popups,
						header: action.payload,
					},
				},
			}
		},
		updatePopupBody: (state, action: PayloadAction<Color>) => {
			return {
				...state,
				colores: {
					...state.colores,
					popups: {
						...state.colores.popups,
						body: action.payload,
					},
				},
			}
		},
		updatePopupPrimaryBtn: (state, action: PayloadAction<Color>) => {
			return {
				...state,
				colores: {
					...state.colores,
					popups: {
						...state.colores.popups,
						buttons: {
							...state.colores.popups.buttons,
							primary: action.payload,
						},
					},
				},
			}
		},
		updatePopupDefaultBtn: (state, action: PayloadAction<Color>) => {
			return {
				...state,
				colores: {
					...state.colores,
					popups: {
						...state.colores.popups,
						buttons: {
							...state.colores.popups.buttons,
							default: action.payload,
						},
					},
				},
			}
		},
		updateWidgetFontSelected: (state, action: PayloadAction<Fuente>) => {
			return {
				...state,
				font: action.payload,
			}
		},
		updateWidgetFontVariant: (state, action: PayloadAction<string>) => {
			return {
				...state,
				font: {
					...state.font,
					variant: action.payload,
				},
			}
		},
	},
})
export const {
	updateChatFooter,
	updateFormButtons,
	updateHeader,
	updateMensajeAsesor,
	updateMensajeCliente,
	updateSecondaryColor,
	updatePopupBody,
	updatePopupDefaultBtn,
	updatePopupHeader,
	updatePopupPrimaryBtn,
	updateWidgetFontSelected,
	updateWidgetFontVariant,
	updateWidgetPreview,
} = Slice.actions

export const selectWidgetPreview = (state: AppState) =>
	state.widgetPreviewConfig

export const widgetPreviewSelector = createSelector(
	selectWidgetPreview,
	(state) => state
)

export const widgetPreviewReducer = Slice.reducer
