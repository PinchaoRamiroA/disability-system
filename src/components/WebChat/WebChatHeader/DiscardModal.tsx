import React from 'react'

import { ConfirmationModal } from '@/components/Dialog'
import { ModalType } from '@/types/Modal'
import { useWebChatState } from '@/hooks/asesor-humano/useWebChatState'
import { useChatContext } from '@/hooks/asesor-humano/useChatContext'

export const DiscardModal = ({ open, handleClose }: ModalType) => {
  const { conversationId } = useChatContext()
  const { removeConversationFromState } = useWebChatState()

  const discardConfirm = () => {
    removeConversationFromState(conversationId)
    handleClose()
  }

  return (
    <ConfirmationModal
      open={open}
      handleClose={handleClose}
      title="Descartar chat"
      contentText="¿Estás seguro de descartar el chat?"
      confirmAction={discardConfirm}
    />
  )
}
