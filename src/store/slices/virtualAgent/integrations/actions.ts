import { createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/services/api/virtualAgent'
import { EnqueueSnackbar } from '@/types/notistack'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import * as snackbars from '@/utils/constants/snackbars/virtualAgent'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import {
	Integrations,
	IntegrationsParams,
} from '@/types/Statistics/VirtualAgent/Integrations'

export const getIntegrations = createAsyncThunk<
	Integrations,
	IntegrationsParams,
	{ rejectValue: EnqueueSnackbar }
>('virtual-agent/integrations', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getIntegrations(params)
		return data
	} catch (err) {
		detectUnauthorized(err, getIntegrations(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getIntegrationsError, err)
		)
	}
})
export {}
