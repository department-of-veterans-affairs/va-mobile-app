import React from 'react'

import { screen } from '@testing-library/react-native'

import { Allergy } from 'api/types'
import { context, mockNavProps, render, waitFor } from 'testUtils'

import AllergyDetailsScreen from './AllergyDetailsScreen'

context('AllergyDetailsScreen', () => {
  const defaultAllergy = {
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
            display: 'Dr. Alicia',
          },
          time: '2019-03-12T16:30:00Z',
          text: 'Sulfonamides',
        },
      ],
      recorder: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgdlF9vV',
        display: 'Dr. Alicia',
      },
      reactions: [],
    },
  }

  const reactions = [
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
    {
      substance: {
        coding: [],
        text: null,
      },
      manifestation: [
        {
          coding: [],
          text: 'Anaphylaxis',
        },
      ],
    },
  ]

  const notes = [
    {
      authorReference: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgdlF9vV',
        display: 'Dr. Alicia',
      },
      time: '2019-03-12T16:30:00Z',
      text: 'Sulfonamides',
    },
    {
      authorReference: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgdlF9vV',
        display: 'Dr. Alicia',
      },
      time: '2019-03-13T12:30:00Z',
      text: 'Patient has a family history of sulfa allergy',
    },
    {
      authorReference: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgdlF9vV',
        display: 'Dr. Alicia',
      },
      time: '2020-03-15T16:30:00Z',
      text: 'Additional episode of hives',
    },
  ]

  const initializeTestInstance = (allergy: Allergy = defaultAllergy) => {
    const props = mockNavProps(undefined, undefined, { params: { allergy: allergy } })
    render(<AllergyDetailsScreen {...props} />)
  }

  it('initializes correctly for default allergy', async () => {
    initializeTestInstance()
    await waitFor(() => expect(screen.getByText('March 12, 2019')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Types')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Medication')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Provider')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Dr. Alicia')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Reactions')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('None noted')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Notes')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Sulfonamides')).toBeTruthy())
    await waitFor(() =>
      expect(
        screen.getByText(
          'We base this information on your current VA health records. If you have any questions, contact your health care team.',
        ),
      ).toBeTruthy(),
    )
  })

  it('initializes correctly for allergy with reactions', async () => {
    const allergyWithReactions = {
      ...defaultAllergy,
      attributes: {
        ...defaultAllergy.attributes,
        reactions: reactions,
      },
    }

    initializeTestInstance(allergyWithReactions)
    await waitFor(() => expect(screen.getByText('March 12, 2019')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Types')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Medication')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Provider')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Dr. Alicia')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Reactions')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Urticaria (Hives)')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Notes')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Sulfonamides')).toBeTruthy())
    await waitFor(() => {
      const textElement = screen.queryByText(
        'We base this information on your current VA health records. If you have any questions, contact your health care team.',
      )
      expect(textElement).toBeNull()
    })
  })

  it('initializes correctly for allergy with multiple categories', async () => {
    const allergyWithCategories = {
      ...defaultAllergy,
      attributes: {
        ...defaultAllergy.attributes,
        reactions: reactions,
        category: ['medication', 'food'],
      },
    }

    initializeTestInstance(allergyWithCategories)
    await waitFor(() => expect(screen.getByText('March 12, 2019')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Types')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Medication')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Food')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Provider')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Dr. Alicia')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Reactions')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Urticaria (Hives)')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Notes')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Sulfonamides')).toBeTruthy())
    await waitFor(() => {
      const textElement = screen.queryByText(
        'We base this information on your current VA health records. If you have any questions, contact your health care team.',
      )
      expect(textElement).toBeNull()
    })
  })

  it('initializes correctly for allergy with multiple notes', async () => {
    const allergyWithNotes = {
      ...defaultAllergy,
      attributes: {
        ...defaultAllergy.attributes,
        reactions: reactions,
        category: ['medication', 'food'],
        notes: notes,
      },
    }

    initializeTestInstance(allergyWithNotes)
    await waitFor(() => expect(screen.getByText('March 12, 2019')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Types')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Medication')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Food')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Provider')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Dr. Alicia')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Reactions')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Urticaria (Hives)')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Notes')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Sulfonamides')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Patient has a family history of sulfa allergy')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Additional episode of hives')).toBeTruthy())
    await waitFor(() => {
      const textElement = screen.queryByText(
        'We base this information on your current VA health records. If you have any questions, contact your health care team.',
      )
      expect(textElement).toBeNull()
    })
  })
})
