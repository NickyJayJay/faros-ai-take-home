// ----- GraphQL Entity Types -----

export interface Team {
  id: string
  uid: string
  name: string
}

export interface Account {
  /** Account category: vcs, tms, ims, cal */
  type: 'vcs' | 'tms' | 'ims' | 'cal'
  /** Source system name: GitHub, Jira, PagerDuty, Google Calendar */
  source: string
  uid: string
}

export interface Employee {
  id: string
  uid: string
  name: string | null
  email: string | null
  photoUrl: string | null
  inactive: boolean | null
  trackingStatus: 'Included' | 'Ignored' | null
  trackingCategory: 'Active' | 'Inactive' | null
  teams: Team[]
  accounts: Account[]
}

// ----- Pagination -----

export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  endCursor: string | null
  startCursor: string | null
}

export interface EmployeeEdge {
  node: Employee
  cursor: string
}

export interface EmployeeConnection {
  edges: EmployeeEdge[]
  pageInfo: PageInfo
  totalCount: number
}

// ----- Filters -----

export interface EmployeeFilter {
  teams?: string[]
  accountTypes?: string[]
  trackingStatuses?: string[]
  trackingCategories?: string[]
}

export interface TeamOption {
  uid: string
  name: string
}

export interface AccountTypeOption {
  type: string
  source: string
}

export interface FilterOptions {
  teams: TeamOption[]
  trackingStatuses: string[]
  trackingCategories: string[]
  accountTypes: AccountTypeOption[]
}

// ----- Query Response Types -----

export interface GetEmployeesData {
  employees: EmployeeConnection
}

export interface GetEmployeesVars {
  first?: number
  after?: string | null
  search?: string
  filter?: EmployeeFilter
}

export interface GetEmployeeData {
  employee: Employee | null
}

export interface GetEmployeeVars {
  id: string
}

export interface GetFilterOptionsData {
  filterOptions: FilterOptions
}

// ----- AI Insights (REST API) -----

export interface AIInsightResponse {
  employeeId: string
  employeeUid: string
  summary: string
  confidence: number
  generatedAt: string
  model: string
  processingTimeMs: number
}

export interface ConsentTokenResponse {
  consentToken: string
  expiresAt: string
  scope: string
}

// ----- Telemetry -----

export interface TelemetryEvent {
  event: string
  properties?: Record<string, unknown>
  timestamp: string
  sessionId: string
}
