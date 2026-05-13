import React from 'react'
import { PageTitle, Header } from './styles'


export const PageLayout = ({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) => {
  return (
    <>
      <Header>
        <PageTitle variant="h1" fontWeight={500}>
          {title}
        </PageTitle>
      </Header>
      {children}
    </>
  )
}
