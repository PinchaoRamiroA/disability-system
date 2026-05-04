import { createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/services/api/humanAgent/filter'
import { EnqueueSnackbar } from '@/types/notistack'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import * as snackbars from '@/utils/constants/snackbars/filter'
import { Agents } from '@/types/HumanAgent/Agents'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import { IdOrgParam } from '@/types/auth'

export const getAgents = createAsyncThunk<
	Agents[],
	IdOrgParam,
	{ rejectValue: EnqueueSnackbar }
>('agents', async (params, { rejectWithValue }) => {
	try {
		const data: Agents[] = await api.getAgents(params)
		return data
	} catch (err) {
		detectUnauthorized(err, getAgents(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getAgentsError, err)
		)
	}
})
export {}
