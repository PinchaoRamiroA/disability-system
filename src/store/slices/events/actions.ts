import { createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/services/api/events'
import { EnqueueSnackbar } from '@/types/notistack'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import * as snackbars from '@/utils/constants/snackbars/filter'
import { Events } from '@/types/Events'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'

export const getEvents = createAsyncThunk<
	Events[],
	void,
	{ rejectValue: EnqueueSnackbar }
>('events', async (_, { rejectWithValue }) => {
	try {
		const data: Events[] = await api.getEvents()
		return data
	} catch (err) {
		detectUnauthorized(err, getEvents())
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getEventsError, err)
		)
	}
})
export {}
