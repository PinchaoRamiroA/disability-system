import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { PersonalizacionContainer } from '@/containers/settings/PersonalizacionContainer'

const Widget = () => {
	return (
		<>
			<Head>
				<title>Configuración - Personalizar Dashboard</title>
				<meta
					name="description"
					content="Configuración: Personalizar Dashboard"
				/>
			</Head>
			<PersonalizacionContainer />
		</>
	)
}

Widget.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Widget
