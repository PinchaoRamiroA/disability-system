import { useMemo } from 'react'
import { useAppSelector } from './useReduxHooks'
import { authSelector } from '@/store/slices/authentication'
import { roleAccess, routeTreeList } from '@/utils/constants/grantAccess'

export const useUrlAccess = () => {
	const auth = useAppSelector(authSelector)
	const urlAccess = useMemo(
		() => roleAccess[auth.user.role],
		[auth.user.role]
	)

	return {
		urlAccess,
		routeTreeRole: routeTreeList[auth.user.role],
	}
}
