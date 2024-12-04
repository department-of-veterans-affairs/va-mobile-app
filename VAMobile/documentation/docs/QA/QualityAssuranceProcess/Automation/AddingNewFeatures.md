---
title: Adding new e2e tests to Availability Framework and Nav
sidebar_position: 1
---

# Adding new e2e tests to Availability Framework and Navigation

## Adding a new e2e test to navigation (Note: The only things tested are places in the app where you have the ability to navigate through the bottom navigation bar)
1. Open the Navigation.e2e test
2. Add the necessary information to navigationDic.  The dictionary is broken down into the 4 sections found in the bottom navigation bar: Home, Health, Benefits, and Payments.  Add new tests under the appropriate key value.  
	1. The array follows the following format: [a, b, c]
		1. For single e2e tests: string of name of the test.  Ex: ‘DisabilityRatings.e2e’. For multiple e2e tests: array of strings with the names of the tests. Ex: [‘Claims.e2e’, ‘Appeals.e2e’]
		2. String/array of strings that tells detox how to navigate to your feature. 
			- Notes:
				- The test will always navigate to the key value in which the array is in (Home, Health, Benefits, and Payments) first
				- If scrolling is required for detox to click on something use the featureID dictionary. It follows the following format: 'string of what needs to be clicked on (should match what is in navigationDic): testID for the scrollView being utilized'
			- Ex: DisabilityRatings (Benefits \> Disability rating) is ‘Disability rating’
			- Ex: Claim details (Benefits \> Claims \> Claims history \> 'name of claim') is an array of strings of the following: ['Claims', 'Claims history', 'Received July 20, 2021']
		3. Name of the heading for the page. This is what the tests look for to verify it is in the right location.

## Adding a new e2e test to Availability Framework
1. Open the AvailabilityFramework.e2e test
2. Add the new waygate to AFNavigationForIndividual. The array has the following format: [String value indicating the e2e test covered, String value of the waygate name, string of navigation value 1, string of navigation value 2]
	- String of navigation values <number\> tells detox how to navigate to the feature starting from the Home screen. 
		- Notes:
			- If scrolling is required for detox to click on something add an else if (featureNavigationArray[j] === 'string of navigation value') statement to the navigateToFeature function in utils.ts
			- If you are running into issues with inAppReview add your waygate to the if statement found in enableAF
		- Ex: Gender identity waygate (Home \> Profile \> Personal information \> Gender identity) array: ['PersonalInformationScreen.e2e', 'WG_GenderIdentity', 'Profile', 'Personal information', 'Gender identity’]