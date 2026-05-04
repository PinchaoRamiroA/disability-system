import React from 'react'
import MuiMenuItem from '@mui/material/MenuItem'
import { RowAction } from '@/types/Table'
import { GenericObject } from '@/types/GenericObject'

interface Props<T> extends RowAction<T> {
  onClose: () => void
  data: T
}

export const MenuItem = <T extends GenericObject>({
  data,
  action,
  label,
  onClose,
}: Props<T>) => {
  const handleClick = () => {
    action(data)
    onClose()
  }

  return <MuiMenuItem onClick={handleClick}>{label}</MuiMenuItem>
}
