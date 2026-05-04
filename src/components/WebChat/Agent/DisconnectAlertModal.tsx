import React from 'react'
import { AlertDialog } from '@/components/Dialog'
import { ModalType } from '@/types/Modal'

export const DisconnectAlertModal = ({ open, handleClose }: ModalType) => {
  return (
    <AlertDialog
      open={open}
      onClose={handleClose}
      title="Desconectar asesor"
      description="Antes de desconectarte, asegúrate de finalizar todas las conversaciones."
    />
  )
}
