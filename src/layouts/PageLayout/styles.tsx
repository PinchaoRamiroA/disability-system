import { styled } from '@mui/system'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

export const Header = styled('header')<{ theme?: Theme }>(({ theme }) => ({
  marginBlockEnd: theme.spacing(3),
}))

export const PageTitle = styled(Typography)<{ theme?: Theme }>(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    fontSize: '1.71429rem',
  },
  fontWeight: 500,
}))
