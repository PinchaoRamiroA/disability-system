import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { ChatsByAgentContainer } from '@/containers/analytics/stats/HumanAgent/ChatsByAgentContainer'

const AgentChats = () => {
	return (
		<>
			<Head>
				<title>Estadísticas - Asesor humano - Chats por asesor</title>
				<meta
					name="description"
					content="Estadística de asesor humano: número de chats por asesor"
				/>
			</Head>
			<ChatsByAgentContainer />
		</>
	)
}

AgentChats.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default AgentChats
