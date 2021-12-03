import { LinkingOptions } from '@react-navigation/native'
import { LoadingComponent } from '../components'
import { NavigationState } from 'react-navigation'
import React, { ReactElement } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const linking: LinkingOptions<any> = {
  prefixes: [
    /* your linking prefixes */
    'vamobile://',
  ],
  config: {
    /* configuration for matching screens with paths */
    screens: {
      Appointments: 'appointments/:id',
    },
  },
}

export const state: NavigationState = {
  index: 0,
  isTransitioning: false,
  key: '',
  routes: [],
}

export const fallback: ReactElement = <LoadingComponent />
