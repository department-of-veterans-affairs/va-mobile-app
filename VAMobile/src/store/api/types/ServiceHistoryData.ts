export type ServiceData = {
  branchOfService: string
  beginDate: string
  endDate: string
  formattedBeginDate: string
  formattedEndDate: string
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
