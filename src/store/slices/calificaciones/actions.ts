import { createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/services/api/calificaciones'
import { EnqueueSnackbar } from '@/types/notistack'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import * as snackbars from '@/utils/constants/snackbars/filter'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import {
	IntentsTimeRating,
	RatingsParams,
	TopRating,
} from '@/types/Statistics/VirtualAgent/Calificaciones'

export const getIntentsTopRating = createAsyncThunk<
	TopRating,
	RatingsParams,
	{ rejectValue: EnqueueSnackbar }
>('getTopRating', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getRatings(params)
		return data
	} catch (err) {
		detectUnauthorized(err, getIntentsTopRating(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getIntentsRatingError, err)
		)
	}
})

export const getIntentsTimeRating = createAsyncThunk<
	IntentsTimeRating[],
	RatingsParams,
	{ rejectValue: EnqueueSnackbar }
>('getTimeRating', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getIntentsTimeRating(params)
		// const data: IntentsTimeRating[] = response.map((item) => {
		// 	return {
		// 		...item,
		// 		details: item.details.map((detail) => {
		// 			const { intent, negativo, positivo } = detail
		// 			const negativoConverted = negativo * -1
		// 			return {
		// 				intent,
		// 				rating1: positivo,
		// 				rating2: 0,
		// 				rating3: 0,
		// 				rating4: 0,
		// 				rating5: negativoConverted * 2,
		// 			}
		// 		}),
		// 	}
		// })
		return data
	} catch (err) {
		detectUnauthorized(err, getIntentsTimeRating(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getIntentsRatingError, err)
		)
	}
})
