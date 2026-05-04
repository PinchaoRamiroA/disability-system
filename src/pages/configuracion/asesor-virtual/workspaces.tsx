import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { WorkspacesContainer } from '@/containers/settings/AsistenteVirtual/WorkspacesContainer'

const Workspaces = () => {
	return (
		<>
			<Head>
				<title>Configuraciones - Asesor virtual - Workspaces</title>
				<meta
					name="description"
					content="Configuración de Workspaces"
				/>
			</Head>
			<WorkspacesContainer />
		</>
	)
}

Workspaces.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Workspaces
