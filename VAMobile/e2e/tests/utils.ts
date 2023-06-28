import { device, element, by, expect, waitFor } from 'detox'
import getEnv from '../../src/utils/env'
import { expect as jestExpect } from '@jest/globals'
import { setTimeout } from "timers/promises"

const { toMatchImageSnapshot } = require('jest-image-snapshot')
const fs = require('fs')
jestExpect.extend({ toMatchImageSnapshot })

export const CommonE2eIdConstants = {
  VA_LOGO_ICON_ID: 'va-icon',
  DEMO_MODE_INPUT_ID: 'demo-mode-password',
  DEMO_BTN_ID: 'demo-btn',
  SIGN_IN_BTN_ID: 'Sign in',
  SKIP_BTN_TEXT: 'Skip',
  VETERAN_CRISIS_LINE_BTN_ID: 'talk-to-the-veterans-crisis-line-now',
  PROFILE_TAB_BUTTON_TEXT: 'Profile',
  HEALTH_TAB_BUTTON_TEXT: 'Health',
  BENEFITS_TAB_BUTTON_TEXT: 'Benefits',
  SETTINGS_ROW_TEXT: 'Settings',
  MILITARY_INFORMATION_ROW_TEXT: 'Military information',
  SIGN_OUT_BTN_ID: 'Sign out',
  SIGN_OUT_CONFIRM_TEXT: 'Are you sure you want to sign out?',
  BACK_BTN_LABEL: 'Back',
  LEAVING_APP_POPUP_TEXT: 'You’re leaving the app',
  CANCEL_UNIVERSAL_TEXT: 'Cancel',
  OK_UNIVERSAL_TEXT: 'OK',
}


/** Log the automation into demo mode
 * */
export async function loginToDemoMode() {
  await setTimeout(5000)
  try {
	await element(by.text('[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!')).tap()
	await element(by.text('Dismiss')).tap()
  } catch (e) {} 
  const { DEMO_PASSWORD } = getEnv() 
  await element(by.id(CommonE2eIdConstants.VA_LOGO_ICON_ID)).multiTap(21)
  if (DEMO_PASSWORD != undefined) {
    await element(by.id(CommonE2eIdConstants.DEMO_MODE_INPUT_ID)).typeText(DEMO_PASSWORD)
  }
  
  // due to keyboard being open one tap to close keyboard second to tap demo btn
  await element(by.id(CommonE2eIdConstants.DEMO_BTN_ID)).multiTap(2)

  await element(by.text(CommonE2eIdConstants.SIGN_IN_BTN_ID)).tap()

  const ifCarouselSkipBtnExist = await checkIfElementIsPresent(CommonE2eIdConstants.SKIP_BTN_TEXT, true)

  if (ifCarouselSkipBtnExist) {
    await element(by.text(CommonE2eIdConstants.SKIP_BTN_TEXT)).tap()
  }
}

/** this function is to see if a element is present that could sometime not be like the carousel for example
 * which will perform a check without actually performing a test and return true or false
 *
 * @param matchString - string of the text or id to match
 * @param findbyText - boolean to search by testID or Text
 * @param waitForElement - boolean to wait for an element
 * @param timeOut - time to wait for the element
 * */

const checkIfElementIsPresent = async (matchString: string, findbyText = false, waitForElement = false, timeOut = 2000) => {
  try {
    if (findbyText) {
      if (waitForElement) {
        waitFor(element(by.text(matchString)))
          .toExist()
          .withTimeout(timeOut)
      } else {
        await expect(element(by.text(matchString))).toExist()
      }
    } else {
      if (waitForElement) {
        waitFor(element(by.id(matchString)))
          .toExist()
          .withTimeout(timeOut)
      } else {
        await expect(element(by.id(matchString))).toExist()
      }
    }
    return true
  } catch (e) {
    return false
  }
}

/** This function will open, check for, and dismiss the leaving app popup from a specified launching point
 * 
 * @param matchString - string of the text or id to match
 * @param findbyText - boolean to search by testID or Text
 * @param cancelPopUp - boolean to either cancel the popUp or leave the app
 */
