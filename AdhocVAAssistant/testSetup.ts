jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

jest.mock('react-native-keychain', () => {
	return {
		ACCESS_CONTROL: {
			USER_PRESENCE:"USER_PRESENCE",
			BIOMETRY_ANY:"BIOMETRY_ANY",
			BIOMETRY_CURRENT_SET:"BIOMETRY_CURRENT_SET",
			DEVICE_PASSCODE:"DEVICE_PASSCODE",
			APPLICATION_PASSWORD:"APPLICATION_PASSWORD",	
			BIOMETRY_ANY_OR_DEVICE_PASSCODE:"BIOMETRY_ANY_OR_DEVICE_PASSCODE",
			BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE:"BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE"
		},
		SECURITY_LEVEL_ANY: "MOCK_SECURITY_LEVEL_ANY",
		SECURITY_LEVEL_SECURE_SOFTWARE: "MOCK_SECURITY_LEVEL_SECURE_SOFTWARE",
		SECURITY_LEVEL_SECURE_HARDWARE: "MOCK_SECURITY_LEVEL_SECURE_HARDWARE",
		setGenericPassword: jest.fn(()=>""),
		getGenericPassword: jest.fn(()=>""),
		resetGenericPassword: jest.fn(()=>""),
	}
})

jest.mock('@react-native-community/cookies', () => {
	return {
		clearAll: jest.fn(),
	}
})

global.fetch = jest.fn(() =>
	Promise.reject({
		status: 999,
		text: () => Promise.resolve("NOT MOCKED"),
		json: () => Promise.resolve({ error: "NOT MOCKED" }),
	})
)


