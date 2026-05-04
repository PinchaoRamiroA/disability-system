import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { ExpiracionSesionContainer } from '@/containers/settings/AsistenteVirtual/ExpiracionSesionContainer'

const ExpiracionSesion = () => {
	return (
		<>
			<Head>
				<title>
					Configuración - Asesor virtual - Expiración de sesión
				</title>
				<meta
					name="description"
					content="Configuración - Asesor virtual - Expiración de sesión"
				/>
			</Head>
			<ExpiracionSesionContainer />
		</>
	)
}

ExpiracionSesion.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default ExpiracionSesion
