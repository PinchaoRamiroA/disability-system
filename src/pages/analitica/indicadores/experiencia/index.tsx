import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { ExperienceContainer } from 'containers/analytics/indicators/ExperienceContainer'

const Experience = () => {
  return (
    <>
      <Head>
        <title>Indicadores - Experiencia</title>
        <meta name="description" content="Indicador: Niveles de experiencia" />
      </Head>
      <ExperienceContainer />
    </>
  )
}

Experience.getLayout = function getLayout(page: ReactElement) {
  return (
    <NavigationLayout>{page}</NavigationLayout>
    // <NavigationLayout>
    //   <PageLayout title="Indicadores de experiencia">{page}</PageLayout>
    // </NavigationLayout>
  )
}

export default Experience
