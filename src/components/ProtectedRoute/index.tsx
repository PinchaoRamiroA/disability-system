import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { selectAuth } from '@/store/slices/authentication/selectors'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

interface ProtectedRouteProps {
	children: React.ReactNode
	requiredPermissions?: string[]
}

export const ProtectedRoute = ({
	children,
	requiredPermissions = [],
}: ProtectedRouteProps) => {
	const router = useRouter()
	const { authenticated, permisos } = useAppSelector(selectAuth)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!authenticated) {
			router.push('/login')
		} else if (requiredPermissions.length > 0) {
			const hasAllPermissions = requiredPermissions.every((p) =>
				permisos.includes(p)
			)
			if (!hasAllPermissions) {
				router.push('/dashboard')
			} else {
				setLoading(false)
			}
		} else {
			setLoading(false)
		}
	}, [authenticated, router, permisos, requiredPermissions])

	if (loading) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '100vh',
				}}
			>
				<CircularProgress />
			</Box>
		)
	}

	if (!authenticated) {
		return null
	}

	return <>{children}</>
}