import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { SplitsContainer } from '@/containers/settings/SplitsContainer/SplitsContainer'

const Splits = () => {
	return (
		<>
			<Head>
				<title>Configuración - Asesor humano - Splits</title>
				<meta
					name="description"
					content="configuración de asesor humano: Splits"
				/>
			</Head>
			<SplitsContainer />
		</>
	)
}

Splits.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Splits
