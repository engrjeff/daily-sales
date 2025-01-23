"use client"

import React from "react"
import { Employee } from "@prisma/client"

type EmployeeContextState = {
  employee: Employee | null
  setEmployee: (employee: Employee | null) => void
}

const EmployeeContext = React.createContext<EmployeeContextState | null>(null)

export function EmployeeProvider({
  employee,
  children,
}: React.PropsWithChildren<{ employee: Employee }>) {
  const [employeeValue, setEmployee] = React.useState<Employee | null>(
    () => employee
  )

  return (
    <EmployeeContext.Provider value={{ employee: employeeValue, setEmployee }}>
      {children}
    </EmployeeContext.Provider>
  )
}

export function useEmployee() {
  const context = React.useContext(EmployeeContext)
  if (!context) {
    throw new Error("useEmployee must be used within <EmployeeProvider />")
  }
  return context
}
