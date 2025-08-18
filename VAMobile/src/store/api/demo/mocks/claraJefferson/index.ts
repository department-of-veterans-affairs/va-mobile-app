import { featureEnabled } from 'utils/remoteConfig'

const importClaraJeffersonData = () => {
  return [
    import('./profile.json'),
    import('./vaccine.json'),
    import('./labsAndTests.json'),
    import('store/api/demo/mocks/default/notifications.json'),
    import('store/api/demo/mocks/default/contactInformation.json'),
    import('./getAuthorizedServices.json'),
    featureEnabled('cernerTrueForDemo')
      ? import('store/api/demo/mocks/default/getFacilitiesInfoCerner.json')
      : import('store/api/demo/mocks/default/getFacilitiesInfo.json'),
    import('store/api/demo/mocks/default/demographics.json'),
    import('./personalInformation.json'),
    import('store/api/demo/mocks/default/allergies.json'),
    import('store/api/demo/mocks/default/travelPay.json'),
  ]
}

export default importClaraJeffersonData
