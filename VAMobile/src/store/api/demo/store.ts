import { AppointmentsGetData, DirectDepositData, LettersData, MilitaryServiceHistoryData, UserData } from '../types'
import { DateTime } from 'luxon'
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

type DemoApiReturns = undefined | UserData | AppointmentsGetData | MilitaryServiceHistoryData | LettersData | DirectDepositData
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

export const transform = (callType: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE', endpoint: string, params: Params): DemoApiReturns => {
  switch (callType) {
    case 'GET': {
      switch (endpoint) {
        case '/v0/appointments': {
          const endDate = params.endDate
          if (endDate && typeof endDate === 'string') {
            if (DateTime.fromISO(endDate) < DateTime.now()) {
              return store?.['/v0/appointments'].past
            } else {
              return store?.['/v0/appointments'].upcoming
            }
          } else {
            return undefined
          }
        }
        default: {
          if (store && endpoint in store) {
            const k = endpoint as keyof DemoStore
            return store[k] as DemoApiReturns
          } else {
            return undefined
          }
        }
      }
    }
    default: {
      return undefined
    }
  }
}
