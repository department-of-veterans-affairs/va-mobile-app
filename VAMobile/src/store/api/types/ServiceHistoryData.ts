export type ServiceData = {
  branch_of_service: string
  begin_date: string
  end_date: string
  formatted_begin_date: string
  formatted_end_date: string
}

export type ServiceHistoryData = Array<ServiceData>

export type MilitaryServiceHistoryData = {
  data: {
    type: string
    id: string
    attributes: {
      service_history: ServiceHistoryData
    }
  }
}
