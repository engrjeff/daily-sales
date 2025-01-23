import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyView } from "@/components/empty-view"

import { getEmployees } from "../employees/queries"

export async function EmployeesTable({ storeId }: { storeId: string }) {
  const employees = await getEmployees(storeId)

  return (
    <>
      <Table containerClass="border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="w-9 text-center">#</TableHead>
            <TableHead>Employee Name</TableHead>
            <TableHead>Contact Number</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <EmptyView />
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee, n) => (
              <TableRow key={`employee-${employee.id}`}>
                <TableCell className="text-center w-9">{n + 1}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {employee.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{employee.contactNumber}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="FULFILLED">{employee.status}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button size="sm" variant="link" className="text-blue-500">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  )
}
