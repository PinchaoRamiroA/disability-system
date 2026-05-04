import { Company, NormalizedCompany } from '@/types/Company'
import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import {
  getCompanies,
  createCompany,
  deleteCompany,
  putCompany,
} from './actions'

const initialState: ReducerType<NormalizedCompany[]> = {
  getStatus: 'idle',
  resource: [],
}

export const CompaniesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.getStatus = 'pending'
        state.resource = initialState.resource
      })
      .addCase(
        getCompanies.fulfilled,
        (state, action: PayloadAction<NormalizedCompany[]>) => {
          state.getStatus = 'resolved'
          state.resource = action.payload.map((company) => {
            return {
              id: company.id,
              idOrg: company.idOrg,
              name: company.name,
              schemaName: company.schemaName,
              label: company.name,
              isActive: company.isActive,
              organizationType: company.organizationType,
            }
          })
        }
      )
      .addCase(getCompanies.rejected, (state) => {
        state.getStatus = 'rejected'
        state.resource = initialState.resource
      })
      .addCase(
        createCompany.fulfilled,
        (state, action: PayloadAction<NormalizedCompany>) => {
          state.resource = state.resource.concat(action.payload)
        }
      )
      .addCase(
        putCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.resource = state.resource.map((item) => {
            if (item.idOrg === action.payload.idOrg) {
              return { ...item, ...action.payload }
            }
            return item
          })
        }
      )
      .addCase(
        deleteCompany.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.resource = state.resource.filter(
            (item) => item.idOrg !== action.payload
          )
        }
      )
  },
})

export const selectCompanies = (state: AppState) => state.companies
export const companiesSelector = createSelector(
  selectCompanies,
  (state) => state
)

export const filterByIdOrg = (_state: AppState, idOrg: number) => idOrg

export const selectCompanyIdFiltered = (state: AppState) => state.filter.idOrg

export const companyByIdSelector = createSelector(
  selectCompanies,
  filterByIdOrg,
  (state, idOrg) => {
    return state.resource.find((company) => company.idOrg === idOrg)
  }
)

export const companyFilteredSelector = createSelector(
  selectCompanies,
  selectCompanyIdFiltered,
  (companies, idOrg) =>
    companies.resource.find((company) => company.idOrg === idOrg)
)

export const companiesReducer = CompaniesSlice.reducer
