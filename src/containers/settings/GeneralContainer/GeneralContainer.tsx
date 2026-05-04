import { FilterContainer } from '@/containers/FilterContainer'
import React from 'react'

export const GeneralContainer = () => {
  return (
    <FilterContainer
      filters={{
        dates: true,
        channels: true,
        attention: true,
        resolution: true,
        user: true,
        entries: true,
        locations: true,
        intents: true,
        companies: true,
        virtualAgent: true,
        splits: true,
        events: true,
      }}
    />
  )
}
