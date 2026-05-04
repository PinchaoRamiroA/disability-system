import React from 'react'
import { PageTitle, Header } from './styles'
import { ChildrenType } from '@/types/Children'

export const PageLayout = ({
  children,
  title,
}: {
  children: ChildrenType
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
