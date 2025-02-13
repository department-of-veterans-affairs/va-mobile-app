// import React from 'react'

// import { screen } from '@testing-library/react-native'

// import { LabsAndTests } from 'api/types'
// // import * as api from 'store/api'
// import { context, mockNavProps, render, waitFor } from 'testUtils'

// import LabsAndTestsDetailsScreen from './LabsAndTestsDetailsScreen'

// context('LabsAndTestsDetailsScreen', () => {
//   const defaultLabsAndTests = {

//   }

//   const initializeTestInstance = (allergy: Allergy = defaultAllergy) => {
//     const props = mockNavProps(undefined, undefined, { params: { allergy: allergy } })
//     render(<AllergyDetailsScreen {...props} />)
//   }

//   it('initializes correctly for default allergy', async () => {
//     initializeTestInstance()
//     await waitFor(() => expect(screen.getByText('March 12, 2019')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Type')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('medication')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Provider')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Dr. Alicia629 Ureña88 MD')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Reaction')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('None noted')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Notes')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Sulfonamides')).toBeTruthy())
//     await waitFor(() =>
//       expect(
//         screen.getByText(
//           'We base this information on your current VA health records. If you have any questions, contact your health care team.',
//         ),
//       ).toBeTruthy(),
//     )
//   })

//   it('initializes correctly for allergy with reactions', async () => {
//     const allergyWithReactions = {
//       ...defaultAllergy,
//       attributes: {
//         ...defaultAllergy.attributes,
//         reactions: reactions,
//       },
//     }

//     initializeTestInstance(allergyWithReactions)
//     await waitFor(() => expect(screen.getByText('March 12, 2019')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Type')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('medication')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Provider')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Dr. Alicia629 Ureña88 MD')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Reaction')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Urticaria (Hives)')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Notes')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Sulfonamides')).toBeTruthy())
//     await waitFor(() => {
//       const textElement = screen.queryByText(
//         'We base this information on your current VA health records. If you have any questions, contact your health care team.',
//       )
//       expect(textElement).toBeNull()
//     })
//   })

//   it('initializes correctly for allergy with multiple categories', async () => {
//     const allergyWithCategories = {
//       ...defaultAllergy,
//       attributes: {
//         ...defaultAllergy.attributes,
//         reactions: reactions,
//         category: ['medication', 'food'],
//       },
//     }

//     initializeTestInstance(allergyWithCategories)
//     await waitFor(() => expect(screen.getByText('March 12, 2019')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Type')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('medication')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('food')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Provider')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Dr. Alicia629 Ureña88 MD')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Reaction')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Urticaria (Hives)')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Notes')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Sulfonamides')).toBeTruthy())
//     await waitFor(() => {
//       const textElement = screen.queryByText(
//         'We base this information on your current VA health records. If you have any questions, contact your health care team.',
//       )
//       expect(textElement).toBeNull()
//     })
//   })

//   it('initializes correctly for allergy with multiple notes', async () => {
//     const allergyWithNotes = {
//       ...defaultAllergy,
//       attributes: {
//         ...defaultAllergy.attributes,
//         reactions: reactions,
//         category: ['medication', 'food'],
//         notes: notes,
//       },
//     }

//     initializeTestInstance(allergyWithNotes)
//     await waitFor(() => expect(screen.getByText('March 12, 2019')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Type')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('medication')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('food')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Provider')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Dr. Alicia629 Ureña88 MD')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Reaction')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Urticaria (Hives)')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Notes')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Sulfonamides')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Patient has a family history of sulfa allergy')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('Additional episode of hives')).toBeTruthy())
//     await waitFor(() => {
//       const textElement = screen.queryByText(
//         'We base this information on your current VA health records. If you have any questions, contact your health care team.',
//       )
//       expect(textElement).toBeNull()
//     })
//   })
// })
