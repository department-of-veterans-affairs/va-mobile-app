const globalAny: any = global;

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

jest.mock('react-native/Libraries/Linking/Linking', () => {
	return {
		addEventListener: jest.fn(),
		openURL: jest.fn(() => Promise.resolve(''))
	}
});

jest.mock("../src/store/api", ()=> ({
	get: jest.fn(),
	post: jest.fn(),
      put: jest.fn(),
	setAccessToken: jest.fn(),
	getAccessToken: jest.fn()
}))

jest.mock("../src/utils/hooks", ()=> {
	let original = jest.requireActual("../src/utils/hooks")
	let theme = jest.requireActual("../src/styles/themes/standardTheme").default
	return {
		...original,
		useTheme: jest.fn(()=> {
			return {...theme}
		}),
		useRouteNavigation: () => {
			return jest.fn()
		}
	}
})

jest.mock('react-native-keychain', () => {
	return {
		ACCESS_CONTROL: {
			USER_PRESENCE: "USER_PRESENCE",
			BIOMETRY_ANY: "BIOMETRY_ANY",
			BIOMETRY_CURRENT_SET: "BIOMETRY_CURRENT_SET",
			DEVICE_PASSCODE: "DEVICE_PASSCODE",
			APPLICATION_PASSWORD: "APPLICATION_PASSWORD",
			BIOMETRY_ANY_OR_DEVICE_PASSCODE: "BIOMETRY_ANY_OR_DEVICE_PASSCODE",
			BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE: "BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE"
		},
		BIOMETRY_TYPE: {
			TOUCH_ID: 'TouchID',
			FACE_ID: 'FaceID',
			FINGERPRINT: 'Fingerprint',
			FACE: 'Face',
			IRIS: 'Iris',
		},
		AUTHENTICATION_TYPE: {
			DEVICE_PASSCODE_OR_BIOMETRICS: 'AuthenticationWithBiometricsDevicePasscode',
			BIOMETRICS: 'AuthenticationWithBiometrics',
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
		SECURITY_LEVEL: {
			SECURE_SOFTWARE:"SECURE_SOFTWARE",
			SECURE_HARDWARE:"SECURE_HARDWARE",
			ANY:"ANY",
		},
		SECURITY_LEVEL_ANY: "MOCK_SECURITY_LEVEL_ANY",
		SECURITY_LEVEL_SECURE_SOFTWARE: "MOCK_SECURITY_LEVEL_SECURE_SOFTWARE",
		SECURITY_LEVEL_SECURE_HARDWARE: "MOCK_SECURITY_LEVEL_SECURE_HARDWARE",
		setGenericPassword: jest.fn(() => Promise.resolve()),
		getGenericPassword: jest.fn(() =>  Promise.resolve(undefined)),
		resetGenericPassword: jest.fn(() =>  Promise.resolve()),
		getSupportedBiometryType: jest.fn(() => Promise.resolve(undefined)),
		setInternetCredentials: jest.fn(() => Promise.resolve()),
		getInternetCredentials: jest.fn(() =>  Promise.resolve(undefined)),
		resetInternetCredentials: jest.fn(() =>  Promise.resolve()),
		hasInternetCredentials: jest.fn(() =>  Promise.resolve(false)),

	}
})

jest.mock("react-native-localize", () => {
	return {
		getLocales: jest.fn(),
		findBestAvailableLanguage: jest.fn(() => ["en"]),
	}
})

jest.mock('@react-native-async-storage/async-storage', () => {
	return {
		setItem: jest.fn(() =>  Promise.resolve()),
		getItem: jest.fn(() =>  Promise.resolve()),
		removeItem: jest.fn(() => Promise.resolve()),
	}
})


jest.mock('@react-native-async-storage/async-storage', () => {
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

jest.mock('@react-native-community/clipboard', () => {
	return {
		setString: jest.fn()
	}
})

globalAny.fetch = jest.fn(() =>
	Promise.reject({
		status: 999,
		text: () => Promise.resolve("NOT MOCKED"),
		json: () => Promise.resolve({ error: "NOT MOCKED" }),
	})
)

