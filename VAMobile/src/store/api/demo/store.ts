import { AppointmentsGetData, DirectDepositData, LettersData, MilitaryServiceHistoryData, UserData } from '../types'
import { Params } from '../api'

export type DemoStore = {
  '/v0/user': UserData
  '/v0/military-service-history': MilitaryServiceHistoryData
  '/v0/letters': LettersData
  '/v0/payment-information/benefits': DirectDepositData
  '/v0/appointments': {
    past: AppointmentsGetData
    upcoming: AppointmentsGetData
  }
}
let store: DemoStore | undefined

const setDemoStore = (data: DemoStore) => {
  store = data
}

export const initDemoStore = async (): Promise<void> => {
  const data = await import('./demo.json')
  console.log(data.default)
  setDemoStore((data.default as unknown) as DemoStore)
  console.log(store?.['/v0/user'])
}

export const transform = <T>(callType: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE', endpoint: keyof DemoStore, params: Params): T => {
  switch (callType) {
    case 'GET': {
      switch (endpoint) {
        case '/v0/appointments': {
          //todo: check params for dates and return past or upcoming from store
        }
      }
    }
    default: {
      return {} as T
    }
  }
}
