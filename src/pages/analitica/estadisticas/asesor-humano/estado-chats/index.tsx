import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { EstadoChatsContainer } from '@/containers/analytics/stats/HumanAgent/EstadoChatsContainer'

const Ratings = () => {
	return (
		<>
			<Head>
				<title>Estadísticas - Asesor humano - Estado de chats</title>
				<meta
					name="description"
					content="Estadística de asesor humano: Estado de chats"
				/>
			</Head>
			<EstadoChatsContainer />
		</>
	)
}

Ratings.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Ratings
