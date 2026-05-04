import { styled } from '@mui/system'

export const FormDialog = styled('form')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: '600px',
  },
  display: 'flex',
  flexDirection: 'column',
  paddingInline: theme.spacing(2),
  paddingBlockStart: theme.spacing(2),
  gap: theme.spacing(3),
}))

export const ButtonGroupDialog = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(2),
}))
