import { featureEnabled } from 'utils/remoteConfig'

const importBenjaminAdamsData = () => {
  return [
    featureEnabled('appointmentsTestTime') ? import('./appointmentsTestTime.json') : import('./appointments.json'),
    import('./claims.json'),
    import('./profile.json'),
    import('./secureMessaging.json'),
    import('./vaccine.json'),
    import('./disabilityRating.json'),
    import('./decisionLetters.json'),
    import('./labsAndTests.json'),
    import('store/api/demo/mocks/default/letters.json'),
    import('./payments.json'),
    import('./prescriptions.json'),
    import('store/api/demo/mocks/default/notifications.json'),
    import('store/api/demo/mocks/default/contactInformation.json'),
    import('store/api/demo/mocks/default/getAuthorizedServices.json'),
    featureEnabled('cernerTrueForDemo')
      ? import('store/api/demo/mocks/default/getFacilitiesInfoCerner.json')
      : import('store/api/demo/mocks/default/getFacilitiesInfo.json'),
    import('store/api/demo/mocks/default/demographics.json'),
    import('./personalInformation.json'),
    import('./allergies.json'),
  ]
}

export default importBenjaminAdamsData
