const globalAny:any = global;

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
		SECURITY_LEVEL: {
			SECURE_SOFTWARE:"SECURE_SOFTWARE",
			SECURE_HARDWARE:"SECURE_HARDWARE",
			ANY:"ANY",
		},
		ACCESSIBLE: {
			WHEN_UNLOCKED: 'AccessibleWhenUnlocked',
			AFTER_FIRST_UNLOCK: 'AccessibleAfterFirstUnlock',
			ALWAYS: 'AccessibleAlways',
			WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: 'AccessibleWhenPasscodeSetThisDeviceOnly',
			WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly',
			AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 'AccessibleAfterFirstUnlockThisDeviceOnly',
			ALWAYS_THIS_DEVICE_ONLY: 'AccessibleAlwaysThisDeviceOnly',	
		},
		SECURITY_LEVEL_ANY: "MOCK_SECURITY_LEVEL_ANY",
		SECURITY_LEVEL_SECURE_SOFTWARE: "MOCK_SECURITY_LEVEL_SECURE_SOFTWARE",
		SECURITY_LEVEL_SECURE_HARDWARE: "MOCK_SECURITY_LEVEL_SECURE_HARDWARE",
		setGenericPassword: jest.fn(()=>""),
		getGenericPassword: jest.fn(()=>""),
		resetGenericPassword: jest.fn(()=>""),
	}
})


jest.mock('@react-native-community/async-storage', () => {
	return {
		getItem: jest.fn(()=>Promise.resolve()),
		removeItem: jest.fn(()=>Promise.resolve()),
	}
})

jest.mock('@react-native-community/cookies', () => {
	return {
		clearAll: jest.fn(),
	}
})

globalAny.fetch = jest.fn(() =>
	Promise.reject({
		status: 999,
		text: () => Promise.resolve("NOT MOCKED"),
		json: () => Promise.resolve({ error: "NOT MOCKED" }),
	})
)


