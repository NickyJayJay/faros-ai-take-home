import { useState } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { Employee } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TeamChip } from '@/components/common/TeamChip';
import { AccountIcon } from '@/components/common/AccountIcon';
import { User } from 'lucide-react';

interface EmployeeRowProps {
  employee: Employee;
  onView: (employee: Employee) => void;
}

export function EmployeeRow({ employee, onView }: EmployeeRowProps) {
  const [imgError, setImgError] = useState(false);
  const showFallback = !employee.photoUrl || imgError;

  return (
    <TableRow>
      {/* Checkbox */}
      <TableCell className="w-12">
        <Checkbox aria-label={`Select ${employee.name}`} />
      </TableCell>

      {/* Name + Avatar + Email */}
      <TableCell>
        <div className="flex items-center gap-3">
          {showFallback ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          ) : (
            <img
              src={employee.photoUrl!}
              alt=""
              className="h-10 w-10 rounded-full bg-muted object-cover"
              onError={() => setImgError(true)}
            />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-600">
              {employee.name ?? employee.uid}
            </span>
            {employee.email && (
              <span className="text-xs text-muted-foreground">{employee.email}</span>
            )}
          </div>
        </div>
      </TableCell>

      {/* Tracking Status */}
      <TableCell>
        <StatusBadge
          trackingStatus={employee.trackingStatus}
          trackingCategory={employee.trackingCategory}
        />
      </TableCell>

      {/* Teams */}
      <TableCell>
        <div className="flex flex-wrap gap-1.5">
          {employee.teams.map((team) => (
            <TeamChip key={team.id} name={team.name} uid={team.uid} />
          ))}
        </div>
      </TableCell>

      {/* Accounts Connected */}
      <TableCell>
        <div className="flex items-center gap-2">
          {employee.accounts.map((account) => (
            <AccountIcon
              key={`${account.type}-${account.uid}`}
              type={account.type}
              source={account.source}
            />
          ))}
        </div>
      </TableCell>

      {/* View */}
      <TableCell>
        <Button variant="outline" size="sm" onClick={() => onView(employee)}>
          View
        </Button>
      </TableCell>
    </TableRow>
  );
}
