import React, { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'

import {
	authSelector,
	changePasswordSelector,
	checkChangePassword,
	initialServices,
	retrieveLogin,
} from '@/store/slices/authentication'
import { HUMAN_AGENT_ROLE, SUPERVISOR_ROLE } from '@/utils/constants/roles'

import { getAuthToken } from '@/utils/helpers/accessToken'

import { useRouter } from 'next/router'
import Error from 'next/error'
import { disableLDAP } from '@/store/slices/authentication/ldapReducer'
import { extractQueryParams } from '@/utils/helpers/extractQueryParams'
import {
	selectDashboardStyle,
} from '@/store/slices/dashboard-config'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useImportGoogleFont } from '@/hooks/settings/useImportGoogleFont'
import { useUrlAccess } from '@/hooks/useUrlAccess'

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useAppDispatch()
	const { authenticated, user } = useAppSelector(authSelector)
	const router = useRouter()
	const { urlAccess } = useUrlAccess()
	const { idOrg } = useCompanyAndIdVa()
	const {
		resource: { fuente },
	} = useAppSelector(selectDashboardStyle)
	const { importFamily } = useImportGoogleFont()

	// Valor de la bandera de cambio de contraseña
	const changePassword = useAppSelector(changePasswordSelector)

	// Muestra pantalla 404 cuando se ingresa una url no válida
	const [notAllowed, setNotAllowed] = useState(false)
	const [routeValidated, setRouteValidated] = useState(false)

	const redirectToHome = useCallback(() => {
		if (user.role === HUMAN_AGENT_ROLE) {
			router.push('/chat')
		} else if (user.role === SUPERVISOR_ROLE) {
			router.push('/analitica/estadisticas/asesor-humano/chats')
		} else {
			router.push('/analitica')
		}
	}, [user.role, router])

	// Ejecutar servicio de validación de cambio de contraseña en cada renderizado pero si el usuario está autenticado
	useEffect(() => {
		if (authenticated) {
			dispatch(checkChangePassword())
		}
	}, [authenticated, dispatch])

	useEffect(() => {
		setNotAllowed(false)
		setRouteValidated(false)
		// console.log('changePassword', changePassword)

		if (authenticated) {
			if (changePassword === 'idle') {
				setRouteValidated(true)
				return
			} else if (changePassword === 'true') {
				if (router.asPath !== '/change-password') {
					router.push('/change-password')
				}
				setRouteValidated(true)
			} else {
				if (router.asPath === '/change-password') {
					setRouteValidated(true)
				} else if (router.asPath === '/login') {
					// Ruta principal de cada rol
					dispatch(initialServices(user.role, user.company))

					redirectToHome()
				} else if (router.asPath === '/') {
					redirectToHome()
				}
				// Validar rutas inválidas para el usuario
				else if (!urlAccess.includes(router.pathname)) {
					setNotAllowed(true)
				}
				setRouteValidated(true)
			}
		} else {
			const token = getAuthToken()

			if (token) {
				dispatch(retrieveLogin({ token }))
			}

			if (router.asPath === '/login') {
				setRouteValidated(true)
			} else if (!token) {
				const { loginbepro } = extractQueryParams()

				if (loginbepro === 'true') {
					dispatch(disableLDAP())
				}
				router.push('/login')
			}
		}
	}, [
		authenticated,
		dispatch,
		router,
		changePassword,
		urlAccess,
		user,
		redirectToHome,
	])

	if (notAllowed) {
		return <Error statusCode={404} />
	}

	if (!routeValidated) {
		return <></>
	}
	return <>{children}</>
}
