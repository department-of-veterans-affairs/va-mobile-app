import { expect, device, by, element, waitFor } from 'detox'
import { loginToDemoMode, checkImages, resetInAppReview} from './utils'
import { setTimeout } from "timers/promises"

const { exec } = require('child_process')
var appTabs = ['Home', 'Benefits', 'Health', 'Payments']

var navigationDic = {
	/*'Home': [['Contact VA', 'Contact VA'],
	[['Profile', 'Personal information'], 'Personal information'],
	[['Profile', 'Contact information'], 'Contact information'],
	[['Profile', 'Military information'], 'Military information'],
	[['Profile', 'Settings'], 'Settings'],
	[['Profile', 'Settings', 'Manage account'], 'To confirm or update your sign-in email, go to the website where you manage your account information.'],
	[['Profile', 'Settings', 'Notifications'], 'Notifications']],
	*/'Benefits': [['Disability rating', 'Disability rating'],
	//['Claims', 'Claims'],
	//[['Claims', 'Claims history'], 'Claims history'],
	//[['Claims', 'Claims history', 'Closed'], 'Your closed claims and appeals'],
	//[['Claims', 'Claims history', 'Active'], 'Your active claims and appeals'],
	//[['Claims', 'Claims history', 'Submitted July 20, 2021'], 'Claim details'],
	//[['Claims', 'Claims history', 'Claim for compensation updated on May 05, 2021', 'Review file requests'], 'File requests'],
	//[['Claims', 'Claims history', 'Claim for compensation updated on May 05, 2021', 'Review file requests', 'Request 2'], 'Request 2'],
	//[['Claims', 'Claims history', 'Submitted July 20, 2021', 'Details'], 'Claim type'],
	[['Claims', 'Claims history', 'Submitted July 17, 2008'], 'Appeal details'],
	[['Claims', 'Claims history', 'Submitted July 17, 2008', 'Issues'], 'Currently on appeal'],
	[['Claims', 'Claim letters'], 'Claim letters']],
	/*['VA letters and documents', 'Letters'],
	[['VA letters and documents', 'Review letters'], 'Review letters'],
	[['VA letters and documents', 'Review letters', 'Benefit summary and service verification letter'], 'Letter details']],
	'Health': [['Appointments', 'Appointments'],
	[['Appointments', 'Outpatient Clinic'], 'Community care'],
	[['Appointments', 'Past'], 'Past 3 months'],
	[['Appointments', 'Past', 'Claim exam'], 'Claim exam'],
	['Messages', 'Messages'],
	[['Messages', 'Medication: Naproxen side effects'], 'Review message'],
	[['Messages', 'Folders'], 'My folders'],
	[['Messages', 'Drafts (3)'], 'Drafts'],
	['Prescriptions', 'Prescriptions'],
	[['Prescriptions', 'Get prescription details'], 'ACETAMINOPHEN 325MG TAB'],
	[['Prescriptions', 'Pending (8)'], 'Pending refills (8)'],
	[['Prescriptions', 'Tracking (3)'], 'Refills with tracking information (3)'],
	['V\ufeffA vaccine records', 'VA vaccines'],
	[['V\ufeffA vaccine records', 'January 14, 2021'], 'COVID-19 vaccine']],
	'Payments': [['VA payment history', 'History'],
	[['VA payment history', 'Regular Chapter 31'], 'Regular Chapter 31'],
	['Direct deposit information', 'Direct deposit']]*/
}

var featureID = {
	'Home': 'homeScreenID',
	'Contact VA': 'homeScreenID',
	'Personal information': 'profileID',
	'Contact information': 'profileID',
	'Military information': 'profileID',
	'Settings': 'profileID',
	'Manage account': 'settingsID',
	'Notifications': 'settingsID',
	'Benefits': 'benefitsTestID',
	'Submitted July 20, 2021': 'claimsHistoryID',
	'Submitted January 01, 2021': 'claimsHistoryID',
	'Submitted July 17, 2008': 'claimsHistoryID',
	'Review file requests': 'claimStatusDetailsID',
	'Request 2': 'fileRequestPageTestID',
	'Review letters': 'lettersPageID',
	'Health': 'healthCategoryTestID',
	'Appointments': 'appointmentsTestID',
	'Outpatient Clinic': 'appointmentsTestID',
	'Claim exam': 'appointmentsTestID',
	'Medication: Naproxen side effects': 'messagesTestID',
	'Drafts (3)': 'messagesTestID',
	'Payments': 'paymentsID',	
}

