import { AddressData } from './AddressData'

export type UserDataProfile = {
	first_name: string
	middle_name: string
	last_name: string
	email: string
	birthDate: string
	gender: string
	addresses: string
	residential_address?: AddressData
	mailing_address?: AddressData
	most_recent_branch: string
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
