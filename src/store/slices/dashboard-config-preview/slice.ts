import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { AppState } from '../..'
import {
	Color,
	DashboardConfig,
	Fuente,
} from '@/types/Settings/General/Dashboard'
import { DASHBOARD_DEFAULT_CONFIG } from '@/utils/constants/dashboardConfig'

const initialState: DashboardConfig = DASHBOARD_DEFAULT_CONFIG

export const Slice = createSlice({
	name: 'preview',
	initialState,
	reducers: {
		updateDashboardPreview: (_, action: PayloadAction<DashboardConfig>) => {
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
		updatePrimaryColor: (state, action: PayloadAction<Color>) => {
			const { background, color } = action.payload

			return {
				...state,
				colores: {
					...state.colores,
					principal: {
						background,
						color,
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
		updateChatHeader: (state, action: PayloadAction<Color>) => {
			const { background, color } = action.payload

			return {
				...state,
				colores: {
					...state.colores,
					asesorHumano: {
						...state.colores.asesorHumano,
						header: {
							background,
							color,
						},
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
					asesorHumano: {
						...state.colores.asesorHumano,
						mensajeAsesor: {
							background,
							color,
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
					asesorHumano: {
						...state.colores.asesorHumano,
						mensajeCliente: {
							background,
							color,
						},
					},
				},
			}
		},
		updateChatFooter: (
			state,
			action: PayloadAction<{ background: string; iconsColor: string }>
		) => {
			const { background, iconsColor } = action.payload

			return {
				...state,
				colores: {
					...state.colores,
					asesorHumano: {
						...state.colores.asesorHumano,
						footer: {
							background,
							iconsColor,
						},
					},
				},
			}
		},
		updateFontSelected: (state, action: PayloadAction<Fuente>) => {
			return {
				...state,
				fuente: action.payload,
			}
		},
		updateFontVariant: (state, action: PayloadAction<string>) => {
			return {
				...state,
				fuente: {
					...state.fuente,
					variant: action.payload,
				},
			}
		},
	},
})
export const {
	updateDashboardPreview,
	updatePrimaryColor,
	updateSecondaryColor,
	updateHeader,
	updateChatHeader,
	updateMensajeAsesor,
	updateMensajeCliente,
	updateChatFooter,
	updateFontSelected,
	updateFontVariant,
} = Slice.actions

export const selectDashboardPreview = (state: AppState) =>
	state.dashboardPreview

export const dashboardPreviewSelector = createSelector(
	selectDashboardPreview,
	(state) => state
)

export const dashboardPreviewReducer = Slice.reducer
