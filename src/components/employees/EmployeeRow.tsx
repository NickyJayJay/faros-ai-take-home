import type { Employee } from '@/types'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TeamChip } from '@/components/common/TeamChip'
import { AccountIcon } from '@/components/common/AccountIcon'

interface EmployeeRowProps {
  employee: Employee
  onView: (employee: Employee) => void
}

export function EmployeeRow({ employee, onView }: EmployeeRowProps) {
  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-muted/30">
      {/* Checkbox */}
      <td className="w-12 px-4 py-3">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border text-primary"
          aria-label={`Select ${employee.name}`}
        />
      </td>

      {/* Name + Avatar + Email */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={employee.photoUrl ?? ''}
            alt=""
            className="h-10 w-10 rounded-full bg-muted object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-600">
              {employee.name ?? employee.uid}
            </span>
            {employee.email && (
              <span className="text-xs text-muted-foreground">{employee.email}</span>
            )}
          </div>
        </div>
      </td>

      {/* Tracking Status */}
      <td className="px-4 py-3">
        <StatusBadge
          trackingStatus={employee.trackingStatus}
          trackingCategory={employee.trackingCategory}
        />
      </td>

      {/* Teams */}
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {employee.teams.map((team) => (
            <TeamChip key={team.id} name={team.name} uid={team.uid} />
          ))}
        </div>
      </td>

      {/* Accounts Connected */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {employee.accounts.map((account) => (
            <AccountIcon key={`${account.type}-${account.uid}`} type={account.type} source={account.source} />
          ))}
        </div>
      </td>

      {/* View */}
      <td className="px-4 py-3">
        <button
          onClick={() => onView(employee)}
          className="rounded-md border border-border px-3 py-1 text-sm font-medium text-foreground hover:bg-muted"
        >
          View
        </button>
      </td>
    </tr>
  )
}
