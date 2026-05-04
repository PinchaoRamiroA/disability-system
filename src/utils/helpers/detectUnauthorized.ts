import store from '@/store/index'
import {
	addCallbackAction,
	addDispatchAction,
} from '@/store/slices/authentication'
import { AxiosError } from 'axios'

type CallBack = () => void

/**
 * Detecta el error 401
 */
export const detectUnauthorized = (err: AxiosError, storeAction: unknown) => {
	if (err.response?.status === 401) {
		store.dispatch(addDispatchAction(storeAction))
		return true
	}
	return false
}

/**
 * Detecta error 403 por funcionalidad deshabilitada
 */
export const detectFeatureOff = (err: AxiosError) => {
	return err.response?.status === 403
}

export const detectUnauthorizedPromise = async (
	err: AxiosError,
	storeCallback: CallBack
) => {
	if (err.response?.status === 401) {
		store.dispatch(addCallbackAction(storeCallback))
	} else {
		throw err
	}
}
