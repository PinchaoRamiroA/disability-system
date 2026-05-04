import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { StatusReportContainer } from '@/containers/analytics/reports/asesor-humano/StatusContainer'

const Historial = () => {
	return (
		<>
			<Head>
				<title>
					Reportes - Asesor humano - Estado histórico de asesores
				</title>
				<meta
					name="description"
					content="Reporte - Asesor humano: Estado histórico de asesores"
				/>
			</Head>
			<StatusReportContainer />
		</>
	)
}

Historial.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Historial
