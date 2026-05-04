import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { AgentChatsContainer } from '@/containers/analytics/reports/asesor-humano/AgentChatsContainer'

const AgentChats = () => {
	return (
		<>
			<Head>
				<title>Reportes - Asesor humano - Chats</title>
				<meta
					name="description"
					content="Reportes - Asesor humano: Chats"
				/>
			</Head>
			<AgentChatsContainer />
		</>
	)
}

AgentChats.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default AgentChats
