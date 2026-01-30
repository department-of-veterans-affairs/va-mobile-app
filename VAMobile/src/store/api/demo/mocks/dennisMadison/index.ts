import { featureEnabled } from 'utils/remoteConfig'

const importDennisMadisonData = () => {
  return [
    featureEnabled('appointmentsTestTime')
      ? import('./appointmentsTestTime.json')
      : import('store/api/demo/mocks/default/appointments.json'),
    import('store/api/demo/mocks/default/claims.json'),
    import('./profile.json'),
    import('store/api/demo/mocks/default/secureMessaging.json'),
    import('store/api/demo/mocks/default/vaccine.json'),
    import('store/api/demo/mocks/default/disabilityRating.json'),
    import('store/api/demo/mocks/default/decisionLetters.json'),
    import('store/api/demo/mocks/default/labsAndTests.json'),
    import('./letters.json'),
    import('store/api/demo/mocks/default/payments.json'),
    import('store/api/demo/mocks/default/prescriptions.json'),
    import('store/api/demo/mocks/default/notifications.json'),
    import('store/api/demo/mocks/default/contactInformation.json'),
    import('store/api/demo/mocks/default/getAuthorizedServices.json'),
    featureEnabled('cernerTrueForDemo')
      ? import('store/api/demo/mocks/default/getFacilitiesInfoCerner.json')
      : import('store/api/demo/mocks/default/getFacilitiesInfo.json'),
    import('store/api/demo/mocks/default/demographics.json'),
    import('./personalInformation.json'),
    import('store/api/demo/mocks/default/allergies.json'),
  ]
}

export default importDennisMadisonData
