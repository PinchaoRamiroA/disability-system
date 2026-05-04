import { useAppSelector } from '@/hooks/useReduxHooks'
import { ReviewItem } from '../ReviewItem'
import { virtualAgentsSelector } from '@/store/slices/virtualAgent'

export const VirtualAgentReview = () => {
	const { resource } = useAppSelector(virtualAgentsSelector)

	return resource.length > 1 ? (
		<ReviewItem data="Asesor virtual" filterName="virtualAgent" />
	) : null
}
