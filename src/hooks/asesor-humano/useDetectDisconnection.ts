import { useEffect, useState } from 'react'
import { useNavigatorOnline } from '../useNavigatorOnline'

type DisconnectionType = 'INTERNET' | null

export const useDetectDisconnection = () => {
	const { isOnline } = useNavigatorOnline()

	const [disconnected, setDisconnected] = useState(false)
	const [disconnectionType, setDisconnectionType] =
		useState<DisconnectionType>(null)
	const [recovering, setRecovering] = useState(false)

	// Resetear estado de desconexión
	// useEffect(() => {
	//   console.log('disconnectionType', disconnectionType, disconnected)
	// }, [disconnected, disconnectionType])

	// Detecta cambios en la conexión de internet
	useEffect(() => {
		if (isOnline) {
			// Resetear estado si la desconexión fue de internet
			if (disconnectionType === 'INTERNET') {
				setRecovering(true)
				setDisconnected(false)
				setDisconnectionType(null)
				// console.log('DESCONECTADO POR INTERNET')
			}
		} else {
			// Solo cambiar estado si no se encuentra desconectado (es posible que ya exista una desconexión por SERVER)
			if (disconnected === false) {
				setDisconnected(true)
				setDisconnectionType('INTERNET')
			}
		}
	}, [isOnline])

	// useEffect(() => {
	//   console.log('RECO', recovering)
	// }, [recovering])

	// Resetear states de conexión
	const resetDisconnectionState = () => {
		setDisconnected(false)
		setDisconnectionType(null)
	}

	// La desconexión es del server, disconnectionType es null
	const onServerDisconnection = () => {
		setDisconnected(true)
	}

	return {
		connectionLost: disconnected,
		disconnectionType,
		recovering,
		setRecovering,
		resetDisconnectionState,
		onServerDisconnection,
	}
}
