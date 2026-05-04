import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { ParametrosUsuariosContainer } from '@/containers/settings/AdministrarUsuarios/ParametrosUsuariosContainer'

const UsersParamsSettings = () => {
	return (
		<>
			<Head>
				<title>
					Configuración - Administrar usuarios - Parámetros de bloqueo
				</title>
				<meta
					name="description"
					content="Configuración: manejo de usuarios de la plataforma"
				/>
			</Head>
			<ParametrosUsuariosContainer />
		</>
	)
}

UsersParamsSettings.getLayout = function getLayout(page: ReactElement) {
	return (
		<NavigationLayout>
			{/* <PageLayout title="Usuarios">{page}</PageLayout> */}
			{page}
		</NavigationLayout>
	)
}

export default UsersParamsSettings
