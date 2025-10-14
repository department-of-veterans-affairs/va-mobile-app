import { featureEnabled } from 'utils/remoteConfig'

const importKimberlyWashingtonData = () => {
  return [
    featureEnabled('appointmentsTestTime')
      ? import('store/api/demo/mocks/default/appointmentsTestTime.json')
      : import('store/api/demo/mocks/default/appointments.json'),
    import('store/api/demo/mocks/default/claims.json'),
    import('store/api/demo/mocks/default/profile.json'),
    import('store/api/demo/mocks/default/secureMessaging.json'),
    import('store/api/demo/mocks/default/vaccine.json'),
    import('store/api/demo/mocks/default/disabilityRating.json'),
    import('store/api/demo/mocks/default/decisionLetters.json'),
    import('store/api/demo/mocks/default/labsAndTests.json'),
    import('store/api/demo/mocks/default/letters.json'),
    import('store/api/demo/mocks/default/payments.json'),
    import('store/api/demo/mocks/default/prescriptions.json'),
    import('store/api/demo/mocks/default/notifications.json'),
    import('store/api/demo/mocks/default/contactInformation.json'),
    import('store/api/demo/mocks/kimberlyWashington/getAuthorizedServices.json'),
    featureEnabled('cernerTrueForDemo')
      ? import('store/api/demo/mocks/default/getFacilitiesInfoCerner.json')
      : import('store/api/demo/mocks/default/getFacilitiesInfo.json'),
    import('store/api/demo/mocks/default/demographics.json'),
    import('store/api/demo/mocks/kimberlyWashington/personalInformation.json'),
    import('store/api/demo/mocks/default/allergies.json'),
    import('store/api/demo/mocks/default/travelPay.json'),
    import('store/api/demo/mocks/default/medicalCopays.json'),
    import('store/api/demo/mocks/default/debts.json'),
  ]
}

export default importKimberlyWashingtonData
