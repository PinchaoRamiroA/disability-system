import { NavigationContainer } from '@/containers/NavigationContainer'

export function NavigationLayout({ children }: { children: React.ReactNode }) {
	return <NavigationContainer>{children}</NavigationContainer>
}