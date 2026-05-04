import { createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/services/api/channels'
import { Channels } from '@/types/Channel'
import { EnqueueSnackbar } from '@/types/notistack'
import * as snackbars from '@/utils/constants/snackbars/filter'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'

export const getChannels = createAsyncThunk<
	Channels,
	void,
	{ rejectValue: EnqueueSnackbar }
>('channels/getChannels', async (_, { rejectWithValue }) => {
	try {
		const data: Channels = await api.getChannels()
		return data
	} catch (err) {
		detectUnauthorized(err, getChannels())
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getChannelsError, err)
		)
	}
})
