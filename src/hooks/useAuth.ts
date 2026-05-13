import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from './useReduxHooks'
import { thunkLogin, thunkLogout } from '@/store/slices/authentication'
import { selectAuth } from '@/store/slices/authentication/selectors'

export const useAuth = () => {
	const dispatch = useAppDispatch()
	const authState = useAppSelector(selectAuth)

	const login = useCallback(
		(email: string, password: string) => {
			return dispatch(thunkLogin({ email, password })).unwrap()
		},
		[dispatch]
	)

	const logout = useCallback(() => {
		return dispatch(thunkLogout()).unwrap()
	}, [dispatch])

	const isAuthenticated = authState.authenticated
	const user = {
		email: authState.email || '',
		nombre: authState.nombre || '',
		role: authState.role || '',
		permisos: authState.permisos || [],
	}

	return {
		isAuthenticated,
		user,
		login,
		logout,
	}
}