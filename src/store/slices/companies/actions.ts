import { createAsyncThunk, nanoid } from '@reduxjs/toolkit'
import {
	getCompanies as getCompaniesApi,
	getActiveCompanies as getActivesCompaniesApi,
	createCompany as createCompanyApi,
	putCompany as putCompanyApi,
	deleteCompany as deleteCompanyApi,
} from '@/services/api/companies'
import { Company, NormalizedCompany } from '@/types/Company'
import { EnqueueSnackbar } from '@/types/notistack'
import {
	addSnackbarKey,
	setEnqueueSnackbar,
} from '@/utils/helpers/enqueueSnackbar'
import * as snackbars from '@/utils/constants/snackbars/company'
import { enqueueSnackbar } from '@/store/slices/notistack'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'

export const getCompanies = createAsyncThunk<
	NormalizedCompany[],
	void,
	{
		rejectValue: EnqueueSnackbar
	}
>('companies/getCompanies', async (_, { rejectWithValue }) => {
	try {
		const data: Company[] = await getCompaniesApi()
		return data
			.map((item) => ({ ...item, id: nanoid() }))
			.sort((a, b) => a.idOrg - b.idOrg)
	} catch (err) {
		// return companies.map((item) => ({ ...item, id: nanoid() }))
		detectUnauthorized(err, getCompanies())
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getCompaniesError, err)
		)
	}
})

export const getActiveCompanies = createAsyncThunk<
	NormalizedCompany[],
	void,
	{
		rejectValue: EnqueueSnackbar
	}
>('companies/getActiveCompanies', async (_, { rejectWithValue }) => {
	try {
		const data: Company[] = await getActivesCompaniesApi()
		return data.map((item) => ({ ...item, id: nanoid() }))
	} catch (err) {
		// return companies.map((item) => ({ ...item, id: nanoid() }))
		detectUnauthorized(err, getActiveCompanies())
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getCompaniesError, err)
		)
	}
})

export const createCompany = createAsyncThunk<
	NormalizedCompany,
	Partial<Company>,
	{ rejectValue: EnqueueSnackbar }
>('companies/createCompany', async (company, { rejectWithValue, dispatch }) => {
	try {
		const data: Company = await createCompanyApi(company)
		dispatch(
			enqueueSnackbar(addSnackbarKey(snackbars.createCompanySuccess))
		)
		return { ...data, id: nanoid() }
	} catch (err) {
		detectUnauthorized(err, createCompany(company))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.createCompanyError, err)
		)
	}
})

export const putCompany = createAsyncThunk<
	Company,
	Partial<Company>,
	{ rejectValue: EnqueueSnackbar }
>('companies/putCompanies', async (company, { rejectWithValue, dispatch }) => {
	try {
		const data: Company = await putCompanyApi(company)
		dispatch(enqueueSnackbar(addSnackbarKey(snackbars.putCompanySuccess)))
		return data
	} catch (err) {
		detectUnauthorized(err, putCompany(company))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.putCompanyError, err)
		)
	}
})

export const deleteCompany = createAsyncThunk<
	number,
	number,
	{ rejectValue: EnqueueSnackbar }
>('companies/deleteCompany', async (id, { rejectWithValue, dispatch }) => {
	try {
		const data: { success: boolean } = await deleteCompanyApi(id)
		if (data.success) {
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.deleteCompanySuccess))
			)
			return id
		} else {
			throw new Error('')
		}
	} catch (err) {
		detectUnauthorized(err, deleteCompany(id))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.deleteCompanyError, err)
		)
	}
})
