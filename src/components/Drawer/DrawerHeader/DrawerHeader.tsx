import { Header } from './styles'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

export const DrawerHeader = ({
  handleDrawerClose,
}: {
  handleDrawerClose: () => void
}) => {
  return (
    <Header>
      <IconButton onClick={handleDrawerClose}>
        <ChevronLeftIcon />
      </IconButton>
    </Header>
  )
}
