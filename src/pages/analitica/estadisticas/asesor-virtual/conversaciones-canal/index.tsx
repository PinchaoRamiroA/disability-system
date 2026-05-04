import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { ChatSessionsContainer } from '@/containers/analytics/stats/ChatSessionsContainer'

const ChatSesions = () => {
	return (
		<>
			<Head>
				<title>Estadísticas - Conversaciones por canal</title>
				<meta
					name="description"
					content="Estadística general: Conversaciones por canal"
				/>
			</Head>
			<ChatSessionsContainer />
		</>
	)
}

ChatSesions.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default ChatSesions
