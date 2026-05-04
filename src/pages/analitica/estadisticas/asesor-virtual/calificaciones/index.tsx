import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { RatingsContainer } from '@/containers/analytics/stats/VirtualAgent/RatingsContainer'

const Ratings = () => {
	return (
		<>
			<Head>
				<title>Estadísticas - Asesor virtual - Calificaciones</title>
				<meta
					name="description"
					content="Estadística de asesor virtual: Calificación de respuestas del bot"
				/>
			</Head>
			<RatingsContainer />
		</>
	)
}

Ratings.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Ratings
