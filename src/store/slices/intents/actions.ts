import { Intents, IntentsQuantities, IntentsSliceParams } from '@/types/Intents'
import { createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/services/api/intents'
import { EnqueueSnackbar } from '@/types/notistack'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import * as snackbars from '@/utils/constants/snackbars/filter'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'

export const getIntents = createAsyncThunk<
	Intents,
	IntentsSliceParams,
	{ rejectValue: EnqueueSnackbar }
>('intents/getIntents', async (params, { rejectWithValue }) => {
	try {
		const data: Intents = await api.getIntents(params.idOrg, params.filters)
		return data
	} catch (err) {
		detectUnauthorized(err, getIntents(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getIntentsError, err)
		)
	}
})

export const getIntentsQuantities = createAsyncThunk<
	IntentsQuantities[],
	IntentsSliceParams,
	{ rejectValue: EnqueueSnackbar }
>('intents/getIntentsQuantities', async (params, { rejectWithValue }) => {
	try {
		const data: IntentsQuantities[] = await api.getIntentsQuantities(
			params.idOrg,
			params.filters
		)
		return data
	} catch (err) {
		detectUnauthorized(err, getIntentsQuantities(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getIntentsError, err)
		)
	}
})
