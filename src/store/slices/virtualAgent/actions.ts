import { createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/services/api/virtualAgent'
import { EnqueueSnackbar } from '@/types/notistack'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import * as snackbars from '@/utils/constants/snackbars/filter'
import { VirtualAgent } from '@/types/VirtualAgent'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'

type IdOrg = number

export const getVirtualAgents = createAsyncThunk<
	VirtualAgent[],
	IdOrg,
	{ rejectValue: EnqueueSnackbar }
>('virtual-agent/getIds', async (idOrg: IdOrg, { rejectWithValue }) => {
	try {
		const data: VirtualAgent[] = await api.getIds(idOrg)
		return data
	} catch (err) {
		detectUnauthorized(err, getVirtualAgents(idOrg))
		return rejectWithValue(setEnqueueSnackbar(snackbars.getIdVaError, err))
	}
})
export {}
