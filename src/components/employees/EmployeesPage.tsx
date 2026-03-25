import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { EmployeeTable } from './EmployeeTable'
import { EmployeeSearch } from './EmployeeSearch'
import { useEmployees } from '@/hooks/useEmployees'
import { useDebounce } from '@/hooks/useDebounce'
import type { Employee } from '@/types'

export function EmployeesPage() {
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 300)

  const { employees, loading } = useEmployees({
    pageSize: 5,
    search: debouncedSearch || undefined,
  })

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

      {/* Filter bar placeholder — Step 6 */}
      <div className="mb-4">
        <button className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
          <Plus className="h-4 w-4" />
          Add Filter
        </button>
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
