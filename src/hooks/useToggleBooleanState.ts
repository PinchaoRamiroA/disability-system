import { useState } from 'react'

export const useToggleBooleanState = (initialValue: boolean) => {
  const [state, setState] = useState(initialValue)

  const toggleToTrue = () => {
    setState(true)
  }
  const toggleToFalse = () => {
    setState(false)
  }

  const tuple: [boolean, () => void, () => void] = [
    state,
    toggleToTrue,
    toggleToFalse,
  ]
  return tuple
}
