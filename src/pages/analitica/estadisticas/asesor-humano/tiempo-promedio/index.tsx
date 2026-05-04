import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { AvgTimeContainer } from '@/containers/analytics/stats/HumanAgent/AvgTimeContainer'

const AverageTime = () => {
	return (
		<>
			<Head>
				<title>Estadísticas - Asesor humano - Tiempo promedio</title>
				<meta
					name="description"
					content="Estadística de asesor humano: tiempo promedio de duración de chats"
				/>
			</Head>
			<AvgTimeContainer />
		</>
	)
}

AverageTime.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default AverageTime
