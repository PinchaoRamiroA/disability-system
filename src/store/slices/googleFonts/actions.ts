import * as api from '@/services/api/googleFonts'
import * as snackbars from '@/utils/constants/snackbars/settings/googleFonts'

import { EnqueueSnackbar } from '@/types/notistack'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { GoogleFont } from '@/types/Settings/General/Widget'

// Listado de causales activos
export const getGoogleFonts = createAsyncThunk<
	GoogleFont[],
	void,
	{ rejectValue: EnqueueSnackbar }
>('googleFonts', async (_, { rejectWithValue }) => {
	try {
		const data = await api.getGoogleFonts()

		return data.items.slice(0, 200).map((item) => ({
			category: item.category,
			family: item.family,
			variants: item.variants,
		})) as GoogleFont[]
	} catch (err) {
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getGoogleFontsError, err)
		)
	}
})
