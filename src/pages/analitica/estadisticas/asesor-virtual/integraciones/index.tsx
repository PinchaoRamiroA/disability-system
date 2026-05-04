import { ReactElement } from 'react'
import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { IntegrationsContainer } from '@/containers/analytics/stats/VirtualAgent/IntegrationsContainer'

const Integrations = () => {
	return (
		<>
			<Head>
				<title>Estadísticas - Asesor virtual - Integraciones</title>
				<meta
					name="description"
					content="Estadísticas de asesor virtual: Log de integraciones"
				/>
			</Head>
			<IntegrationsContainer />
		</>
	)
}

Integrations.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Integrations
