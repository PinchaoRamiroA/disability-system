import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { GeneralHumanAgentContainer } from '@/containers/settings/GeneralHumanAgentContainer'

const General = () => {
	return (
		<>
			<Head>
				<title>Configuración - Asesor humano - General</title>
				<meta
					name="description"
					content="configuración de asesor humano: General"
				/>
			</Head>
			<GeneralHumanAgentContainer />
		</>
	)
}

General.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default General