export async function openDismissLeavingAppPopup(matchString: string, findbyText = false) {
	if (findbyText) {
		await element(by.text(matchString)).tap()
	} else {
		await element(by.id(matchString)).tap()
	}

	await expect(element(by.text(CommonE2eIdConstants.LEAVING_APP_POPUP_TEXT))).toExist()
	await element(by.text(CommonE2eIdConstants.CANCEL_UNIVERSAL_TEXT)).tap()
			
}

/** This function will change the mock data for demo mode
 * 
 * @param matchString - string: name of the json file ie appointments.json
 * @param jsonProperty - array of strings and dictionaries: should match the path to get to the json ob you want changed that matches the path to get to the object you want changed
 * @param newJsonValue - string or boolean: new value for the json object
 */
export async function changeMockData (mockFileName: string, jsonProperty, newJsonValue: string | boolean) {
			
	fs.readFile('./src/store/api/demo/mocks/' + mockFileName, 'utf8', (error, data) => {
		 if(error){
			console.log(error);
			return;
		 }

		const jsonParsed = JSON.parse(data)
		//const jsonFirstObject = source[jsonProperty[0]]
		var value
		for(var x=0; x<jsonProperty.length; x++) {
			if (x == 0) {
				var mockDataVariable = jsonParsed[jsonProperty[x]]
			} else if (x == jsonProperty.length - 1) {
				mockDataVariable[jsonProperty[x]] = newJsonValue
			} else {
				if (jsonProperty[x].constructor == Object) {
					var key = String(Object.keys(jsonProperty[x]))
					value = jsonProperty[x][key]
					mockDataVariable = mockDataVariable[key[0]]
					mockDataVariable = mockDataVariable[value]
				} else {
					mockDataVariable = mockDataVariable[jsonProperty[x]]
				}
			}
				
		}
		//log(JSON.stringify(jsonParsed, null, 2))
	
		fs.writeFile('./src/store/api/demo/mocks/' + mockFileName, JSON.stringify(jsonParsed, null, 2), function writeJSON(err) {
			if (err) { return console.log(err) }
		})
	})
}

/** This function will check and verify if the image provided matches the image in the _imagesnapshot_ folder
 * @param screenshotPath: png returned from detox getScreenshot function
*/
export async function checkImages(screenshotPath) {
	var image = fs.readFileSync(screenshotPath)
	await (jestExpect(image) as any).toMatchImageSnapshot({
		comparisonMethod: 'ssim',
		failureThreshold: 0.01,
		failureThresholdType: 'percent'})
}

/**
 * Single-source collection for 'open this screen' functions
 * Having multiple functions repeats the line of code, but
 * Have a single file to update if the matchers change (here, vs scattered throughout tests files)
 * And can have a more specific & readable name for each function
*/
 export async function openVeteransCrisisLine() { 
  await element(by.id(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BTN_ID)).tap()
}

export async function openProfile() {
  await element(by.text(CommonE2eIdConstants.PROFILE_TAB_BUTTON_TEXT)).tap() 
}

export async function openSettings() {
  await element(by.text(CommonE2eIdConstants.SETTINGS_ROW_TEXT)).tap() 
}

export async function openMilitaryInformation() {
  await element(by.text(CommonE2eIdConstants.MILITARY_INFORMATION_ROW_TEXT)).tap()
}

export async function openHealth() {
	await element(by.text(CommonE2eIdConstants.HEALTH_TAB_BUTTON_TEXT)).tap() 
}

export async function openBenefits() {
	await element(by.text(CommonE2eIdConstants.BENEFITS_TAB_BUTTON_TEXT)).tap() 
}

/**
 * Going back on android and iOS
*/
export async function backButton() {
  if (device.getPlatform() === 'android') {
    await device.pressBack(); // Android only
  } else {
	await element(by.traits(['button'])).atIndex(0).tap();
  }
}


