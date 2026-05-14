import { createAsyncThunk, createAction } from '@reduxjs/toolkit'
import { Auth, normalizeAuthUser } from '@/types/auth'
import * as api from '@/services/api/authentication'
import { saveAuthToken, getAuthToken, clearAuthToken } from '@/utils/helpers/accessToken'
import { setUserLoggedOut } from '@/services/api/utilities/interceptors'

export const LOGOUT_ACTION_TYPE = 'auth/logout'

export const thunkLogin = createAsyncThunk<Auth, { email: string; password: string }>(
	'auth/login',
	async ({ email, password }, { rejectWithValue }) => {
		try {
			const response = await api.login({ email, password })
			saveAuthToken(response)
			const user = normalizeAuthUser(response.user)
			localStorage.setItem('user', JSON.stringify(user))
			return user
		} catch (error: unknown) {
			return rejectWithValue((error as Error).message)
		}
	}
)

export const thunkLogout = createAsyncThunk(LOGOUT_ACTION_TYPE, () => {
	clearAuthToken()
	setUserLoggedOut(true)
	return null
})

export const retrieveLogin = createAsyncThunk<Auth | null, { token?: string }>(
	'auth/retrieve',
	async ({ token }) => {
		const storedToken = token || getAuthToken()
		if (storedToken) {
			const storedUser = localStorage.getItem('user')
			if (storedUser) {
				return JSON.parse(storedUser) as Auth
			}
		}
		return null
	}
)

export const checkChangePassword = createAsyncThunk(
	'auth/checkPasswordChange',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.checkChangePasswordAPI()
			return response.changePassword
		} catch (error: unknown) {
			return rejectWithValue((error as Error).message)
		}
	}
)

export const initialServices = createAction('auth/initialServices')
