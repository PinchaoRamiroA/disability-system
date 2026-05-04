import { useState } from 'react'
import { useAppSelector } from '../useReduxHooks'
import { chatsSelector } from '@/store/slices/humanAgent'

export const useCheckActiveConnection = () => {
	const chats = useAppSelector(chatsSelector)

	// Modal que informa sobre la desconexión del asesor
	const [openDisconnectionModal, setOpenDisconnecionModal] = useState(false)
	const [logout, setLogout] = useState(false)

	/**
	 * Valida si hay conversaciones activas y abre el modal informativo
	 * @returns boolean
	 */
	const checkForActiveConversations = (callback?: () => void) => {
		const result = Boolean(
			chats.filter((ch) => ch.status !== 'FINALIZADO').length
		)
		console.log('result', result)

		if (result) {
			setOpenDisconnecionModal(true)
		} else {
			callback?.()
		}
	}

	const closeDisconnectionModal = () => setOpenDisconnecionModal(false)

	/**
	 * Cierre de sesión:
	 * Valida que no hayan conversaciones activas y luego cierra la sesión
	 */
	const handleCloseSessionClick = (callback?: () => void) => {
		setLogout(true)
		checkForActiveConversations(callback)
	}

	return {
		openDisconnectionModal,
		closeDisconnectionModal,
		handleCloseSessionClick,
		checkForActiveConversations,
		logout,
	}
}
