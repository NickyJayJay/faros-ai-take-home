import { useQuery } from '@apollo/client/react'
import { GET_FILTER_OPTIONS } from '@/graphql/queries'
import type { GetFilterOptionsData } from '@/types'

export function useFilterOptions() {
  const { data, loading, error } = useQuery<GetFilterOptionsData>(GET_FILTER_OPTIONS)

  return {
    filterOptions: data?.filterOptions ?? null,
    loading,
    error: error ?? null,
  }
}
