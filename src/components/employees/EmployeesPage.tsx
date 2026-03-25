import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { EmployeeTable } from './EmployeeTable'
import { EmployeeSearch } from './EmployeeSearch'
import { FilterBar } from './FilterBar'
import { useEmployees } from '@/hooks/useEmployees'
import { useDebounce } from '@/hooks/useDebounce'
import type { Employee, EmployeeFilter } from '@/types'

export function EmployeesPage() {
  const [searchInput, setSearchInput] = useState('')
  const [filter, setFilter] = useState<EmployeeFilter>({})
  const debouncedSearch = useDebounce(searchInput, 300)

  const { employees, loading } = useEmployees({
    pageSize: 5,
    search: debouncedSearch || undefined,
    filter,
  })

  const handleFilterChange = useCallback((newFilter: EmployeeFilter) => {
    setFilter(newFilter)
  }, [])

  function handleViewEmployee(employee: Employee) {
    // Detail panel will be wired in Step 8
    console.log('View employee:', employee.id)
  }

  return (
    <div className="flex-1 px-8 py-6">
      {/* Breadcrumb + New button row */}
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb />
        <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          New
        </button>
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
    </div>
  )
}
