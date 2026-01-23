import { linking } from './linking'

describe('linking', () => {
  describe('getStateFromPath', () => {
    describe('track-claims/your-claim-letters/link', () => {
      it('should navigate to ClaimLettersScreen when path is track-claims/your-claim-letters/link', () => {
        const path = '/track-claims/your-claim-letters/link'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toEqual({
          routes: [
            {
              name: 'Tabs',
              state: {
                routes: [
                  {
                    name: 'BenefitsTab',
                    state: {
                      routes: [{ name: 'Benefits' }, { name: 'ClaimLettersScreen' }],
                    },
                  },
                ],
              },
            },
          ],
        })
      })

      it('should navigate to ClaimLettersScreen without leading slash', () => {
        const path = 'track-claims/your-claim-letters/link'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toEqual({
          routes: [
            {
              name: 'Tabs',
              state: {
                routes: [
                  {
                    name: 'BenefitsTab',
                    state: {
                      routes: [{ name: 'Benefits' }, { name: 'ClaimLettersScreen' }],
                    },
                  },
                ],
              },
            },
          ],
        })
      })

      it('should not match track-claims without your-claim-letters', () => {
        const path = '/track-claims'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toBeUndefined()
      })

      it('should not match partial path', () => {
        const path = '/track-claims/your-claim'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toBeUndefined()
      })

      it('should not match without /link suffix', () => {
        const path = '/track-claims/your-claim-letters'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toBeUndefined()
      })
    })

    describe('claimLetters (legacy path)', () => {
      it('should navigate to ClaimLettersScreen when path is claimLetters', () => {
        const path = '/claimLetters'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toEqual({
          routes: [
            {
              name: 'Tabs',
              state: {
                routes: [
                  {
                    name: 'BenefitsTab',
                    state: {
                      routes: [{ name: 'Benefits' }, { name: 'ClaimLettersScreen' }],
                    },
                  },
                ],
              },
            },
          ],
        })
      })
    })

    describe('my-health/appointments', () => {
      it('should navigate to Appointments tab when path is my-health/appointments', () => {
        const path = '/my-health/appointments'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toEqual({
          routes: [
            {
              name: 'Tabs',
              state: {
                routes: [
                  {
                    name: 'HealthTab',
                    state: {
                      routes: [{ name: 'Health' }, { name: 'Appointments', params: { tab: 0 } }],
                    },
                  },
                ],
              },
            },
          ],
        })
      })

      it('should navigate to past Appointments when path is my-health/appointments/past', () => {
        const path = '/my-health/appointments/past'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toEqual({
          routes: [
            {
              name: 'Tabs',
              state: {
                routes: [
                  {
                    name: 'HealthTab',
                    state: {
                      routes: [{ name: 'Health' }, { name: 'Appointments', params: { tab: 1 } }],
                    },
                  },
                ],
              },
            },
          ],
        })
      })
    })

    describe('appointments with ID', () => {
      it('should navigate to UpcomingAppointmentDetails with decoded ID', () => {
        const encodedID = 'some%20encoded%20id'
        const path = `/appointments/${encodedID}`
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toEqual({
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
                        { name: 'Appointments' },
                        {
                          name: 'UpcomingAppointmentDetails',
                          params: { vetextID: 'some encoded id' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        })
      })

      it('should navigate to Appointments without ID', () => {
        const path = '/appointments'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toEqual({
          routes: [
            {
              name: 'Tabs',
              state: {
                routes: [
                  {
                    name: 'HealthTab',
                    state: {
                      routes: [{ name: 'Health' }, { name: 'Appointments' }],
                    },
                  },
                ],
              },
            },
          ],
        })
      })
    })

    describe('messages', () => {
      it('should navigate to ViewMessage with messageID', () => {
        const messageID = '123456'
        const path = `/messages/${messageID}`
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toEqual({
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
                        { name: 'ViewMessage', params: { messageID: '123456' } },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        })
      })

      it('should navigate to SecureMessaging without messageID', () => {
        const path = '/messages'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toEqual({
          routes: [
            {
              name: 'Tabs',
              state: {
                routes: [
                  {
                    name: 'HealthTab',
                    state: {
                      routes: [{ name: 'Health' }, { name: 'SecureMessaging', params: { activeTab: 0 } }],
                    },
                  },
                ],
              },
            },
          ],
        })
      })
    })

    describe('pastAppointments', () => {
      it('should navigate to past Appointments tab', () => {
        const path = '/pastAppointments'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toEqual({
          routes: [
            {
              name: 'Tabs',
              state: {
                routes: [
                  {
                    name: 'HealthTab',
                    state: {
                      routes: [{ name: 'Health' }, { name: 'Appointments', params: { tab: 1 } }],
                    },
                  },
                ],
              },
            },
          ],
        })
      })
    })

    describe('prescriptions', () => {
      it('should navigate to PrescriptionHistory', () => {
        const path = '/prescriptions'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toEqual({
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
        })
      })
    })

    describe('claims', () => {
      it('should navigate to ClaimsHistoryScreen', () => {
        const path = '/claims'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toEqual({
          routes: [
            {
              name: 'Tabs',
              state: {
                routes: [
                  {
                    name: 'BenefitsTab',
                    state: {
                      routes: [{ name: 'Benefits' }, { name: 'ClaimsHistoryScreen' }],
                    },
                  },
                ],
              },
            },
          ],
        })
      })
    })

    describe('copays', () => {
      it('should navigate to Copays', () => {
        const path = '/copays'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toEqual({
          routes: [
            {
              name: 'Tabs',
              state: {
                routes: [
                  {
                    name: 'PaymentsTab',
                    state: {
                      routes: [{ name: 'Payments' }, { name: 'Copays' }],
                    },
                  },
                ],
              },
            },
          ],
        })
      })
    })

    describe('debts', () => {
      it('should navigate to Debts', () => {
        const path = '/debts'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toEqual({
          routes: [
            {
              name: 'Tabs',
              state: {
                routes: [
                  {
                    name: 'PaymentsTab',
                    state: {
                      routes: [{ name: 'Payments' }, { name: 'Debts' }],
                    },
                  },
                ],
              },
            },
          ],
        })
      })
    })

    describe('unknown paths', () => {
      it('should return undefined for unknown paths', () => {
        const path = '/unknown/path'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toBeUndefined()
      })

      it('should return undefined for empty path', () => {
        const path = ''
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toBeUndefined()
      })

      it('should return undefined for root path', () => {
        const path = '/'
        const state = linking.getStateFromPath?.(path, linking.config as any)

        expect(state).toBeUndefined()
      })
    })
  })

  describe('prefixes', () => {
    it('should include all necessary URL prefixes', () => {
      expect(linking.prefixes).toContain('vamobile://')
      expect(linking.prefixes).toContain('https://staging.va.gov')
      expect(linking.prefixes).toContain('https://www.va.gov')
      expect(linking.prefixes).toContain('https://va.gov')
    })
  })

  describe('config', () => {
    it('should map ClaimLettersScreen to claimLetters path', () => {
      const config = linking.config as any
      expect(config?.screens?.Tabs?.screens?.BenefitsTab?.screens?.ClaimLettersScreen).toBe('claimLetters')
    })

    it('should map UpcomingAppointmentDetails with parameter', () => {
      const config = linking.config as any
      expect(config?.screens?.Tabs?.screens?.HealthTab?.screens?.UpcomingAppointmentDetails).toBe(
        'appointments/:vetextID',
      )
    })

    it('should map ViewMessage with parameter', () => {
      const config = linking.config as any
      expect(config?.screens?.Tabs?.screens?.HealthTab?.screens?.ViewMessage).toBe('messages/:messageID')
    })
  })
})