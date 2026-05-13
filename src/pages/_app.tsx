import * as React from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { Provider } from 'react-redux'
import store from '@/store/index'

import { AppCacheProvider } from '@mui/material-nextjs/v16-pagesRouter'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import '@/styles/estilos.css'
import { SnackbarProvider } from 'notistack'
import { NavigationLayout } from '@/components/layouts/NavigationLayout'
import { createTheme } from '@mui/material/styles'
import { themeOptions } from '@/config/themeOptions'
import { retrieveLogin } from '@/store/slices/authentication'
import { Box, CircularProgress } from '@mui/material'

const MyApp: React.FunctionComponent<AppProps> = (props) => {
	const { Component, pageProps } = props
	const router = useRouter()

	const theme = React.useMemo(() => createTheme(themeOptions()), [])

	const isLoginPage = router.asPath === '/login'
	const [initializing, setInitializing] = React.useState(true)

	useEffect(() => {
		const initAuth = async () => {
			try {
				await store.dispatch(retrieveLogin({})).unwrap()
			} catch {
				// User not authenticated
			} finally {
				setInitializing(false)
			}
		}
		initAuth()
	}, [])

	if (initializing) {
		return (
			<Provider store={store}>
				<AppCacheProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
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
					</ThemeProvider>
				</AppCacheProvider>
			</Provider>
		)
	}

	return (
		<Provider store={store}>
			<AppCacheProvider>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<SnackbarProvider>
						{isLoginPage ? (
							<Component {...pageProps} />
						) : (
							<NavigationLayout>
								<Component {...pageProps} />
							</NavigationLayout>
						)}
					</SnackbarProvider>
				</ThemeProvider>
			</AppCacheProvider>
		</Provider>
	)
}

export default MyApp