import { AppointmentLocation } from '../store/api'
import { isIOS } from './platform'
import qs from 'querystringify'

const APPLE_MAPS_BASE_URL = 'https://maps.apple.com/'
const GOOGLE_MAPS_BASE_URL = 'https://www.google.com/maps/dir/'

export const getDirectionsUrl = (location: AppointmentLocation): string => {
  const { name, lat, long } = location
  const destinationString = `${name} ${lat},${long}`
  if (isIOS()) {
    const q = {
      t: 'm',
      daddr: destinationString,
    }
    return `${APPLE_MAPS_BASE_URL}?${qs.stringify(q)}`
  } else {
    const q = {
      api: 1,
      destination: destinationString,
    }
    return `${GOOGLE_MAPS_BASE_URL}?${qs.stringify(q)}`
  }
}
