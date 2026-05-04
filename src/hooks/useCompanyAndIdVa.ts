import { filterIdOrgSelector, filterIdVaSelector } from '@/store/slices/Filter'
import { useAppSelector } from './useReduxHooks'

export const useCompanyAndIdVa = () => {
	const idOrg = useAppSelector(filterIdOrgSelector)
	const idVa = useAppSelector(filterIdVaSelector)

	return {
		idOrg,
		idVa,
	}
}
