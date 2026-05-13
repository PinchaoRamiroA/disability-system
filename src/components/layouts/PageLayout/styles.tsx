import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

export const Header = styled('header')(({ theme }) => ({
  marginBlockEnd: theme.spacing(3),
}))

export const PageTitle = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    fontSize: '1.71429rem',
  },
  fontWeight: 500,
}))
