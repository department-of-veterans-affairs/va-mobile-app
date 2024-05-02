import React, { ReactElement } from 'react'

import { LinkingOptions, NavigationState } from '@react-navigation/native'

import { authorizedServicesKeys } from 'api/authorizedServices/queryKeys'
import queryClient from 'api/queryClient'
import { UserAuthorizedServicesData } from 'api/types/AuthorizedServicesData'

import { LoadingComponent } from '../components'

const authorizedServices = queryClient.getQueryData(
  authorizedServicesKeys.authorizedServices,
) as UserAuthorizedServicesData

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
              ViewMessage: 'messages/:messageID',
            },
          },
        },
      },
    },
  },
  // Sets the navigation state for deeply nested screens to ensure navigating backwards works correctly
  getStateFromPath(path) {
    const pathParts = path.split('/').filter(Boolean)
    if (pathParts[0] === 'messages') {
      const hasMessageID = pathParts.length === 2
      return {
        routes: [
          {
            name: 'Tabs',
            state: {
              routes: [
                {
                  name: 'HealthTab',
                  state: {
                    routes: [
                      { name: 'Health' },
                      { name: 'SecureMessaging', params: { activeTab: 0 } },
                      ...(hasMessageID ? [{ name: 'ViewMessage', params: { messageID: pathParts[1] } }] : []),
                    ],
                  },
                },
              ],
            },
          },
        ],
      }
    } else if (pathParts[0] === 'appointments') {
      const hasAppointmentID = pathParts.length === 2
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
                    routes: [
                      { name: 'Health' },
                      { name: 'Appointments' },
                      ...(hasAppointmentID
                        ? [
                            {
                              name: 'UpcomingAppointmentDetails',
                              params: { vetextID: decodeURIComponent(pathParts[1]) },
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ],
            },
          },
        ],
      }
    } else if (pathParts[0] === 'prescriptions') {
      return {
        routes: [
          {
            name: 'Tabs',
            state: {
              routes: [
                {
                  name: 'HealthTab',
                  state: {
                    routes: [{ name: 'Health' }, { name: 'PrescriptionHistory' }],
                  },
                },
              ],
            },
          },
        ],
      }
    } else if (pathParts[0] === 'claims') {
      return {
        routes: [
          {
            name: 'Tabs',
            state: {
              routes: [
                {
                  name: 'BenefitsTab',
                  state: {
                    routes: [
                      { name: 'Benefits' },
                      ...(authorizedServices?.decisionLetters ? [{ name: 'Claims' }] : []),
                      { name: 'ClaimsHistoryScreen' },
                    ],
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
  key: '',
  routes: [],
  routeNames: [],
  type: '',
  stale: false,
}

export const fallback: ReactElement = <LoadingComponent />
