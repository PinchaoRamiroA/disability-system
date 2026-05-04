import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { RegionalsContainer } from '@/containers/settings/RegionalsContainer'

const Regionales = () => {
	return (
		<>
			<Head>
				<title>Configuración - Regionales</title>
				<meta name="description" content="Configuración: Regionales" />
			</Head>
			<RegionalsContainer />
		</>
	)
}

Regionales.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Regionales
