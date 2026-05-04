import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { UsersContainer } from '@/containers/settings/AdministrarUsuarios/UsersContainer'

const UsersSettings = () => {
	return (
		<>
			<Head>
				<title>Configuración - Administrar usuarios - Usuarios</title>
				<meta
					name="description"
					content="Configuración: Usuarios de la plataforma"
				/>
			</Head>
			<UsersContainer />
		</>
	)
}

UsersSettings.getLayout = function getLayout(page: ReactElement) {
	return (
		<NavigationLayout>
			{/* <PageLayout title="Usuarios">{page}</PageLayout> */}
			{page}
		</NavigationLayout>
	)
}

export default UsersSettings
