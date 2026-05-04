import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { ReporteTipificacionContainer } from '@/containers/analytics/reports/asesor-humano/ReporteTipificacionContainer'

const ReporteTipificacion = () => {
	return (
		<>
			<Head>
				<title>
					Reportes - Asesor humano - Tipificación de paso a asesor
				</title>
				<meta
					name="description"
					content="Reporte - Asesor humano: Tipificación de paso a asesor"
				/>
			</Head>
			<ReporteTipificacionContainer />
		</>
	)
}

ReporteTipificacion.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default ReporteTipificacion
