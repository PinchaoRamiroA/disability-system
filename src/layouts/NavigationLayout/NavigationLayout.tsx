import useNotifier from '@/hooks/useNotifier'
import { ChildrenType } from '@/types/Children'
import { NavigationContainer } from 'containers/NavigationContainer'

export function NavigationLayout({ children }: { children: ChildrenType }) {
  useNotifier()

  console.log('Navigation Layout: nuevo render')
  return <NavigationContainer>{children}</NavigationContainer>
}
