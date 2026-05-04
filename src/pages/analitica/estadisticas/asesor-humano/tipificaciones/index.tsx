import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { TipificacionContainer } from '@/containers/analytics/stats/HumanAgent/TipificacionContainer'

const Tipificaciones = () => {
	return (
		<>
			<Head>
				<title>
					Estadísticas - Asesor humano - Tipificación de paso a asesor
				</title>
				<meta
					name="description"
					content="Estadística de asesor humano: Tipificación de paso a asesor"
				/>
			</Head>
			<TipificacionContainer />
		</>
	)
}

Tipificaciones.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Tipificaciones
