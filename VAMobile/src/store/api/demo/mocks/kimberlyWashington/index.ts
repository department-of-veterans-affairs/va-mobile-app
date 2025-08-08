import { featureEnabled } from 'utils/remoteConfig'

const importKimberlyWashingtonData = () => {
  return [
    featureEnabled('appointmentsTestTime') ? import('./appointmentsTestTime.json') : import('./appointments.json'),
    import('./appointments.json'),
    import('./claims.json'),
    import('./profile.json'),
    import('./secureMessaging.json'),
    import('./vaccine.json'),
    import('./disabilityRating.json'),
    import('./decisionLetters.json'),
    import('./labsAndTests.json'),
    import('./letters.json'),
    import('./payments.json'),
    import('./prescriptions.json'),
    import('./notifications.json'),
    import('./contactInformation.json'),
    import('./getAuthorizedServices.json'),
    featureEnabled('cernerTrueForDemo') ? import('./getFacilitiesInfoCerner.json') : import('./getFacilitiesInfo.json'),
    import('./demographics.json'),
    import('./personalInformation.json'),
    import('./allergies.json'),
  ]
}

export default importKimberlyWashingtonData
