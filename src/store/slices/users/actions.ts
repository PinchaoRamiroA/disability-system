import { EnqueueSnackbar } from '@/types/notistack'
import {
	NormalizedUser,
	ToggleActiveParams,
	User,
	UserFilters,
} from '@/types/users'
import {
	addSnackbarKey,
	setEnqueueSnackbar,
} from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk, nanoid } from '@reduxjs/toolkit'
import {
	getUsers as getUsersApi,
	createUser as createUserApi,
	putUser as putUserApi,
	deleteUser as deleteUserApi,
	toggleActiveUserApi,
	updateUserPasswordApi,
	toggleUnlockUserApi,
} from '@/services/api/users'
import * as snackbars from '@/utils/constants/snackbars/user'
import { enqueueSnackbar } from '../notistack'

import { HUMAN_AGENT_ROLE, roles } from '@/utils/constants/roles'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'

interface GetUsersParams {
	filterAgents?: boolean
	filters?: UserFilters
}

export const getUsers = createAsyncThunk<
	NormalizedUser[],
	GetUsersParams | undefined,
	{
		rejectValue: EnqueueSnackbar
	}
>('users/getUsers', async (params, { rejectWithValue }) => {
	try {
		let data: User[] = await getUsersApi(params?.filters)

		// Filtrar usuarios de tipo Asesor humano
		if (params?.filterAgents) {
			data = data.filter((user) => user.role === HUMAN_AGENT_ROLE)
		}

		return data.map((item) => ({
			...item,
			id: nanoid(),
			roleLabel: roles[item.role - 1].label,
		}))
	} catch (err) {
		detectUnauthorized(err, getUsers(params))
		return rejectWithValue(setEnqueueSnackbar(snackbars.getUsersError, err))
	}
})

export const createUser = createAsyncThunk<
	NormalizedUser,
	{ user: Partial<User>; role: number; callback: () => void },
	{
		rejectValue: EnqueueSnackbar
	}
>(
	'users/createUser',
	async (toUpdatePayload, { rejectWithValue, dispatch }) => {
		try {
			const data: User = await createUserApi({
				role: toUpdatePayload.role,
				user: toUpdatePayload.user,
			})
			toUpdatePayload.callback()

			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.createUserSuccess))
			)
			return {
				...data,
				id: nanoid(),
				roleLabel: roles[data.role - 1].label,
			}
		} catch (err) {
			detectUnauthorized(err, createUser(toUpdatePayload))

			if (err.response?.status === 422) {
				return rejectWithValue(
					setEnqueueSnackbar(snackbars.createDuplicatedUserError, err)
				)
			}

			return rejectWithValue(
				setEnqueueSnackbar(snackbars.createUserError, err)
			)
		}
	}
)

export const putUsers = createAsyncThunk<
	User,
	{ user: Partial<User>; callback: () => void },
	{ rejectValue: EnqueueSnackbar }
>('users/putUser', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data: User = await putUserApi(params.user)
		params.callback()
		dispatch(enqueueSnackbar(addSnackbarKey(snackbars.putUserSuccess)))
		return { ...data, roleLabel: roles[data.role - 1].label }
	} catch (err) {
		detectUnauthorized(err, putUsers(params))

		if (err.response?.status === 422) {
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.createDuplicatedUserError, err)
			)
		}

		return rejectWithValue(setEnqueueSnackbar(snackbars.putUserError, err))
	}
})

export const toggleActiveUser = createAsyncThunk<
	User,
	ToggleActiveParams,
	{ rejectValue: EnqueueSnackbar }
>('users/toggleActiveUser', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data: User = await toggleActiveUserApi(params)
		dispatch(enqueueSnackbar(addSnackbarKey(snackbars.putUserSuccess)))
		return { ...data, roleLabel: roles[data.role - 1].label }
	} catch (err) {
		detectUnauthorized(err, toggleActiveUser(params))
		return rejectWithValue(setEnqueueSnackbar(snackbars.putUserError, err))
	}
})

export const toggleUnlockUser = createAsyncThunk<
	User,
	ToggleActiveParams,
	{ rejectValue: EnqueueSnackbar }
>('users/toggleActiveUser', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data: User = await toggleUnlockUserApi(params)
		dispatch(enqueueSnackbar(addSnackbarKey(snackbars.putUserSuccess)))
		return { ...data, roleLabel: roles[data.role - 1].label }
	} catch (err) {
		detectUnauthorized(err, toggleActiveUser(params))
		return rejectWithValue(setEnqueueSnackbar(snackbars.putUserError, err))
	}
})

export const deleteUser = createAsyncThunk<
	number,
	{ id: number; role: number },
	{
		rejectValue: EnqueueSnackbar
	}
>('users/deleteUser', async (toDeleteUser, { rejectWithValue, dispatch }) => {
	try {
		const data: boolean = await deleteUserApi(toDeleteUser)
		if (data) {
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.deleteUserSuccess))
			)
			return toDeleteUser.id
		} else {
			throw new Error('')
		}
	} catch (err) {
		detectUnauthorized(err, deleteUser(toDeleteUser))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.deleteUserError, err)
		)
	}
})

export const updateUserPassword = createAsyncThunk<
	void,
	{ newPassword: string; oldPassword: string; callback?: () => void },
	{ rejectValue: EnqueueSnackbar }
>('users/updateUserPassword', async (params, { dispatch, rejectWithValue }) => {
	try {
		const { newPassword, oldPassword, callback } = params
		// Manejo de la respuesta de la actualización de contraseña
		const response = await updateUserPasswordApi(newPassword, oldPassword)
		if (response === 'La contraseña se actualizó correctamente.') {
			// Si la respuesta es verdadera, la actualización fue exitosa
			dispatch(
				enqueueSnackbar(
					addSnackbarKey(snackbars.updateUserPasswordSuccess)
				)
			)

			if (callback) {
				callback()
			}
		} else if (response === 'No se pudo actualizar la contraseña.') {
			dispatch(
				enqueueSnackbar(
					addSnackbarKey(snackbars.updateUserPasswordError)
				)
			)
		} else {
			throw new Error()
		}
	} catch (err) {
		detectUnauthorized(err, updateUserPassword(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateUserPasswordError, err)
		)
	}
})
