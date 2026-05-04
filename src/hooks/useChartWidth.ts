import { useEffect, useState } from 'react'
import { drawerSelector } from '@/store/slices/drawer'

import { useAppSelector } from './useReduxHooks'
import { useWindowSize } from './useWindowSize'

interface Props {
  defaultScreenSize?: number
}

export const useChartWidth = ({ defaultScreenSize = 900 }: Props) => {
  // Hook que devuelve tamaño de la pantalla cuando se redimensiona
  const size = useWindowSize()

  // Ancho de la gráfica (varía cuando se redimensiona la pantalla)
  const [width, setWidth] = useState(defaultScreenSize)

  // Selector que indica si el drawer (sidebar) está abierto y también retorna el ancho del mismo
  const { open: drawerOpen, drawerWidth } = useAppSelector(drawerSelector)

  // Ajustar ancho de la gráfica cuando se redimensiona la pantalla o cuando el sidebar está activo
  useEffect(() => {
    let newWidth = defaultScreenSize

    if (drawerOpen) {
      newWidth -= drawerWidth ?? 0
    }

    if (size.width) {
      if (size.width > defaultScreenSize) {
        newWidth += size.width - defaultScreenSize
      }
    }
    setWidth(newWidth)
  }, [size, drawerOpen])

  return {
    width: width - 100,
  }
}
