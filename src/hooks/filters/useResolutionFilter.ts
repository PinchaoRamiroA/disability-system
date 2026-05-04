import { filterResolutionSelector } from '@/store/slices/Filter'
import { updateTempFields } from '@/store/slices/Filter/temp_slice'
import { Resolution } from '@/types/Filter/Filter'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'

type ResolutionFilter = Resolution & { label: string }

const initialState: ResolutionFilter[] = [
  {
    value: 'automated',
    checked: false,
    label: 'En primer nivel',
  },
  {
    value: 'escalated',
    checked: false,
    label: 'Escalados a asesor humano',
  },
]

export const useResolutionFilter = () => {
  const dispatch = useAppDispatch()
  const resolutionList = useAppSelector(filterResolutionSelector)

  const [resolutions, setResolutions] =
    useState<ResolutionFilter[]>(initialState)

  useEffect(() => {
    if (resolutionList) {
      setResolutions((prevState) =>
        prevState.map((res) => {
          if (resolutionList.includes(res.value))
            return { ...res, checked: true }
          else return { ...res, checked: false }
        })
      )
    } else {
      setResolutions(initialState)
    }
  }, [resolutionList])

  useEffect(() => {
    filterResolutions()
  }, [resolutions])

  // Actualiza state con valores del checkbox
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResolutions((prevState) =>
      prevState.map((res) => {
        if (res.value === (event.target as HTMLInputElement).value)
          return { ...res, checked: (event.target as HTMLInputElement).checked }
        else return res
      })
    )
  }

  // Actualiza resolution[] en filter state
  const filterResolutions = () => {
    dispatch(
      updateTempFields({
        resolution: resolutions
          .filter((res) => res.checked)
          .map((res) => res.value),
      })
    )
  }

  return {
    resolutions,
    handleChange,
  }
}
