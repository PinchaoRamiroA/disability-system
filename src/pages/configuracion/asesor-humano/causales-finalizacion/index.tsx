import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { CausalesFinContainer } from '@/containers/settings/CausalesFinContainer'

const Causales = () => {
	return (
		<>
			<Head>
				<title>Configuración - Causales de finalización</title>
				<meta
					name="description"
					content="Configuración: Causales de finalización"
				/>
			</Head>
			<CausalesFinContainer />
		</>
	)
}

Causales.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Causales
