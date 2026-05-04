import * as api from '@/services/api/estado-chats'
import * as snackbars from '@/utils/constants/snackbars/estado-chats'

import { EnqueueSnackbar } from '@/types/notistack'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { EstadoChats } from '@/types/Statistics/HumanAgent/EstadoChats'
import { IdOrgParam } from '@/types/auth'

// Listado de causales
export const getChatsEnCola = createAsyncThunk<
	EstadoChats[],
	IdOrgParam,
	{ rejectValue: EnqueueSnackbar }
>('estado-chats', async (param, { rejectWithValue }) => {
	try {
		const data = await api.getChatsEnCola(param)
		return data
	} catch (err) {
		detectUnauthorized(err, getChatsEnCola(param))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getEstadoChatsError, err)
		)
	}
})
