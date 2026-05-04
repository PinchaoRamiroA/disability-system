import { createSelector } from '@reduxjs/toolkit'
import { AppState } from '@/store/index'

export const selectNotifications = (state: AppState) =>
  state.notistack.notifications

export const notistackSelector = createSelector(
  selectNotifications,
  (state) => state
)
