// import React from 'react'

// import { screen } from '@testing-library/react-native'
// import { waitFor } from '@testing-library/react-native'

// import * as api from 'store/api'
// import { context, mockNavProps, render, when } from 'testUtils'

// import AllergyListScreen from './AllergyListScreen'

// context('AllergyListScreen', () => {
//   const allergyData = [
//     {
//       id: '4-1abLZzsevfVnWK',
//       type: 'allergy_intolerance',
//       attributes: {
//         resourceType: 'AllergyIntolerance',
//         type: 'allergy',
//         clinicalStatus: {
//           coding: [
//             {
//               system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
//               code: 'active',
//             },
//           ],
//         },
//         category: ['medication'],
//         code: {
//           coding: [
//             {
//               system: 'http://hl7.org/fhir/ndfrt',
//               code: 'N0000008048',
//               display: 'Sulfonamides',
//             },
//           ],
//           text: 'Sulfonamides',
//         },
//         recordedDate: '2019-03-12T16:30:00Z',
//         patient: {
//           reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/1013956965V299908',
//           display: 'DAMASO SUPNICK',
//         },
//         notes: [
//           {
//             authorReference: {
//               reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgdlF9vV',
//               display: 'Dr. Alicia629 Ureña88 MD',
//             },
//             time: '2019-03-12T16:30:00Z',
//             text: 'Sulfonamides',
//           },
//         ],
//         recorder: {
//           reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgdlF9vV',
//           display: 'Dr. Alicia629 Ureña88 MD',
//         },
//         reactions: [],
//       },
//     },
//     {
//       id: '4-1wYbwqxtod74iS',
//       type: 'allergy_intolerance',
//       attributes: {
//         resourceType: 'AllergyIntolerance',
//         type: 'allergy',
//         clinicalStatus: {
//           coding: [
//             {
//               system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
//               code: 'active',
//             },
//           ],
//         },
//         category: ['medication'],
//         code: {
//           coding: [],
//           text: 'penicillins',
//         },
//         recordedDate: '2023-01-10T18:26:28Z',
//         patient: {
//           reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/1013956965V299908',
//           display: 'SUPNICK, DAMASO',
//         },
//         notes: [],
//         recorder: {
//           reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-X3BWnhAtrFa0Ko0R',
//           display: 'Nurse2, VA-HBPC',
//         },
//         reactions: [
//           {
//             substance: {
//               coding: [],
//               text: null,
//             },
//             manifestation: [
//               {
//                 coding: [],
//                 text: 'Urticaria (Hives)',
//               },
//             ],
//           },
//         ],
//       },
//     },
//   ]

//   const initializeTestInstance = () => {
//     render(<AllergyListScreen {...mockNavProps()} />)
//   }

//   it('initializes correctly', async () => {
//     when(api.get as jest.Mock)
//       .calledWith('/v0/health/allergy-intolerances', expect.anything())
//       .mockResolvedValue({ data: allergyData })
//     initializeTestInstance()
//     await waitFor(() => expect(screen.getByText('Sulfonamides allergy')).toBeTruthy())
//     await waitFor(() => expect(screen.getByText('penicillins allergy')).toBeTruthy())
//   })

//   describe('when loading is set to true', () => {
//     it('should show loading screen', () => {
//       when(api.get as jest.Mock)
//         .calledWith('/v0/health/allergy-intolerances', expect.anything())
//         .mockResolvedValue({ data: allergyData })
//       initializeTestInstance()
//       expect(screen.getByText('Loading your allergy record...')).toBeTruthy()
//     })
//   })

//   describe('when there are no allergies', () => {
//     it('should show no Allergy Records', async () => {
//       when(api.get as jest.Mock)
//         .calledWith('/v0/health/allergy-intolerances', expect.anything())
//         .mockResolvedValue({ data: [] })

//       initializeTestInstance()
//       await waitFor(() =>
//         expect(
//           screen.getByRole('heading', { name: "We couldn't find information about your VA allergies" }),
//         ).toBeTruthy(),
//       )
//       await waitFor(() =>
//         expect(
//           screen.getByText(
//             "We're sorry. We update your allergy records every 24 hours, but new records can take up to 36 hours to appear.",
//           ),
//         ).toBeTruthy(),
//       )
//       await waitFor(() =>
//         expect(
//           screen.getByText(
//             "If you think your allergy records should be here, call our MyVA411 main information line. We're here 24/7.",
//           ),
//         ).toBeTruthy(),
//       )
//       await waitFor(() => expect(screen.getByRole('link', { name: '800-698-2411' })).toBeTruthy())
//       await waitFor(() => expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy())
//     })
//   })
// })
