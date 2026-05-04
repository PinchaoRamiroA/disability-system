import { Button } from '@mui/material'
import { styled } from '@mui/system'

export const ApplyButton = styled(Button)(({ theme }) => ({
  width: '200px',
  margin: theme.spacing(2, 'auto'),
}))

export const DrawerForm = styled('form')(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: 'calc(100vh - 64px - 65px)',
  overflow: 'auto',
}))
