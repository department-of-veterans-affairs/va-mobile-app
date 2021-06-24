import HomeScreen from './screenObjects/home.screen'
import LoginScreen from './screenObjects/login.screen'
import ProfileScreen from './screenObjects/profile.screen'
import SettingScreen from './screenObjects/settings.screen'

export const DEFAULT_TIMEOUT = 45000

export const delay = (ms: number): Promise<void> => {
  return new Promise((cb) => {
    setTimeout(cb, ms)
  })
}

const getAuthWebViewContext = async (): Promise<string> => {
  for (let i = 0; i < 60; i++) {
    const contexts = await driver.getContexts()
    let wv
    if (driver.isAndroid) {
      // android and IOS behave slightly different
      // android spins up 2 chrome contexts (we only care about the last one with WEBVIEW_com.webadress)
      // ios only spins up 1
      wv = contexts.find((c) => c.startsWith('WEBVIEW_us.adhocteam'))
    } else {
      //@ts-ignore
      wv = contexts.find((c) => (c.id || c).startsWith('WEBVIEW_'))
    }
    if (wv) {
      return wv
    }
    await delay(1000)
  }
  throw new Error('Auth Webview not found')
}

export const androidScrollToElementWithText = async (text: string): Promise<void> => {
  const elementSelector = `new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${text}"))`
  await $(`android=${elementSelector}`)
}

export const doLogin = async (user: string, password: string): Promise<void> => {
  await LoginScreen.waitForIsShown()
  const loginButton = await LoginScreen.loginButton
  await loginButton.click()
  await delay(5000)

  const ctx = await getAuthWebViewContext()
  await driver.switchContext(ctx)
  const idmeLoginBtn = await $('#btn_idme3')
  await idmeLoginBtn.waitForDisplayed()
  idmeLoginBtn.click()

  const idmeLoginNextBtn = await $('#idme3_next_button')
  await idmeLoginNextBtn.waitForDisplayed()
  idmeLoginNextBtn.click()

  const userTxt = await $('#user_email')
  await userTxt.waitForDisplayed()
  userTxt.setValue(user)

  const userPwd = await $('#user_password')
  await userPwd.waitForDisplayed()
  userPwd.setValue(password)

  const submitBtn = await $('[name="commit"]')
  await submitBtn.waitForDisplayed()
  submitBtn.click()

  const submitTwoFactorBtn = await $('[name="button"]')
  await submitTwoFactorBtn.waitForDisplayed()
  submitTwoFactorBtn.click()

  await delay(1000)

  const confirmTwoFactorBtn = await $('[name="button"]')
  await confirmTwoFactorBtn.waitForDisplayed()
  confirmTwoFactorBtn.click()

  await delay(5000)

  const acceptAuthorize = await $('[title="Accept"]')
  await acceptAuthorize.waitForDisplayed()
  acceptAuthorize.click()

  await delay(5000)

  await driver.switchContext('NATIVE_APP')

  await HomeScreen.waitForIsShown()
}

export const tabTo = async (option: 'Home' | 'Claims' | 'Health' | 'Profile') => {
  const navOption = await $(`~${option}`)
  await navOption.click()
  await delay(1000)
}

export const goBackToPreviousScreen = async (backSelector = '~back') => {
  const backButton = await $(backSelector)
  await backButton.click()
  await delay(1000)
}

export const waitForIsShown = async (selector: Promise<WebdriverIO.Element>, isShown = true): Promise<any> => {
  const el = await selector
  return el.waitForDisplayed({
    timeout: DEFAULT_TIMEOUT,
    reverse: !isShown,
  })
}

export const logout = async () => {
  tabTo('Profile')

  await ProfileScreen.waitForIsShown()

  const profileSettingsButton = await ProfileScreen.profileSettingsButton
  profileSettingsButton.click()

  await SettingScreen.waitForIsShown()

  const settingsSignoutButton = await SettingScreen.settingsSignoutButton
  settingsSignoutButton.click()

  const settingsConfirmButton = await SettingScreen.settingsConfirmButton
  settingsConfirmButton.click()

  await LoginScreen.waitForIsShown()
}
