import { useEffect, useRef } from 'react'

/**
 * custom hook that tracks the previous value. Useful to compare changes in the state
 * @param value
 * @returns
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
