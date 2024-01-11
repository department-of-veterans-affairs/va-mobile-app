import {enableAF, verifyAF } from './utils'

var AFNavigation = [
  ['ChildTemplate', 'WG_DisabilityRatings', 'Benefits', 'Disability rating'],
  ['FeatureLandingTemplate', 'WG_PersonalInformation', 'Profile', 'Personal information'],
  ['LargePanel', 'WG_HowDoIUpdate', 'Profile', 'Personal information', 'How to update or fix an error in your legal name'],
  ['FullScreenSubtask', 'WG_PreferredName', 'Profile', 'Personal information', 'Preferred name'],
  ['CategoryLanding', 'WG_Health', 'Health']
 ]

describe('Availability Framework', () => {
  for (let x = 0; x < AFNavigation.length; x++) {
    it('should verify AF use case 1 for: ' + AFNavigation[x][0], async() => {
      if(AFNavigation[x][1] !== 'WG_Health') {
        await enableAF(AFNavigation[x][1], 'DenyAccess')
        await verifyAF(AFNavigation[x], 'DenyAccess')
      }
    })

    it('should verify AF use case 2 for: ' + AFNavigation[x][0], async() => {
      await enableAF(AFNavigation[x][1], 'DenyContent')
      await verifyAF(AFNavigation[x], 'DenyContent')
    })

    it('should verify AF use case 2 Update available for: ' + AFNavigation[x][0], async() => {
      await enableAF(AFNavigation[x][1], 'DenyContent', true)
      await verifyAF(AFNavigation[x], 'DenyContent', true)
    })
  }

})