var scrollID
var textResized

export const NavigationE2eConstants = {
	DARK_MODE_OPTIONS: device.getPlatform() === 'ios' ? 'xcrun simctl ui booted appearance dark' : 'adb shell "cmd uimode night yes"',
	LIGHT_MODE_OPTIONS: device.getPlatform() === 'ios' ? 'xcrun simctl ui booted appearance light' : 'adb shell "cmd uimode night no"',
	FONT_RESIZING_LARGEST: device.getPlatform() === 'ios' ? 'xcrun simctl ui booted content_size extra-extra-extra-large' : 'adb shell settings put system font_scale 1.30',
	DISPLAY_RESIZING_LARGEST: device.getPlatform() === 'android' ? 'adb shell wm density 728': '',
	FONT_RESIZING_RESET: device.getPlatform() === 'ios' ? 'xcrun simctl ui booted content_size medium' : 'adb shell settings put system font_scale 1.00',
	DISPLAY_RESIZING_RESET: 'adb shell wm density reset'
}

const accessibilityOption = async (key, navigationDicValue, accessibilityFeatureType: string | null) => {
	var navigationArray = navigationDicValue
	if (accessibilityFeatureType === 'landscape') {
		await device.setOrientation('landscape')
		await expect(element(by.text(navigationDicValue[1])).atIndex(0)).toExist()
		var feature = await device.takeScreenshot(navigationDicValue[1])
		checkImages(feature)
		await device.setOrientation('portrait')
	} else if(accessibilityFeatureType == 'darkMode') {
		exec(NavigationE2eConstants.DARK_MODE_OPTIONS, (error) => {
			if (error) {
				console.error(`exec error: ${error}`);
				return;
			}
		})
		await setTimeout(2000)
		await expect(element(by.text(navigationDicValue[1])).atIndex(0)).toExist()
		var feature = await device.takeScreenshot(navigationDicValue[1])
		checkImages(feature)
	} else if(accessibilityFeatureType === 'textResizing') {
		exec(NavigationE2eConstants.FONT_RESIZING_LARGEST, (error) => {
			if (error) {
				console.error(`exec error: ${error}`);
				return;
			}
		})
		if(device.getPlatform() === 'android') {
			textResized = true
			exec(NavigationE2eConstants.DISPLAY_RESIZING_LARGEST, (error) => {
				if (error) {
					console.error(`exec error: ${error}`);
					return;
				}
			})
			await setTimeout(2000)
			await loginToDemoMode()
			await navigateToPage(key, navigationDicValue)
		}

		await expect(element(by.text(navigationDicValue[1])).atIndex(0)).toExist()
		var feature = await device.takeScreenshot(navigationDicValue[1])
		checkImages(feature)

		if(device.getPlatform() === 'ios') {
			await element(by.id(key)).atIndex(0).tap()
		}
	} else {
		if(navigationArray[1] === 'Claim type' || navigationArray[1] === 'Prescriptions') {
			await resetInAppReview()
		}
		await navigateToPage(key, navigationDicValue)
		await expect(element(by.text(navigationArray[1])).atIndex(0)).toExist()
		for (let i = 0; i < appTabs.length; i++) {
			if(appTabs[i] != key) {
				await element(by.text(appTabs[i])).tap()
				await element(by.text(key)).tap()
				await expect(element(by.text(navigationArray[1])).atIndex(0)).toExist()
			}
		}
	}
}

