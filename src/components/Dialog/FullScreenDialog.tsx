import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} />
})

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  label: string
  title: string
  children: React.ReactNode
}

export function FullScreenDialog({
  title,
  label,
  open,
  setOpen,
  children,
}: Props) {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {title}
            </Typography>
            <Button
              autoFocus
              color="secondary"
              variant="contained"
              onClick={handleClose}
            >
              {label}
            </Button>
          </Toolbar>
        </AppBar>
        {children}
      </Dialog>
    </div>
  )
}
