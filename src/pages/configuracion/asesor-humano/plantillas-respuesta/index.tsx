import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { PlantillasRespuestaContainer } from '@/containers/settings/HumanAgent/PlantillasRespuestaContainer'

const PlantillasRespuesta = () => {
	return (
		<>
			<Head>
				<title>
					Configuración de Asesor humano - Plantillas de respuesta
				</title>
				<meta
					name="description"
					content="Configuración de Asesor humano: Plantillas de respuesta"
				/>
			</Head>
			<PlantillasRespuestaContainer />
		</>
	)
}

PlantillasRespuesta.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default PlantillasRespuesta
