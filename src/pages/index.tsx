import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Home = () => {
	const router = useRouter()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		router.push('/login')
	}, [])

	return null
}

export default Home