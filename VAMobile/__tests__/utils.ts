import LoginScreen from "./screenObjects/login.screen"
import HomeScreen from './screenObjects/home.screen'
import ProfileScreen from './screenObjects/profile.screen'
import SettingScreen from './screenObjects/settings.screen'

export const delay = (ms: number): Promise<void> => {
	return new Promise((cb) => {
		setTimeout(cb, ms)
	})
}

const getAuthWebViewContext = async (): Promise<string> => {
	for (var i = 0; i < 60; i++) {
		let contexts = await driver.getContexts();
		console.log(contexts)
		let wv
		if (driver.isAndroid) {
			// android and IOS behave slightly different
			// android spins up 2 chrome contexts (we only care about the last one with WEBVIEW_com.webadress)
			// ios only spins up 1
			wv = contexts.find(c => c.startsWith('WEBVIEW_com.vamobile'))
		} else {
			//@ts-ignore
			wv = contexts.find(c => (c.id || c).startsWith("WEBVIEW_"))
		}
		if (wv) {
			return wv
		}
		await delay(1000)
	}
	throw new Error("Auth Webview not found")
}

export const androidScrollToElementWithText = async (text: string): Promise<void> => {
    const elementSelector = `new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${text}"))`
    await $(`android=${elementSelector}`)
}

export const doLogin = async (user: string, password: string): Promise<void> => {
	await LoginScreen.waitForIsShown()
	let loginButton = await LoginScreen.loginButton
	await loginButton.click()
	await delay(1000)

	let ctx = await getAuthWebViewContext()
	await driver.switchContext(ctx)
	let idmeLoginBtn = await $("#btn_idme3")
	await idmeLoginBtn.waitForDisplayed()
	idmeLoginBtn.click()

	let idmeLoginNextBtn = await $("#idme3_next_button")
	await idmeLoginNextBtn.waitForDisplayed()
	idmeLoginNextBtn.click()

	let userTxt = await $("#user_email")
	await userTxt.waitForDisplayed()
	userTxt.setValue(user)

	let userPwd = await $("#user_password")
	await userPwd.waitForDisplayed()
	userPwd.setValue(password)

	let submitBtn = await $('[name="commit"]')
	await submitBtn.waitForDisplayed()
	submitBtn.click()

	let submitTwoFactorBtn = await $('[name="button"]')
	await submitTwoFactorBtn.waitForDisplayed()
	submitTwoFactorBtn.click()

	await delay(1000)

	let confirmTwoFactorBtn = await $('[name="button"]')
	await confirmTwoFactorBtn.waitForDisplayed()
	confirmTwoFactorBtn.click()

	await delay(15000)
	await driver.switchContext("NATIVE_APP")

	await HomeScreen.waitForIsShown()
}

export const tabTo = async (option: 'Home' | 'Claims' | 'Appointments' | 'Profile') => {
	const navOption = await $(`~${option}-nav-option`)
	await navOption.click()
    await delay(1000)
}

export const goBackToPreviousScreen = async () => {
    const backButton = await $('~back')
    await backButton.click()
    await delay(1000)
}

export const logout = async () => {
	tabTo('Profile')

	await ProfileScreen.waitForIsShown()

	const profileSettingsButton = await ProfileScreen.profileSettingsButton
	profileSettingsButton.click()

	await SettingScreen.waitForIsShown()

	const settingsLogoutButton = await SettingScreen.settingsLogoutButton
	settingsLogoutButton.click()

	await LoginScreen.waitForIsShown()
}