import { ReactElement } from 'react'
import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { DirectorioContainer } from '@/containers/settings/HumanAgent/DirectorioContainer'

const DirectorioContactos = () => {
	return (
		<>
			<Head>
				<title>
					Configuración de Asesor humano - Directorio de contactos
				</title>
				<meta
					name="description"
					content="Configuración de Asesor humano: Directorio de contactos"
				/>
			</Head>
			<DirectorioContainer />
		</>
	)
}

DirectorioContactos.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default DirectorioContactos
