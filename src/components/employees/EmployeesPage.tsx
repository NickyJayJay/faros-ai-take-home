import { Plus } from 'lucide-react'
import { Breadcrumb } from '@/components/layout/Breadcrumb'

export function EmployeesPage() {
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

      {/* Search bar placeholder — will be built in Step 5 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2.5">
          <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-sm text-muted-foreground">Search employees by name ...</span>
        </div>
      </div>

      {/* Filter bar placeholder — will be built in Step 6 */}
      <div className="mb-4">
        <button className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
          <Plus className="h-4 w-4" />
          Add Filter
        </button>
      </div>

      {/* Table placeholder — will be built in Step 4 */}
      <div className="rounded-md border border-border">
        <div className="p-8 text-center text-sm text-muted-foreground">
          Employee table will render here
        </div>
      </div>
    </div>
  )
}
