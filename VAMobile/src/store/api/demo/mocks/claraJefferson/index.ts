import { featureEnabled } from 'utils/remoteConfig'

const importClaraJeffersonData = () => {
  return [
    import('./profile.json'),
    import('./vaccine.json'),
    import('./labsAndTests.json'),
    import('./notifications.json'),
    import('./contactInformation.json'),
    import('./getAuthorizedServices.json'),
    featureEnabled('cernerTrueForDemo') ? import('./getFacilitiesInfoCerner.json') : import('./getFacilitiesInfo.json'),
    import('./demographics.json'),
    import('./personalInformation.json'),
    import('./allergies.json'),
  ]
}

export default importClaraJeffersonData
