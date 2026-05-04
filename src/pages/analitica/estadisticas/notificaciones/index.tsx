import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { NotificationsContainer } from '@/containers/analytics/stats/Notifications'

const Notifications = () => {
	return (
		<>
			<Head>
				<title>Estadísticas - Notificaciones y Eventos</title>
				<meta
					name="description"
					content="Estadística general: notificaciones"
				/>
			</Head>
			<NotificationsContainer />
		</>
	)
}

Notifications.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Notifications
