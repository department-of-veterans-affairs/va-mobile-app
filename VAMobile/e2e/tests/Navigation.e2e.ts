import { expect, device, by, element, waitFor } from 'detox'
import { loginToDemoMode} from './utils'

var appTabs = ['Home', 'Benefits', 'Health', 'Payments']

var navigationDic = {
	'Home': [['Contact VA', 'Contact VA'],
	[['Profile', 'Personal information'], 'Personal information'],
	[['Profile', 'Contact information'], 'Contact information'],
	[['Profile', 'Military information'], 'Military information'],
	[['Profile', 'Settings'], 'Settings'],
	[['Profile', 'Settings', 'Manage account'], 'To confirm or update your sign-in email, go to the website where you manage your account information.'],
	[['Profile', 'Settings', 'Notifications'], 'Notifications']],
	'Benefits': [['Disability rating', 'Disability rating'],
	['Claims', 'Claims',],
	[['Claims', 'Claims history'], 'Claims history'],
	[['Claims', 'Claims history', 'Closed'], 'Your closed claims and appeals'],
	[['Claims', 'Claims history', 'Active'], 'Your active claims and appeals'],
	[['Claims', 'Claims history', 'Submitted July 20, 2021'], 'Claim details'],
	[['Claims', 'Claims history', 'Submitted January 01, 2021', 'Review file requests'], 'File requests'],
	[['Claims', 'Claims history', 'Submitted January 01, 2021', 'Review file requests', 'Request 2'], 'Request 2'],
	[['Claims', 'Claims history', 'Submitted July 20, 2021', 'Details'], 'Claim type'],
	[['Claims', 'Claims history', 'Submitted June 12, 2008'], 'Appeal details'],
	[['Claims', 'Claims history', 'Submitted June 12, 2008', 'Issues'], 'Currently on appeal'],
	[['Claims', 'Claim letters'], 'Claim letters'],
	['VA letters and documents', 'Letters'],
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
	[['Prescriptions', 'Tracking (5)'], 'Refills with tracking information (5)'],
	['V\ufeffA vaccine records', 'VA vaccines'],
	[['V\ufeffA vaccine records', 'January 14, 2021'], 'COVID-19 vaccine']],
	'Payments': [['VA payment history', 'History'],
	[['VA payment history', 'Regular Chapter 31'], 'Regular Chapter 31'],
	['Direct deposit information', 'Direct deposit']]
}

const checkHierachy = async (tabName, categoryName, featureHeaderName) => {
	if (categoryName === 'Review file requests') {
		await waitFor(element(by.text('Review file requests'))).toBeVisible().whileElement(by.id('ClaimDetailsScreen')).scroll(100, 'down')
	} else if (categoryName === 'Get prescription details') {
		await waitFor(element(by.label('ADEFOVIR DIPIVOXIL 10MG TAB.'))).toBeVisible().whileElement(by.id('PrescriptionHistory')).scroll(50, 'down')
	}
	await element(by.text(categoryName)).atIndex(0).tap()
	await expect(element(by.text(featureHeaderName)).atIndex(0)).toExist()
	for (let i = 0; i < appTabs.length; i++) {
		if(appTabs[i] != tabName) {
			await element(by.text(appTabs[i])).tap()
			await element(by.text(tabName)).tap()
			await expect(element(by.text(featureHeaderName)).atIndex(0)).toExist()
		}
	}
	await element(by.id(tabName)).atIndex(0).tap()
}

beforeAll(async () => {
	await loginToDemoMode()
})

describe('Navigation', () => {
	for(const [key, value] of Object.entries(navigationDic)) {
		for (let j = 0; j < value.length; j++) {
			var nameArray = value[j]
			it('should check the navigation for: ' + nameArray[1], async () => {
				var navigationArray = value[j]
				if(navigationArray[1] === 'Currently on appeal') {
					await device.launchApp({ newInstance: true })
					await loginToDemoMode()
				}
				await element(by.id(key)).atIndex(0).tap()
				if (typeof navigationArray[0] === 'string') {
					await checkHierachy(key, navigationArray[0], navigationArray[1])
				} else {
					var subNavigationArray = navigationArray[0]
					for(let k = 0; k < subNavigationArray.length-1; k++) {
						if (subNavigationArray[k] === 'Review file requests') {
							await waitFor(element(by.text('Review file requests'))).toBeVisible().whileElement(by.id('ClaimDetailsScreen')).scroll(100, 'down')
						}
						await element(by.text(subNavigationArray[k])).tap()
					}
					await checkHierachy(key, subNavigationArray.slice(-1)[0], navigationArray[1])
				}
			})
		}
	}
})
