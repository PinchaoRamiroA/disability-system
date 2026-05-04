import {
	createAsyncThunk,
	createSelector,
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit'
import * as api from '@/services/api/documentTypes'
import {
	DocumentType,
	DocumentTypeParam,
	NormalizedDocumentType,
} from '@/types/Filter/DocumentTypes'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import { EnqueueSnackbar } from '@/types/notistack'
import * as snackbars from '@/utils/constants/snackbars/filter'
import { ReducerType } from '@/types/Reducer'
import { AppState } from '../..'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'

export const getDocumentTypes = createAsyncThunk<
	DocumentType[],
	DocumentTypeParam,
	{ rejectValue: EnqueueSnackbar }
>('documentTypes/getDocumentTypes', async (params, { rejectWithValue }) => {
	try {
		const data: DocumentType[] = await api.getDocumentTypes(
			params.idOrg,
			params.filters
		)
		return data
	} catch (err) {
		detectUnauthorized(err, getDocumentTypes(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getChannelsError, err)
		)
	}
})

const initialState: ReducerType<NormalizedDocumentType[]> = {
	getStatus: 'idle',
	resource: [],
}

export const documentTypesSlice = createSlice({
	name: 'documentTypes',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getDocumentTypes.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getDocumentTypes.fulfilled,
				(state, action: PayloadAction<DocumentType[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload.map((docType) => {
						const typeName = docType.nameTypeDocument
						return { id: typeName, label: typeName }
					})
				}
			)
			.addCase(getDocumentTypes.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectDocumentTypes = (state: AppState) => state.documentTypes
export const documentTypesSelector = createSelector(
	selectDocumentTypes,
	(state) => state
)

export const documentTypesReducer = documentTypesSlice.reducer
