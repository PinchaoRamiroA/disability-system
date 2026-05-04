import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { ChatsContainer } from '@/containers/analytics/stats/HumanAgent/Chats'

const Chats = () => {
	return (
		<>
			<Head>
				<title>Estadísticas - Asesor humano - Chats</title>
				<meta
					name="description"
					content="Estadísticas - Asesor humano - Chats"
				/>
			</Head>
			<ChatsContainer />
		</>
	)
}

Chats.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Chats
