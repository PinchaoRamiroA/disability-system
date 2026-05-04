import { ReducerType } from '@/types/Reducer'
import {
	createSelector,
	createSlice,
	nanoid,
	PayloadAction,
} from '@reduxjs/toolkit'
import {
	createPlantillaRespuesta,
	deletePlantillaRespuesta,
	getPlantillasRespuesta,
	updatePlantillaRespuesta,
} from './actions'
import { AppState } from '@/store/index'
import {
	NormalizedPlantillaRespuesta,
	PlantillaRespuesta,
} from '@/types/Settings/asesor-humano/plantillas-respuesta'

const initialState: ReducerType<NormalizedPlantillaRespuesta[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'plantillas-respuesta',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getPlantillasRespuesta.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getPlantillasRespuesta.fulfilled,
				(
					state,
					action: PayloadAction<NormalizedPlantillaRespuesta[]>
				) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getPlantillasRespuesta.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				createPlantillaRespuesta.fulfilled,
				(state, action: PayloadAction<PlantillaRespuesta>) => {
					state.resource = state.resource.concat({
						...action.payload,
						id: nanoid(),
					})
				}
			)
			.addCase(
				updatePlantillaRespuesta.fulfilled,
				(state, action: PayloadAction<PlantillaRespuesta>) => {
					const { idTemplate, templateContent, templateName } =
						action.payload
					state.resource = state.resource.map((item) => {
						if (item.idTemplate === idTemplate) {
							return {
								...item,
								templateContent,
								templateName,
							}
						}
						return item
					})
				}
			)
			.addCase(
				deletePlantillaRespuesta.fulfilled,
				(state, action: PayloadAction<number>) => {
					state.resource = state.resource.filter(
						(item) => item.idTemplate !== action.payload
					)
				}
			)
	},
})

export const selectPlantillasRespuesta = (state: AppState) =>
	state.plantillasRespuesta
export const plantillasRespuestaSelector = createSelector(
	selectPlantillasRespuesta,
	(state) => state
)

export const plantillasRespuestaReducer = Slice.reducer
