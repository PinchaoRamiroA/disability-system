import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { CausalesNegocioContainer } from '@/containers/settings/CausalesNegocioContainer'

const Causales = () => {
	return (
		<>
			<Head>
				<title>Configuración - Causales de negocio</title>
				<meta
					name="description"
					content="Configuración: Causales de negocio"
				/>
			</Head>
			<CausalesNegocioContainer />
		</>
	)
}

Causales.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Causales
