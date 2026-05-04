import * as React from 'react'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'

import { Provider } from 'react-redux'
import store from '@/store/index'

import { CacheProvider, EmotionCache } from '@emotion/react'
import createEmotionCache from '@/styles/theme/createEmotionCache'
import { ThemeLayout } from '@/layouts/ThemeLayout'

import type { ReactElement, ReactNode } from 'react'
import { AuthLayout } from '@/layouts/AuthLayout'
import 'react-datepicker/dist/react-datepicker.css'
import '@/styles/estilos.css'
import { LoaderLayout } from '@/layouts/LoaderLayout/LoaderLayout'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FilterLayout } from '@/layouts/FilterLayout'
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
	const { emotionCache = clientSideEmotionCache, ...rest } = props
	const { Component, pageProps }: AppPropsWithLayout = rest

	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout ?? ((page) => page)

	return (
		<DndProvider backend={HTML5Backend}>
			<Provider store={store}>
				<CacheProvider value={emotionCache}>
					<LoaderLayout>
						<ThemeLayout>
							<ErrorBoundary>
								<AuthLayout>
									<FilterLayout>
										{getLayout(
											<Component {...pageProps} />
										)}
									</FilterLayout>
								</AuthLayout>
							</ErrorBoundary>
						</ThemeLayout>
					</LoaderLayout>
				</CacheProvider>
			</Provider>
		</DndProvider>
	)
}

export default MyApp
