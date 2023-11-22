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
      Tabs: {
        screens: {
          HealthTab: {
            screens: {
              UpcomingAppointmentDetails: 'appointments/:vetextID',
              ViewMessageScreen: 'messages/:messageID',
            },
          },
        },
      },
    },
  },
  // Sets the navigation state for deeply nested screens to ensure navigating backwards works correctly
  getStateFromPath(path) {
    const pathParts = path.split('/')
    if (pathParts[0] === 'messages' && pathParts.length === 2) {
      return {
        routes: [
          {
            name: 'Tabs',
            state: {
              routes: [
                {
                  name: 'HealthTab',
                  state: {
                    routes: [{ name: 'Health' }, { name: 'SecureMessaging' }, { name: 'ViewMessageScreen', params: { messageID: pathParts[1] } }],
                  },
                },
              ],
            },
          },
        ],
      }
    } else if (pathParts[0] === 'appointments' && pathParts.length === 2) {
      return {
        routes: [
          {
            name: 'Tabs',
            state: {
              routes: [
                {
                  name: 'HealthTab',
                  state: {
                    // The ID from the notification payload is sent encoded, so it needs to be decoded
                    routes: [{ name: 'Health' }, { name: 'Appointments' }, { name: 'UpcomingAppointmentDetails', params: { vetextID: decodeURIComponent(pathParts[1]) } }],
                  },
                },
              ],
            },
          },
        ],
      }
    }
  },
}

export const state: NavigationState = {
  index: 0,
  isTransitioning: false,
  key: '',
  routes: [],
}

export const fallback: ReactElement = <LoadingComponent />
