import React from 'react'

import { screen } from '@testing-library/react-native'
import { waitFor } from '@testing-library/react-native'

import { authorizedServicesKeys } from 'api/authorizedServices/queryKeys'
import AllergyListScreen from 'screens/HealthScreen/Allergies/AllergyList/AllergyListScreen'
import * as api from 'store/api'
import { context, mockNavProps, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

jest.mock('utils/remoteConfig')

context('AllergyListScreen', () => {
  const allergyData = [
    {
      id: '4-1abLZzsevfVnWK',
      type: 'allergy_intolerance',
      attributes: {
        resourceType: 'AllergyIntolerance',
        type: 'allergy',
        clinicalStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        category: ['medication'],
        code: {
          coding: [
            {
              system: 'http://hl7.org/fhir/ndfrt',
              code: 'N0000008048',
              display: 'Sulfonamides',
            },
          ],
          text: 'Sulfonamides',
        },
        recordedDate: '2019-03-12T16:30:00Z',
        patient: {
          reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/1013956965V299908',
          display: 'DAMASO SUPNICK',
        },
        notes: [
          {
            authorReference: {
              reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgdlF9vV',
              display: 'Dr. Alicia629 Ureña88 MD',
            },
            time: '2019-03-12T16:30:00Z',
            text: 'Sulfonamides',
          },
        ],
        recorder: {
          reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgdlF9vV',
          display: 'Dr. Alicia629 Ureña88 MD',
        },
        reactions: [],
      },
    },
    {
      id: '4-1wYbwqxtod74iS',
      type: 'allergy_intolerance',
      attributes: {
        resourceType: 'AllergyIntolerance',
        type: 'allergy',
        clinicalStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        category: ['medication'],
        code: {
          coding: [],
          text: 'penicillins',
        },
        recordedDate: '2023-01-10T18:26:28Z',
        patient: {
          reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/1013956965V299908',
          display: 'SUPNICK, DAMASO',
        },
        notes: [],
        recorder: {
          reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-X3BWnhAtrFa0Ko0R',
          display: 'Nurse2, VA-HBPC',
        },
        reactions: [
          {
            substance: {
              coding: [],
              text: null,
            },
            manifestation: [
              {
                coding: [],
                text: 'Urticaria (Hives)',
              },
            ],
          },
        ],
      },
    },
  ]
  context('with allergies V0', () => {
    const initializeTestInstance = () => {
      render(<AllergyListScreen {...mockNavProps()} />)
    }

    it('initializes correctly', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/health/allergy-intolerances', expect.anything())
        .mockResolvedValue({ data: allergyData })
      initializeTestInstance()

      await waitFor(() => expect(screen.getByText('Sulfonamides allergy')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Penicillins allergy')).toBeTruthy())
    })

    describe('when loading is set to true', () => {
      it('should show loading screen', () => {
        when(api.get as jest.Mock)
          .calledWith('/v0/health/allergy-intolerances', expect.anything())
          .mockResolvedValue({ data: allergyData })
        initializeTestInstance()
        expect(screen.getByText('Loading your allergy record...')).toBeTruthy()
      })
    })

    describe('when there are no allergies', () => {
      it('should show no Allergy Records', async () => {
        when(api.get as jest.Mock)
          .calledWith('/v0/health/allergy-intolerances', expect.anything())
          .mockResolvedValue({ data: [] })

        initializeTestInstance()
        await waitFor(() =>
          expect(
            screen.getByRole('heading', { name: "We couldn't find information about your VA allergies" }),
          ).toBeTruthy(),
        )
        await waitFor(() =>
          expect(
            screen.getByText(
              "We're sorry. We update your allergy records every 24 hours, but new records can take up to 36 hours to appear.",
            ),
          ).toBeTruthy(),
        )
        await waitFor(() =>
          expect(
            screen.getByText(
              "If you think your allergy records should be here, call our MyVA411 main information line. We're here 24/7.",
            ),
          ).toBeTruthy(),
        )
        await waitFor(() => expect(screen.getByRole('link', { name: '800-698-2411' })).toBeTruthy())
        await waitFor(() => expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy())
      })
    })

    describe('when there is an error fetching allergies', () => {
      it('should show the error state', async () => {
        when(api.get as jest.Mock)
          .calledWith('/v0/health/allergy-intolerances', expect.anything())
          .mockRejectedValue({ networkError: true } as api.APIError)

        initializeTestInstance()
        await waitFor(() => expect(screen.getByRole('header', { name: "The app can't be loaded." })).toBeTruthy())
      })
    })
  })
  context('with allergies V1', () => {
    const allergyDataV1 = [
      {
        id: '2676',
        type: 'allergy',
        attributes: {
          // This is a VistA allergy
          id: '2676',
          name: 'ASPIRIN',
          date: null,
          categories: ['medication'],
          reactions: [],
          location: null,
          observedHistoric: 'h',
          notes: [],
          provider: null,
        },
      },
      {
        id: '132892323',
        type: 'allergy',
        attributes: {
          // This is an OH allergy
          id: '132892323',
          name: 'Penicillin',
          date: '2002',
          categories: ['medication'],
          reactions: ['Urticaria (Hives)', 'Sneezing'],
          location: null,
          observedHistoric: null,
          notes: ['Patient reports adverse reaction to previously prescribed pencicillins'],
          provider: ' Victoria A Borland',
        },
      },
    ]

    const initializeTestInstance = ({ flagEnabled = true, serviceEnabled = true }) => {
      when(featureEnabled).calledWith('allergiesOracleHealthApiEnabled').mockReturnValue(flagEnabled)

      render(<AllergyListScreen {...mockNavProps()} />, {
        queriesData: [
          {
            queryKey: authorizedServicesKeys.authorizedServices,
            data: {
              allergiesOracleHealthEnabled: serviceEnabled,
            },
          },
        ],
      })
    }

    it('initializes correctly with v1 endpoint', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v1/health/allergy-intolerances', expect.anything())
        .mockResolvedValue({ data: allergyDataV1 })
      initializeTestInstance({})
      await waitFor(() => expect(screen.getByText('ASPIRIN allergy')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Penicillin allergy')).toBeTruthy())
    })

    it('initializes with v0 endpoint when flag is disabled even if services is authorized', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/health/allergy-intolerances', expect.anything())
        .mockResolvedValue({ data: allergyData })
      initializeTestInstance({ flagEnabled: false })
      await waitFor(() => expect(screen.getByText('Sulfonamides allergy')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Penicillins allergy')).toBeTruthy())
    })

    it('initializes with v0 endpoint when flag is enabled if services are not authorized', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/health/allergy-intolerances', expect.anything())
        .mockResolvedValue({ data: allergyData })
      initializeTestInstance({ serviceEnabled: false })
      await waitFor(() => expect(screen.getByText('Sulfonamides allergy')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Penicillins allergy')).toBeTruthy())
    })

    describe('when loading is set to true with v1 endpoint', () => {
      it('should show loading screen', () => {
        when(api.get as jest.Mock)
          .calledWith('/v1/health/allergy-intolerances', expect.anything())
          .mockResolvedValue({ data: allergyDataV1 })
        initializeTestInstance({})
        expect(screen.getByText('Loading your allergy record...')).toBeTruthy()
      })
    })

    describe('when there are no allergies with v1 endpoint', () => {
      it('should show no Allergy Records', async () => {
        when(api.get as jest.Mock)
          .calledWith('/v1/health/allergy-intolerances', expect.anything())
          .mockResolvedValue({ data: [] })

        initializeTestInstance({})
        await waitFor(() =>
          expect(
            screen.getByRole('heading', { name: "We couldn't find information about your VA allergies" }),
          ).toBeTruthy(),
        )
        await waitFor(() =>
          expect(
            screen.getByText(
              "We're sorry. We update your allergy records every 24 hours, but new records can take up to 36 hours to appear.",
            ),
          ).toBeTruthy(),
        )
        await waitFor(() =>
          expect(
            screen.getByText(
              "If you think your allergy records should be here, call our MyVA411 main information line. We're here 24/7.",
            ),
          ).toBeTruthy(),
        )
        await waitFor(() => expect(screen.getByRole('link', { name: '800-698-2411' })).toBeTruthy())
        await waitFor(() => expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy())
      })
    })

    describe('when there is an error fetching allergies from v1 endpoint', () => {
      it('should show the error state', async () => {
        when(api.get as jest.Mock)
          .calledWith('/v1/health/allergy-intolerances', expect.anything())
          .mockRejectedValue({ networkError: true } as api.APIError)

        initializeTestInstance({})
        await waitFor(() => expect(screen.getByRole('header', { name: "The app can't be loaded." })).toBeTruthy())
      })
    })
  })
})
