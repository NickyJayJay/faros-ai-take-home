import { useQuery } from '@apollo/client/react'
import { GET_EMPLOYEES } from '@/graphql/queries'
import type { GetEmployeesData, GetEmployeesVars, EmployeeFilter } from '@/types'

const DEFAULT_PAGE_SIZE = 5

export function useEmployees(options: {
  pageSize?: number
  after?: string | null
  search?: string
  filter?: EmployeeFilter
} = {}) {
  const { pageSize = DEFAULT_PAGE_SIZE, after = null, search, filter } = options

  const variables: GetEmployeesVars = {
    first: pageSize,
    after,
    ...(search ? { search } : {}),
    ...(filter && Object.values(filter).some((v) => v && v.length > 0)
      ? { filter }
      : {}),
  }

  const { data, loading, error, refetch } = useQuery<GetEmployeesData, GetEmployeesVars>(
    GET_EMPLOYEES,
    {
      variables,
      notifyOnNetworkStatusChange: true,
    }
  )

  return {
    employees: data?.employees.edges.map((edge) => edge.node) ?? [],
    pageInfo: data?.employees.pageInfo ?? null,
    totalCount: data?.employees.totalCount ?? 0,
    loading,
    error: error ?? null,
    refetch,
  }
}
