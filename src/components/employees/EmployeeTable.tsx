import { ArrowDown } from 'lucide-react'
import type { Employee } from '@/types'
import { EmployeeRow } from './EmployeeRow'

interface EmployeeTableProps {
  employees: Employee[]
  loading: boolean
  onViewEmployee: (employee: Employee) => void
}

export function EmployeeTable({ employees, loading, onViewEmployee }: EmployeeTableProps) {
  if (loading && employees.length === 0) {
    return (
      <div className="rounded-md border border-border">
        <div className="p-12 text-center text-sm text-muted-foreground">
          Loading employees...
        </div>
      </div>
    )
  }

  if (!loading && employees.length === 0) {
    return (
      <div className="rounded-md border border-border">
        <div className="p-12 text-center text-sm text-muted-foreground">
          No employees found.
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-border overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-white">
            <th className="w-12 px-4 py-3 text-left">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary"
                aria-label="Select all employees"
              />
            </th>
            <th className="px-4 py-3 text-left">
              <SortableHeader label="Name" />
            </th>
            <th className="px-4 py-3 text-left">
              <SortableHeader label="Tracking Status" />
            </th>
            <th className="px-4 py-3 text-left">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Teams
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <SortableHeader label="Accounts Connected" />
            </th>
            <th className="w-20 px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <EmployeeRow
              key={employee.id}
              employee={employee}
              onView={onViewEmployee}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SortableHeader({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground">
      {label}
      <ArrowDown className="h-3 w-3" />
    </button>
  )
}
