import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { EmailsContainer } from '@/containers/settings/Notifications'

const notificaciones = () => {
	return (
		<>
			<Head>
				<title>Configuración - Notificaciones - emails</title>
				<meta
					name="description"
					content="Configuración: Notificaciones - emails"
				/>
			</Head>
			<EmailsContainer />
		</>
	)
}

notificaciones.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default notificaciones
