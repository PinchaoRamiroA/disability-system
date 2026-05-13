import React from 'react'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { authSelector } from '@/store/slices/authentication'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	const { authenticated } = useAppSelector(authSelector)
	const router = useRouter()

	useEffect(() => {
		const isLoginPage = router.asPath === '/login'

		if (!authenticated && !isLoginPage) {
			router.push('/login')
		} else if (authenticated && isLoginPage) {
			router.push('/dashboard')
		}
	}, [authenticated, router])

	// En página de login, no aplicar protección
	if (router.asPath === '/login') {
		return <>{children}</>
	}

	// Si no está autenticado, no renderizar nada (el redirect ocurrirá)
	if (!authenticated) {
		return null
	}

	return <>{children}</>
}