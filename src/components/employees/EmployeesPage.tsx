import { useState, useCallback, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { EmployeeTable } from './EmployeeTable'
import { EmployeeSearch } from './EmployeeSearch'
import { FilterBar } from './FilterBar'
import { Pagination } from './Pagination'
import { EmployeeDetailPanel } from './EmployeeDetailPanel'
import { useEmployees } from '@/hooks/useEmployees'
import { useDebounce } from '@/hooks/useDebounce'
import { useTelemetry } from '@/hooks/useTelemetry'
import type { Employee, EmployeeFilter } from '@/types'

export function EmployeesPage() {
  const { track } = useTelemetry()
  const [searchInput, setSearchInput] = useState('')
  const [filter, setFilter] = useState<EmployeeFilter>({})
  const [pageSize, setPageSize] = useState(5)
  const [afterCursor, setAfterCursor] = useState<string | null>(null)
  // Stack of previous endCursors for backward navigation
  const cursorStack = useRef<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)

  const debouncedSearch = useDebounce(searchInput, 300)

  const { employees, pageInfo, totalCount, loading } = useEmployees({
    pageSize,
    after: afterCursor,
    search: debouncedSearch || undefined,
    filter,
  })

  // Track page view on mount
  useEffect(() => {
    track('page_view', { page: 'employees' })
  }, [track])

  // Reset pagination when search or filter changes
  const prevSearch = useRef(debouncedSearch)
  const prevFilter = useRef(filter)
  useEffect(() => {
    if (prevSearch.current !== debouncedSearch || prevFilter.current !== filter) {
      setAfterCursor(null)
      cursorStack.current = []
      setCurrentPage(0)
      prevSearch.current = debouncedSearch
      prevFilter.current = filter
    }
  }, [debouncedSearch, filter])

  // Track search (result count only — never log search text, could be PII)
  useEffect(() => {
    if (debouncedSearch && !loading) {
      track('employee_search', { resultCount: totalCount })
    }
  }, [debouncedSearch, loading, totalCount, track])

  const handleFilterChange = useCallback((newFilter: EmployeeFilter) => {
    setFilter(newFilter)
    const activeKeys = Object.keys(newFilter).filter(
      (k) => (newFilter as Record<string, string[]>)[k]?.length > 0
    )
    if (activeKeys.length > 0) {
      track('employee_filter_applied', { filterTypes: activeKeys })
    }
  }, [track])

  function handleNextPage() {
    if (pageInfo?.endCursor) {
      if (afterCursor !== null) {
        cursorStack.current = [...cursorStack.current, afterCursor]
      } else {
        cursorStack.current = [...cursorStack.current]
      }
      setAfterCursor(pageInfo.endCursor)
      setCurrentPage((p) => p + 1)
    }
  }

  function handlePreviousPage() {
    if (currentPage <= 1) {
      // Going back to the first page
      setAfterCursor(null)
      cursorStack.current = []
      setCurrentPage(0)
    } else {
      const stack = [...cursorStack.current]
      const prevCursor = stack.pop() ?? null
      cursorStack.current = stack
      setAfterCursor(prevCursor)
      setCurrentPage((p) => p - 1)
    }
  }

  function handlePageSizeChange(newSize: number) {
    setPageSize(newSize)
    setAfterCursor(null)
    cursorStack.current = []
    setCurrentPage(0)
  }

  function handleViewEmployee(employee: Employee) {
    setSelectedEmployeeId(employee.id)
    track('employee_detail_opened', { employeeId: employee.id })
  }

  const currentStart = totalCount > 0 ? currentPage * pageSize + 1 : 0

  return (
    <div className="flex-1 px-8 py-6">
      {/* Breadcrumb + New button row */}
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb />
        <Button size="sm">
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>

      {/* Page title */}
      <h1 className="text-2xl font-bold text-foreground mb-2">Employees</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Easily assign employees to teams, include them for tracking in team productivity status, and manage their connected accounts.
      </p>

      {/* Search bar */}
      <div className="mb-4">
        <EmployeeSearch value={searchInput} onChange={setSearchInput} />
      </div>

      {/* Filter bar */}
      <div className="mb-4">
        <FilterBar filter={filter} onFilterChange={handleFilterChange} />
      </div>

      {/* Employee table */}
      <EmployeeTable
        employees={employees}
        loading={loading}
        onViewEmployee={handleViewEmployee}
      />

      {/* Pagination */}
      {totalCount > 0 && (
        <Pagination
          pageSize={pageSize}
          currentStart={currentStart}
          totalCount={totalCount}
          hasNextPage={pageInfo?.hasNextPage ?? false}
          hasPreviousPage={currentPage > 0}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
      {/* Employee detail panel */}
      {selectedEmployeeId && (
        <EmployeeDetailPanel
          employeeId={selectedEmployeeId}
          onClose={() => setSelectedEmployeeId(null)}
        />
      )}
    </div>
  )
}
