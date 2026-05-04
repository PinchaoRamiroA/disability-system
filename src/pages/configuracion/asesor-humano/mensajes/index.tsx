import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { MensajesContainer } from '@/containers/settings/MensajesContainer'

const Mensajes = () => {
	return (
		<>
			<Head>
				<title>Configuración - Mensajes</title>
				<meta name="description" content="Configuración: Mensajes" />
			</Head>
			<MensajesContainer />
		</>
	)
}

Mensajes.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Mensajes
