import { VaccineListData, VaccineLocationData } from '../types'

/**
 * Type denoting the demo data store
 */
export type VaccineDemoStore = {
  '/v0/health/immunizations': VaccineListData
  '/v0/health/locations/I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000': VaccineLocationData
  '/v0/health/locations/I2-2FPCKUIXVR7RJLLG34XVWGZERM000000': VaccineLocationData
}

/**
 * Type to define the mock returns to keep type safety
 */
export type VaccineDemoReturnTypes = undefined | VaccineListData | VaccineLocationData
