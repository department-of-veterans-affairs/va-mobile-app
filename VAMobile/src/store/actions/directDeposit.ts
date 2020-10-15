import { BankDataAction } from 'store/types'

export const getBankData = (): BankDataAction => {
	// TODO: update to make api call to get data once service is integrated
	return {
		type: 'GET_BANK_DATA',
		payload: {
			bank_name: 'Bank of America',
			bank_account_number: '1234',
			bank_account_type: 'Savings',
		},
	}
}
