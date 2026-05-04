import { useAppSelector } from '@/hooks/useReduxHooks'
import { ReviewItem } from '../ReviewItem'
import { companiesSelector } from '@/store/slices/companies'

export const CompanyReview = () => {
	const { resource } = useAppSelector(companiesSelector)

	return resource.length > 1 ? (
		<ReviewItem data="Compañías" filterName="companies" />
	) : null
}
