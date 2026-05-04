// beforeUnloadManager.ts
let beforeUnloadHandler: ((event: BeforeUnloadEvent) => void) | null = null

export const setBeforeUnloadHandler = (
	handler: (event: BeforeUnloadEvent) => void
) => {
	beforeUnloadHandler = handler
	window.addEventListener('beforeunload', beforeUnloadHandler)
}

export const removeBeforeUnloadHandler = () => {
	if (beforeUnloadHandler) {
		window.removeEventListener('beforeunload', beforeUnloadHandler)
		beforeUnloadHandler = null
	}
}
