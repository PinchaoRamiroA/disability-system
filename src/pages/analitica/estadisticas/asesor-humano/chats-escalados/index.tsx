import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { EscalatedChatsContainer } from '@/containers/analytics/stats/HumanAgent/EscalatedChatsContainer'

const ScaledChats = () => {
	return (
		<>
			<Head>
				<title>Estadísticas - Asesor humano - Chats escalados</title>
				<meta
					name="description"
					content="Estadística de asesor humano: número de chats escalados"
				/>
			</Head>
			<EscalatedChatsContainer />
		</>
	)
}

ScaledChats.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default ScaledChats
