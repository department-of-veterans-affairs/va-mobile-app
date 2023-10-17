import { AppointmentLocation } from '../store/api'
import { isIOS } from './platform'

const APPLE_MAPS_BASE_URL = 'https://maps.apple.com/'
const GOOGLE_MAPS_BASE_URL = 'https://www.google.com/maps/dir/'

export const getDirectionsUrl = (location: AppointmentLocation): string => {
  const { name, lat, long } = location
  const destinationString = `${Object.values(location.address || {}).join(' ')}+${name}+${lat},${long}`
  if (isIOS()) {
    const queryString = new URLSearchParams({
      // apply type parameter = m (map)
      t: 'm',
      daddr: destinationString,
    }).toString()
    return `${APPLE_MAPS_BASE_URL}?${queryString}`
  } else {
    const queryString = new URLSearchParams({
      api: '1',
      destination: destinationString,
    }).toString()
    return `${GOOGLE_MAPS_BASE_URL}?${queryString}`
  }
}
