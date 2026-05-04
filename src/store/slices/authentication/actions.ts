import { createAsyncThunk, createAction } from '@reduxjs/toolkit'
import {
	Auth,
	AuthParams,
	ChangePassValue,
	LDAPCredentials,
	Token,
} from '@/types/auth'
import * as api from '@/services/api/authentication'
import {
	parseAuthToken,
	saveAgentStatus,
	saveAuthToken,
} from 'utils/helpers/accessToken'
import { EnqueueSnackbar } from '@/types/notistack'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import {
	authError,
	checkPasswordChangeError,
	lockedError,
} from '@/utils/constants/snackbars/auth'
import { AppDispatch, AppThunk } from '../..'
import { autoLogOut, cleanLocalStorage } from '@/utils/helpers/autoLogOut'
import {
	ACCESS_TOKEN_NAME,
	LOGOUT_ACTION_TYPE,
} from '@/utils/constants/userSession'

import {
	ADMIN_ROLE,
	HUMAN_AGENT_ROLE,
	SUPERADMIN_ROLE,
	SUPERVIEWER_ROLE,
	SUPERVISOR_ROLE,
	VIEWER_ROLE,
} from '@/utils/constants/roles'
import { getChannels } from '../channels/actions'
import { getVirtualAgents } from '../virtualAgent'
import { getCompanies } from '../companies'
import { AxiosError } from 'axios'
import { serverError } from '@/utils/constants/snackbars'
import { getFullConfigMensajes } from '../mensajes'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'

export const loginAsync = createAsyncThunk<
	// Return type of the payload creator
	Auth,
	// First argument to the payload creator
	AuthParams,
	{
		// Optional fields for defining thunkApi field types
		rejectValue: EnqueueSnackbar
		dispatch: AppDispatch
	}
>('auth/loginAsync', async (params, { rejectWithValue }) => {
	try {
		const data: Token = await api.login(params.credentials)
		const user = parseAuthToken(data)

		saveAuthToken(data)

		// Estado del asesor humano
		if (user.role === HUMAN_AGENT_ROLE) {
			saveAgentStatus(user.statusAdviser)
		}

		autoLogOut()
		return { user }
	} catch (err) {
		const error: AxiosError = err
		if (error.response?.status === 403) {
			params.setUserLocked(true)
			return rejectWithValue(setEnqueueSnackbar(lockedError, error, true))
		}
		if (error.response?.status === 401) {
			return rejectWithValue(setEnqueueSnackbar(authError, error, true))
		}
		return rejectWithValue(setEnqueueSnackbar(serverError, error))
	}
})

export const loginLDAP = createAsyncThunk<
	Auth,
	LDAPCredentials,
	{
		rejectValue: EnqueueSnackbar
	}
>('auth/loginLDAP', async (credentials, { rejectWithValue }) => {
	try {
		const data: Token = await api.loginLDAP(credentials)
		const user = parseAuthToken(data)

		saveAuthToken(data)

		// Estado del asesor humano
		if (user.role === HUMAN_AGENT_ROLE) {
			saveAgentStatus(user.statusAdviser)
		}

		autoLogOut()
		return { user }
	} catch (err) {
		const error: AxiosError = err

		if (error.response?.status === 401) {
			return rejectWithValue(setEnqueueSnackbar(authError, error, true))
		}
		return rejectWithValue(setEnqueueSnackbar(serverError, error))
	}
})

export const login = createAction<Auth>('auth/retrieveLogin')
export const logout = createAction(LOGOUT_ACTION_TYPE)

export const retrieveLogin =
	(data: Token): AppThunk =>
	async (dispatch) => {
		const user = parseAuthToken(data)
		const myAuth: Auth = {
			user,
		}
		autoLogOut()
		dispatch(login(myAuth))

		dispatch(initialServices(myAuth.user.role, myAuth.user.company))
	}

export const thunkLogout = (): AppThunk => (dispatch) => {
	cleanLocalStorage()
	dispatch(logout())
}

// Servicios transversales de la aplicación
export const initialServices =
	(role: number, company: number): AppThunk =>
	(dispatch) => {
		// Cargar canales (no disponible para asesor humano)
		if (role !== HUMAN_AGENT_ROLE) {
			dispatch(getChannels())
		}

		// Cargar companies
		if (role === SUPERADMIN_ROLE || role === SUPERVIEWER_ROLE) {
			dispatch(getCompanies())
		}

		// Cargar asesores virtuales
		if (
			role === ADMIN_ROLE ||
			role === VIEWER_ROLE ||
			role === SUPERVISOR_ROLE
		) {
			dispatch(getVirtualAgents(company))
		}

		// Cargar mensajes personalizados
		if (role === HUMAN_AGENT_ROLE) {
			dispatch(getFullConfigMensajes())
		}
	}

// Refrescar token
type setAccessToken = (value: string | null) => void
export const refreshTokenAction = createAsyncThunk<
	// Return type of the payload creator
	void,
	setAccessToken,
	{
		// Optional fields for defining thunkApi field types
		rejectValue: EnqueueSnackbar
		dispatch: AppDispatch
	}
>('auth/refreshToken', async (setAccessToken, { rejectWithValue }) => {
	try {
		await api
			.refreshToken()
			.then(saveAuthToken)
			.then(() => {
				setAccessToken(localStorage.getItem(ACCESS_TOKEN_NAME))
				// Reiniciar cierre automático
				autoLogOut()
			})
			.catch(() => {
				// console.log('ERROR, REDIRIGIR A LOGIN')
				cleanLocalStorage()
				window.location.href = window.location.origin
				return
			})
	} catch (err) {
		const error: AxiosError = err
		return rejectWithValue(setEnqueueSnackbar(serverError, error))
	}
})

export const checkChangePassword = createAsyncThunk<
	ChangePassValue,
	{ callback: () => Promise<void> } | undefined,
	{ rejectValue: EnqueueSnackbar }
>('auth/checkChangePassword', async (params, { rejectWithValue }) => {
	try {
		const data = await api.checkChangePasswordAPI()

		// Verificar respuesta en caso de setear bandera en localStorage
		if (params?.callback && !data.changePassword) {
			await params.callback()
		}

		return {
			changePassword: data.changePassword ? 'true' : 'false',
		}
	} catch (err) {
		detectUnauthorized(err, checkChangePassword(params))

		return rejectWithValue(
			setEnqueueSnackbar(checkPasswordChangeError, err)
		)
	}
})
