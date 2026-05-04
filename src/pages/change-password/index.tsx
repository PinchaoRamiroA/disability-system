import { Login as LoginComponent } from '@/components/Login'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	authSelector,
	changePasswordSelector,
	checkChangePassword,
	initialServices,
} from '@/store/slices/authentication'
import { useRouter } from 'next/router'
import { ChangePasswordForm } from '@/components/ChangePasswordForm'
import { useLoading } from '@/hooks/useLoading'

const ChangePasswordStandaloneForm = () => {
	const dispatch = useAppDispatch()
	const { push } = useRouter()
	const { user } = useAppSelector(authSelector)
	const { startLoading, stopLoading } = useLoading()
	const changePassword = useAppSelector(changePasswordSelector)

	const successCallback = () => {
		startLoading()
		dispatch(
			checkChangePassword({
				callback: async () => {
					push('/').then(() => {
						dispatch(initialServices(user.role, user.company))
					})
				},
			})
		).then(stopLoading)
	}

	if (changePassword === 'idle') {
		return <></>
	}
	if (changePassword === 'false') {
		push('/')
		return <></>
	}

	return (
		<LoginComponent>
			<ChangePasswordForm
				showSubmitButton
				successCallback={successCallback}
			/>
		</LoginComponent>
	)
}

export default ChangePasswordStandaloneForm
