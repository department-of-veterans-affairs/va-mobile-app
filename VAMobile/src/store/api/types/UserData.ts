import { AddressData } from './AddressData'

export type UserDataProfile = {
	firstName: string
	middleName: string
	lastName: string
	email: string
	birthDate: string
	gender: string
	addresses: string
	residential_address?: AddressData
	mailing_address?: AddressData
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
