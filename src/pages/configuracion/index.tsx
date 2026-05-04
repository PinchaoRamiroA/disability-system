import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'

const Settings = () => {
	return (
		<Head>
			<title>Configuración</title>
			<meta name="description" content="Configuración" />
		</Head>
	)
}

Settings.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Settings
