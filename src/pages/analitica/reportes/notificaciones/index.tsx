import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { NotificationsReportContainer } from '@/containers/analytics/reports/notificaciones'

const NotificationsLog = () => {
	return (
		<>
			<Head>
				<title>Reportes - Notificaciones</title>
				<meta name="description" content="Reportes: Notificaciones" />
			</Head>
			<NotificationsReportContainer />
		</>
	)
}

NotificationsLog.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default NotificationsLog
