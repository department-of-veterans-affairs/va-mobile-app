import { AppointmentLocation } from '../store/api'
import { isIOS } from './platform'

const APPLE_MAPS_BASE_URL = 'https://maps.apple.com/'
const GOOGLE_MAPS_BASE_URL = 'https://www.google.com/maps/dir/'

export const getDirectionsUrl = (location: AppointmentLocation): string => {
  const { address, name, lat, long } = location
  const addressString = Object.values(address || {}).join(' ')

  if (isIOS()) {
    const queryString = new URLSearchParams({
      // apply type parameter = m (map)
      t: 'm',
      daddr: `${addressString}+${name}+${lat},${long}`,
    }).toString()
    return `${APPLE_MAPS_BASE_URL}?${queryString}`
  } else {
    const queryString = new URLSearchParams({
      api: '1',
      destination: addressString || `${lat},${long}`,
    }).toString()
    return `${GOOGLE_MAPS_BASE_URL}?${queryString}`
  }
}
