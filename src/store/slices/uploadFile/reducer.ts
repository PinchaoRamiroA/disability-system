import { createSelector, createSlice } from '@reduxjs/toolkit'
import { uploadFileAction } from './actions'
import { AppState } from '../..'

interface UploadState {
  uploading: boolean
  error: boolean
}

const initialState: UploadState = {
  uploading: false,
  error: false,
}

const uploadFileSlice = createSlice({
  name: 'uploadFile',
  initialState,
  reducers: {
    uploadReset: (state) => {
      state.error = false
      state.uploading = false
    },
  },
  extraReducers(builder) {
    builder
      .addCase(uploadFileAction.pending, (state) => {
        state.uploading = true
        state.error = false
      })
      .addCase(uploadFileAction.fulfilled, (state) => {
        state.uploading = false
        state.error = false
      })
      .addCase(uploadFileAction.rejected, (state) => {
        state.uploading = false
        state.error = true
      })
  },
})

export const { uploadReset } = uploadFileSlice.actions

export const uploadFileState = (state: AppState) => state.uploadFile
export const uploadFileSelector = createSelector(
  uploadFileState,
  (state) => state
)

export const uploadFileReducer = uploadFileSlice.reducer
