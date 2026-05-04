import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NomalizedChannel, Channels } from '@/types/Channel'
import { getChannels } from './actions'
import { CHANNELS_COLOR } from '@/utils/constants/channels'
import { AppState } from '../..'
import { resetFilter, updateFields } from '../Filter'
import { Filter } from '@/types/Filter/Filter'

const initialState: ReducerType<NomalizedChannel[]> = {
	getStatus: 'idle',
	resource: [],
}

const ChannelsSlice = createSlice({
	name: 'channels',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getChannels.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getChannels.fulfilled,
				(state, action: PayloadAction<Channels>) => {
					state.getStatus = 'resolved'
					state.resource = Object.keys(action.payload.types).map(
						(key) => {
							const label =
								action.payload.types[key as keyof Channels]
							const channel: NomalizedChannel = {
								id: Number(key.split('channel')[1]),
								checked: false,
								label,
								color: CHANNELS_COLOR[label],
							}

							return channel
						}
					)
				}
			)
			.addCase(getChannels.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(updateFields, (state, action: PayloadAction<Filter>) => {
				if (action.payload.channels) {
					state.resource = state.resource.map((item) => {
						if (action.payload.channels?.includes(item.id)) {
							return { ...item, checked: true }
						} else {
							return { ...item, checked: false }
						}
					})
				}
			})
			.addCase(resetFilter, (state) => {
				state.resource = state.resource.map((item) => {
					return { ...item, checked: false }
				})
			})
	},
})

export const selectChannels = (state: AppState) => state.channels

export const channelsSelector = createSelector(selectChannels, (state) => state)

export const channelsReducer = ChannelsSlice.reducer
