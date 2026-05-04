import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { HumanAgentContainer } from '@/containers/settings/HumanAgentContainer/HumanAgentContainer'

const Agents = () => {
	return (
		<>
			<Head>
				<title>Configuración - Asesor humano - Asesores</title>
				<meta
					name="description"
					content="Configuración de asesor humano: Asesores"
				/>
			</Head>
			<HumanAgentContainer />
		</>
	)
}

Agents.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Agents
