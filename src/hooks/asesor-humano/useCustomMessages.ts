import { getFullConfigMensajes } from '@/store/slices/mensajes'
import { useAppDispatch } from '../useReduxHooks'

export const useCustomMessages = () => {
	const dispatch = useAppDispatch()

	// Ejecuta el servicio que obtiene los mensajes configurados
	const getCustomMessagesPivot = (callback: () => void) => {
		dispatch(getFullConfigMensajes(callback))
	}

	return {
		getCustomMessages: getCustomMessagesPivot,
	}
}
