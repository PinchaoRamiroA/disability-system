import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'

interface Drawer {
	open: boolean
	drawerWidth?: number
}
const initialState: Drawer = { open: true, drawerWidth: 260 }

export const Slice = createSlice({
	name: 'drawer',
	initialState,
	reducers: {
		setOpen: (state, action: PayloadAction<Drawer>) => {
			return { ...state, ...action.payload }
		},
	},
})

export const drawer = (state: AppState) => state.drawer
export const drawerSelector = createSelector(drawer, (state) => state)

export const { setOpen } = Slice.actions
export const drawerReducer = Slice.reducer
