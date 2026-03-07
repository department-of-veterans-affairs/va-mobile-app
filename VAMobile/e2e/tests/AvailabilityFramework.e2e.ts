/**
 * AF template-level tests. Verifies AF behavior on each screen template type
 * (ChildTemplate, FeatureLandingTemplate, LargePanel, FullScreenSubtask).
 *
 * Individual feature AF tests are split into domain files: AF_Profile, AF_Home,
 * AF_Health, AF_Benefits, AF_Payments.
 */
import { runTests } from './AFShared'

const AFNavigationNoIndividual = [
  ['ChildTemplate', 'WG_DisabilityRatings', 'Benefits', 'Disability rating'],
  ['FeatureLandingTemplate', 'WG_PersonalInformation', 'Profile', 'Personal information'],
  [
    'LargePanel',
    'WG_HowDoIUpdate',
    'Profile',
    'Personal information',
    'How to update or fix an error in your legal name',
  ],
  ['FullScreenSubtask', 'WG_PreferredName', 'Profile', 'Personal information', 'Preferred name'],
]

describe('Availability Framework', () => {
  for (let x = 0; x < AFNavigationNoIndividual.length; x++) {
    runTests(AFNavigationNoIndividual[x][0], AFNavigationNoIndividual, x)
  }
})
