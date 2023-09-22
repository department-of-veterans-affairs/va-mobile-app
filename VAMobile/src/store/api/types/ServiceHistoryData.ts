export const BranchesOfServiceConstants: {
  AirForce: branchesOfService
  Army: branchesOfService
  CoastGuard: branchesOfService
  MarineCorps: branchesOfService
  Navy: branchesOfService
} = {
  AirForce: 'United States Air Force',
  Army: 'United States Army',
  CoastGuard: 'United States Coast Guard',
  MarineCorps: 'United States Marine Corps',
  Navy: 'United States Navy',
}

type branchesOfService =
  | 'United States Air Force'
  | 'United States Army'
  | 'United States Coast Guard'
  | 'United States Marine Corps'
  | 'United States Navy'
  | 'United States DoD'
  | 'United States Public Health Service'
  | 'United States NOAA'

export type ServiceData = {
  branchOfService: branchesOfService
  beginDate: string
  endDate: string
  formattedBeginDate: string
  formattedEndDate: string
  characterOfDischarge: string
  honorableServiceIndicator: string
}

export type ServiceHistoryData = Array<ServiceData>

export type MilitaryServiceHistoryData = {
  data: {
    type: string
    id: string
    attributes: {
      serviceHistory: ServiceHistoryData
    }
  }
}
