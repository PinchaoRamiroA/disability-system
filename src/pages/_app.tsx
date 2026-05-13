import * as React from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { Provider } from 'react-redux'
import store from '@/store/index'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import '@/styles/estilos.css'
import { SnackbarProvider } from 'notistack'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { createTheme } from '@mui/material/styles'
import { themeOptions } from '@/config/themeOptions'

const MyApp: React.FunctionComponent<AppProps> = (props) => {
	const { Component, pageProps } = props
	const router = useRouter()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const theme = createTheme(themeOptions())

	if (!mounted) {
		return (
			<Provider store={store}>
				<AppRouterCacheProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<SnackbarProvider>
							<Component {...pageProps} />
						</SnackbarProvider>
					</ThemeProvider>
				</AppRouterCacheProvider>
			</Provider>
		)
	}

	const isLoginPage = router.asPath === '/login'

	return (
		<Provider store={store}>
			<AppRouterCacheProvider>
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
			</AppRouterCacheProvider>
		</Provider>
	)
}

export default MyApp