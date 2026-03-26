import { ArrowDown } from 'lucide-react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import type { Employee } from '@/types';
import { EmployeeRow } from './EmployeeRow';

interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  onViewEmployee: (employee: Employee) => void;
}

export function EmployeeTable({ employees, loading, onViewEmployee }: EmployeeTableProps) {
  if (loading && employees.length === 0) {
    return (
      <div className="rounded-lg border border-border">
        <div className="p-12 text-center text-sm text-muted-foreground">Loading employees...</div>
      </div>
    );
  }

  if (!loading && employees.length === 0) {
    return (
      <div className="rounded-lg border border-border">
        <div className="p-12 text-center text-sm text-muted-foreground">No employees found.</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">
              <Checkbox aria-label="Select all employees" />
            </TableHead>
            <TableHead>
              <SortableHeader label="Name" />
            </TableHead>
            <TableHead>
              <SortableHeader label="Tracking Status" />
            </TableHead>
            <TableHead>Teams</TableHead>
            <TableHead>
              <SortableHeader label="Accounts Connected" />
            </TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <EmployeeRow key={employee.id} employee={employee} onView={onViewEmployee} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SortableHeader({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1 font-medium text-foreground hover:text-foreground/80">
      {label}
      <ArrowDown className="h-3 w-3" />
    </button>
  );
}
