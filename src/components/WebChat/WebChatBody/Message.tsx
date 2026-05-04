import React from 'react'
import { Box, SxProps } from '@mui/material'

interface Props {
  children: React.ReactElement
  client: boolean
}

export const Message = ({ client, children }: Props) => {
  const styles: SxProps = {
    maxWidth: 400,
    backgroundColor: client ? '#FFF' : '#639AD9',
    border: 1,
    borderColor: '#E5E5E5',
    borderRadius: client ? '0 16px 16px' : '16px 0 16px 16px',
    marginBottom: 2,
    padding: '0.5em 1em',
  }

  return (
    <Box sx={styles} alignSelf={client ? 'flex-start' : 'flex-end'}>
      {children}
    </Box>
  )
}
