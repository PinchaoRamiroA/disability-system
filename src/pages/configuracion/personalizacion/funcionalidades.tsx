import { ReactElement } from 'react'
import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { FeaturesContainer } from '@/containers/settings/FeaturesContainer/FeaturesContainer'

const Features = () => {
	return (
		<>
			<Head>
				<title>Configuración - Funcionalidades Dashboard</title>
				<meta
					name="description"
					content="Configuración: Funcionalidades Dashboard"
				/>
			</Head>
			<FeaturesContainer />
		</>
	)
}

Features.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Features
