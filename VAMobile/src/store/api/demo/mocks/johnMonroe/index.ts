import { featureEnabled } from 'utils/remoteConfig'

const importJohnMonroeData = () => {
  return [
    featureEnabled('appointmentsTestTime')
      ? import('store/api/demo/mocks/default/appointmentsTestTime.json')
      : import('store/api/demo/mocks/johnMonroe/appointments.json'),
    import('store/api/demo/mocks/johnMonroe/claims.json'),
    import('store/api/demo/mocks/default/profile.json'),
    import('store/api/demo/mocks/johnMonroe/secureMessaging.json'),
    import('store/api/demo/mocks/default/vaccine.json'),
    import('store/api/demo/mocks/default/disabilityRating.json'),
    import('store/api/demo/mocks/default/decisionLetters.json'),
    import('store/api/demo/mocks/default/labsAndTests.json'),
    import('store/api/demo/mocks/default/letters.json'),
    import('store/api/demo/mocks/default/payments.json'),
    import('store/api/demo/mocks/johnMonroe/prescriptions.json'),
    import('store/api/demo/mocks/default/notifications.json'),
    import('store/api/demo/mocks/default/contactInformation.json'),
    import('store/api/demo/mocks/default/getAuthorizedServices.json'),
    featureEnabled('cernerTrueForDemo')
      ? import('store/api/demo/mocks/default/getFacilitiesInfoCerner.json')
      : import('store/api/demo/mocks/default/getFacilitiesInfo.json'),
    import('store/api/demo/mocks/default/demographics.json'),
    import('store/api/demo/mocks/johnMonroe/personalInformation.json'),
    import('store/api/demo/mocks/default/allergies.json'),
  ]
}

export default importJohnMonroeData
