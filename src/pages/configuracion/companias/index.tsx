import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { CompaniesContainer } from 'containers/settings/CompaniesContainer'
import { PageLayout } from '@/layouts/PageLayout'

const CompaniesSettings = () => {
  return (
    <>
      <Head>
        <title>Configuración - Compañías</title>
        <meta
          name="description"
          content="Configuración: manejo compañías de la plataforma"
        />
      </Head>
      <CompaniesContainer />
    </>
  )
}

CompaniesSettings.getLayout = function getLayout(page: ReactElement) {
  return (
    <NavigationLayout>
      <PageLayout title="Compañías">{page}</PageLayout>
    </NavigationLayout>
  )
}

export default CompaniesSettings
