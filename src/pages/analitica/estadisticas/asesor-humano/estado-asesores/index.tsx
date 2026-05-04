import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { StatusContainer } from '@/containers/analytics/stats/HumanAgent/StatusContainer'

const AverageTime = () => {
	return (
		<>
			<Head>
				<title>
					Estadísticas - Asesor humano - Estado actual asesores
				</title>
				<meta
					name="description"
					content="Estadísticas de asesor humano: Estado actual asesores"
				/>
			</Head>
			<StatusContainer />
		</>
	)
}

AverageTime.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default AverageTime
