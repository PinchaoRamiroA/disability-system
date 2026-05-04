import React from 'react'

//It's a closure!!!
export const debounce = (
  callback: (...args: string[]) => void,
  delay: number
) => {
  let timerId: ReturnType<typeof setTimeout>
  return (...args: string[]) => {
    clearTimeout(timerId)
    timerId = setTimeout(() => callback(...args), delay)
  }
}

export const debounceInputEvent = (
  instantCallback: (...args: string[]) => void,
  debouncedCallback: (...args: string[]) => void,
  delay: number
) => {
  let timerId: ReturnType<typeof setTimeout>
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    instantCallback(e.target.value)
    clearTimeout(timerId)
    timerId = setTimeout(() => debouncedCallback(e.target.value), delay)
  }
}
