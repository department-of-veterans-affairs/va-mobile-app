import { DebtsPayload } from 'api/types'
import { Params } from 'store/api'
import { DemoStore } from 'store/api/demo/store'

/**
 * Demo data store shape for debts (overpayments).
 */
export type DebtsDemoStore = {
  '/v0/debts': DebtsPayload
}

/** Union of return types for debts demo API calls */
export type DebtsDemoReturnTypes = undefined | DebtsPayload

/** GET /v0/debts */
export const getDebts = (store: DemoStore, _params: Params, endpoint: string): DebtsPayload => {
  return store[endpoint as keyof DebtsDemoStore] as DebtsPayload
}
