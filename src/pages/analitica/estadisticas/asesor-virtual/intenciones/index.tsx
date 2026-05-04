import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { IntentsContainer } from '@/containers/analytics/stats/VirtualAgent/IntentsContainer'

const Intents = () => {
	return (
		<>
			<Head>
				<title>Estadísticas - Asesor virtual - Intenciones</title>
				<meta
					name="description"
					content="Estadística de asesor virtual: Intenciones de los mensajes del usuario"
				/>
			</Head>
			<IntentsContainer />
		</>
	)
}

Intents.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Intents
