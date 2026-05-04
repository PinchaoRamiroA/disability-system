import * as api from '@/services/api/reports/notifications'
import { EnqueueSnackbar } from '@/types/notistack'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'

import { getLogError } from '@/utils/constants/snackbars/notifications'
import {
	NotificationLogs,
	NotificationReportArgs,
} from '@/types/reports/notifications/Notifications'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'

export const getNotifLogs = createAsyncThunk<
	NotificationLogs,
	NotificationReportArgs,
	{ rejectValue: EnqueueSnackbar }
>('reports/notifications-log', async (args, { rejectWithValue }) => {
	try {
		const data: NotificationLogs = await api.getNotificationsLog(args)
		return data
	} catch (err) {
		detectUnauthorized(err, getNotifLogs(args))
		return rejectWithValue(setEnqueueSnackbar(getLogError, err))
	}
})
