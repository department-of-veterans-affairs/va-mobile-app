export const BranchesOfServiceConstants: {
  AirForce: BranchOfService
  Army: BranchOfService
  CoastGuard: BranchOfService
  MarineCorps: BranchOfService
  Navy: BranchOfService
  SpaceForce: BranchOfService
} = {
  AirForce: 'United States Air Force',
  Army: 'United States Army',
  CoastGuard: 'United States Coast Guard',
  MarineCorps: 'United States Marine Corps',
  Navy: 'United States Navy',
  SpaceForce: 'United States Space Force',
}

export type BranchOfService =
  | 'United States Air Force'
  | 'United States Army'
  | 'United States Coast Guard'
  | 'United States Marine Corps'
  | 'United States Navy'
  | 'United States DoD'
  | 'United States Public Health Service'
  | 'United States NOAA'
  | 'United States Space Force'

export type ServiceData = {
  branchOfService: BranchOfService
  beginDate: string
  endDate: string
  formattedBeginDate: string
  formattedEndDate: string
  characterOfDischarge: string
  honorableServiceIndicator: string
}

export type ServiceHistoryData = Array<ServiceData>

export type ServiceHistoryAttributes = {
  serviceHistory: ServiceHistoryData
  mostRecentBranch?: BranchOfService
}

export type MilitaryServiceHistoryData = {
  data: {
    type: string
    id: string
    attributes: ServiceHistoryAttributes
  }
}
