import { createReducer, PayloadAction } from '@reduxjs/toolkit'
import { closeSnackbar, enqueueSnackbar, removeSnackbar } from './actions'
import { CloseSnackbarOptions, IEnqueueSnackbar } from '@/types/notistack'

export type NotistackList = {
  notifications: IEnqueueSnackbar[]
}

const initialState: NotistackList = {
  notifications: [],
}

export const notistackReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(
      enqueueSnackbar,
      (state, action: PayloadAction<IEnqueueSnackbar>) => {
        const newNotification: IEnqueueSnackbar = {
          ...action.payload,
          dismissed: false,
        }
        return {
          notifications: state.notifications.concat(newNotification),
        }
      }
    )
    .addCase(
      closeSnackbar,
      (state, action: PayloadAction<CloseSnackbarOptions>) => {
        return {
          notifications: state.notifications.map((notification) => {
            if (
              action.payload.dismissAll ||
              notification.key === action.payload.key
            ) {
              return { ...notification, dismissed: true }
            } else {
              return { ...notification }
            }
          }),
        }
      }
    )
    .addCase(removeSnackbar, (state, action: PayloadAction<string>) => {
      return {
        notifications: state.notifications.filter(
          (notification) => notification.key !== action.payload
        ),
      }
    })
})
