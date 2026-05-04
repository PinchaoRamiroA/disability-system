import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { HistoryContainer } from '@/containers/analytics/reports/asesor-virtual/HistoryContainer'

const History = () => {
	return (
		<>
			<Head>
				<title>
					Reportes - Asesor virtual - Historial y Trazabilidad
				</title>
				<meta
					name="description"
					content="Reportes - Asesor virtual: Historial y Trazabilidad"
				/>
			</Head>
			<HistoryContainer />
		</>
	)
}

History.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default History
