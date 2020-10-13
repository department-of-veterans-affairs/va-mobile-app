import { AddressData } from './AddressData'

export type BankData = {
	bank_name: string
	bank_account_number: string
	bank_account_type: string
}

export type UserDataProfile = {
	first_name: string
	middle_name: string
	last_name: string
	full_name: string
	email: string
	birthDate: string
	gender: string
	addresses: string
	residential_address?: AddressData
	mailing_address?: AddressData
	most_recent_branch: string
	bank_data: BankData
}

export type UserData = {
	data: {
		attributes: {
			id: string
			type: string
			authorized_services: Array<string>
			profile: UserDataProfile
		}
	}
}
