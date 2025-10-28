export type UserRole = 'staff' | 'admin'

export interface UserRoleRecord {
  id: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  first_name: string
  last_name: string
  middle_initial?: string
  address: string
  phone_number: string
  email: string
  created_at: string
  updated_at: string
  created_by?: string
}

export interface Unit {
  id: string
  customer_id: string
  brand: string
  model: string
  year: number
  plate_number: string
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  customer_id: string
  unit_id: string
  work_date: string
  duration_hours: number
  remarks?: string
  created_at: string
  updated_at: string
  created_by: string
}

export interface JobItem {
  id: string
  job_id: string
  description: string
  products_used?: string
  created_at: string
}

export interface CustomerProfile {
  customer: Customer
  units: Unit[]
  jobs: Array<{
    id: string
    work_date: string
    duration_hours: number
    remarks?: string
    unit: Unit
    items: JobItem[]
    created_at: string
  }>
}

export interface CustomerSearchResult extends Customer {
  unit_count: number
}

