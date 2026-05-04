import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { EventosContainer } from '@/containers/settings/Notifications'

const notificaciones = () => {
	return (
		<>
			<Head>
				<title>Configuración - Notificaciones - eventos</title>
				<meta
					name="description"
					content="Configuración: Notificaciones - eventos"
				/>
			</Head>
			<EventosContainer />
		</>
	)
}

notificaciones.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default notificaciones
