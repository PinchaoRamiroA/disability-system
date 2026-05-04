import { useEffect, useState } from 'react'

export const useHistoryRouteConversation = (params?: string | string[]) => {
	const [idConv, setIdConv] = useState<string | undefined>()
	const [idInteraction, setIdInteraction] = useState<string | undefined>()

	const resetParams = () => {
		setIdConv(undefined)
		setIdInteraction(undefined)
	}

	useEffect(() => {
		if (params) {
			if (params.length === 1) {
				setIdConv(params[0])
				return
			} else if (params.length === 2) {
				setIdConv(params[0])
				setIdInteraction(params[1])
				return
			}
		}
	}, [params])

	return {
		idConv,
		idInteraction,
		resetParams,
	}
}