const navigateToPage = async (key, navigationDicValue) => {
	await element(by.id(key)).tap()
	var navigationArray = navigationDicValue
	if (typeof navigationArray[0] === 'string') {
		if(navigationArray[0] in featureID) {
				scrollID = featureID[navigationArray[0]]
				await waitFor(element(by.text(navigationArray[0]))).toBeVisible().whileElement(by.id(scrollID)).scroll(50, 'down')
		} else if (key in featureID) {
			scrollID = featureID[key]
			await waitFor(element(by.text(navigationArray[0]))).toBeVisible().whileElement(by.id(scrollID)).scroll(50, 'down')
		}
			await element(by.text(navigationArray[0])).atIndex(0).tap()
	} else {
		var subNavigationArray = navigationArray[0]
		for(let k = 0; k < subNavigationArray.length-1; k++) {
			if (subNavigationArray[k] === 'Review file requests') {
				await waitFor(element(by.text('Review file requests'))).toBeVisible().whileElement(by.id('ClaimDetailsScreen')).scroll(100, 'down')
			} else if (subNavigationArray[k] === 'Submitted July 17, 2008') {
					await waitFor(element(by.text('Submitted July 17, 2008'))).toBeVisible(). whileElement(by.id('claimsHistoryID')).scroll(100, 'down')
			}
			
			if (k == 0 && key in featureID) {
				scrollID = featureID[key]
				await waitFor(element(by.text(subNavigationArray[k]))).toBeVisible().whileElement(by.id(scrollID)).scroll(50, 'down')
			}

			if (subNavigationArray[k] in featureID) {
				scrollID = featureID[subNavigationArray[k]]
				await waitFor(element(by.text(subNavigationArray[k]))).toBeVisible().whileElement(by.id(scrollID)).scroll(50, 'down')
			}
			await element(by.text(subNavigationArray[k])).tap()
		}

		if (subNavigationArray.slice(-1)[0] === 'Review file requests') {
			await waitFor(element(by.text('Review file requests'))).toBeVisible().whileElement(by.id('ClaimDetailsScreen')).scroll(100, 'down')
		} else if (subNavigationArray.slice(-1)[0] === 'Get prescription details') {
			await waitFor(element(by.label('ADEFOVIR DIPIVOXIL 10MG TAB.'))).toBeVisible().whileElement(by.id('PrescriptionHistory')).scroll(50, 'down')
		} else if (subNavigationArray.slice(-1)[0] === 'Submitted July 17, 2008') {
					await waitFor(element(by.text('Submitted July 17, 2008'))).toBeVisible(). whileElement(by.id('claimsHistoryID')).scroll(100, 'down')
		}

		if (subNavigationArray.slice(-1)[0] in featureID) {
			scrollID = featureID[subNavigationArray.slice(-1)[0]]
			await waitFor(element(by.text(subNavigationArray.slice(-1)[0]))).toBeVisible().whileElement(by.id(scrollID)).scroll(50, 'down')
		}
		await element(by.text(subNavigationArray.slice(-1)[0])).atIndex(0).tap()
	}
}

beforeAll(async () => {
	await loginToDemoMode()
})

afterEach(async () => {
	exec(NavigationE2eConstants.LIGHT_MODE_OPTIONS, (error) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
	})

	exec(NavigationE2eConstants.FONT_RESIZING_RESET, (error) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
	})
	if(device.getPlatform() === 'android') {
		exec(NavigationE2eConstants.DISPLAY_RESIZING_RESET, (error) => {
			if (error) {
				console.error(`exec error: ${error}`);
				return;
			}
		})
		if(textResized) {
			textResized = false
			await loginToDemoMode()
		}
	}
})

describe('Navigation', () => {
	for(const [key, value] of Object.entries(navigationDic)) {
		for (let j = 0; j < value.length; j++) {
			var nameArray = value[j]
			if (nameArray[1] === 'To confirm or update your sign-in email, go to the website where you manage your account information.') {
				it('verify navigation for: Manage Account', async () => {
					await accessibilityOption(key, value[j], null)
				})
	
				it('verify landscape mode for: Manage Account', async () => {
					await accessibilityOption(key, value[j], 'landscape')
				})
	
				it('verify dark mode for: Manage Account', async () => {
					await accessibilityOption(key, value[j], 'darkMode')
				})
				it('verify text resizing for: Manage Account', async () => {
					await accessibilityOption(key, value[j], 'textResizing')
				})
			} else {
				it('verify navigation for: ' + nameArray[1], async () => {
					await accessibilityOption(key, value[j], null)
				})

				if(nameArray[1] !== 'Community care' && nameArray[1] !== 'Claim exam') {
					it('verify landscape mode for: ' + nameArray[1], async () => {
						await accessibilityOption(key, value[j], 'landscape')
					})

					it('verify dark mode for: ' + nameArray[1], async () => {
						await accessibilityOption(key, value[j], 'darkMode')
					})
					it('verify text resizing for: ' + nameArray[1], async () => {
						if(device.getPlatform() === 'ios') {
							await accessibilityOption(key, value[j], 'textResizing')
						}
					})
				}
			}
		}
	}
})
