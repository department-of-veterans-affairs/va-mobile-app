import { BankDataPayload } from '../types'
import createReducer from './createReducer'

export type DirectDepositState = {
	bankData: BankDataPayload
}

export const initialDirectDepositState: DirectDepositState = {
	bankData: {} as BankDataPayload,
}

export default createReducer<DirectDepositState>(initialDirectDepositState, {
	GET_BANK_DATA: (_state: DirectDepositState, payload: BankDataPayload): DirectDepositState => {
		return {
			...initialDirectDepositState,
			bankData: payload,
		}
	},
})
