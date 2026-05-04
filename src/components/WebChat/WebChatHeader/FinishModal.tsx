import React from 'react'

import { ConfirmationModal } from '@/components/Dialog'
import { ModalType } from '@/types/Modal'
import { useChatContext } from '@/hooks/asesor-humano/useChatContext'

export const FinishModal = ({ open, handleClose }: ModalType) => {
  const { finishConversation } = useChatContext()

  const finishConfirm = () => {
    finishConversation()
    handleClose()
  }

  return (
    <ConfirmationModal
      open={open}
      handleClose={handleClose}
      title="Finalizar chat"
      contentText="¿Estás seguro de finalizar el chat?"
      confirmAction={finishConfirm}
    />
  )
}
