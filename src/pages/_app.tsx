import * as React from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

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

const MyApp: React.FunctionComponent<AppProps> = (props) => {
	const { Component, pageProps } = props
	const router = useRouter()

	const theme = React.useMemo(() => createTheme(themeOptions()), [])

	const isLoginPage = router.asPath === '/login'

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