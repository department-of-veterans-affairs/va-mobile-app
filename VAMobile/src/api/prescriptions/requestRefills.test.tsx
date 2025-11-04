import React from 'react'
import { Provider } from 'react-redux'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react-native'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { prescriptionKeys } from 'api/prescriptions/queryKeys'
import { useRequestRefills } from 'api/prescriptions/requestRefills'
import { PrescriptionData, PrescriptionRefillData, RefillRequestSummaryItems } from 'api/types'
import { Events, UserAnalytics } from 'constants/analytics'
import * as api from 'store/api'
import { TrackedStore } from 'testUtils'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { useReviewEvent } from 'utils/inAppReviews'

jest.mock('store/api')
jest.mock('api/authorizedServices/getAuthorizedServices')
jest.mock('utils/analytics')
jest.mock('utils/inAppReviews')

describe('requestRefills', () => {
  let store: TrackedStore
  let queryClient: QueryClient

  const mockPrescription1: PrescriptionData = {
    id: '123',
    type: 'Prescription',
    attributes: {
      refillStatus: 'active',
      refillSubmitDate: '2021-06-28T17:01:12.000Z',
      refillDate: '2021-07-14T04:00:00.000Z',
      refillRemaining: 5,
      facilityName: 'Test Facility',
      facilityPhoneNumber: '(555) 123-4567',
      orderedDate: '2021-05-25T04:00:00.000Z',
      quantity: 30,
      expirationDate: '2022-05-26T04:00:00.000Z',
      prescriptionNumber: '1234567',
      prescriptionName: 'TEST MEDICATION 100MG',
      dispensedDate: null,
      stationNumber: '123',
      isRefillable: true,
      isTrackable: false,
      instructions: 'Take as needed',
    },
  }

  const mockPrescription2: PrescriptionData = {
    id: '456',
    type: 'Prescription',
    attributes: {
      refillStatus: 'active',
      refillSubmitDate: '2021-06-28T17:01:12.000Z',
      refillDate: '2021-07-14T04:00:00.000Z',
      refillRemaining: 3,
      facilityName: 'Test Facility 2',
      facilityPhoneNumber: '(555) 987-6543',
      orderedDate: '2021-05-25T04:00:00.000Z',
      quantity: 60,
      expirationDate: '2022-05-26T04:00:00.000Z',
      prescriptionNumber: '7654321',
      prescriptionName: 'ANOTHER MEDICATION 50MG',
      dispensedDate: null,
      stationNumber: '456',
      isRefillable: true,
      isTrackable: false,
      instructions: 'Take twice daily',
    },
  }

  const mockPrescriptions = [mockPrescription1, mockPrescription2]

  const mockSuccessfulRefillResponse: PrescriptionRefillData = {
    data: {
      id: 'refill-response',
      type: 'PrescriptionRefillResponse',
      attributes: {
        failedPrescriptionIds: [],
        failedStationList: null,
        successfulStationList: '123,456',
        lastUpdatedTime: '2023-01-01T12:00:00Z',
        prescriptionList: 'prescription-list-id',
        errors: [],
        infoMessages: [],
      },
    },
  }

  const mockPartialFailureRefillResponseV0: PrescriptionRefillData = {
    data: {
      id: 'refill-response',
      type: 'PrescriptionRefillResponse',
      attributes: {
        failedPrescriptionIds: ['456'],
        failedStationList: '456',
        successfulStationList: '123',
        lastUpdatedTime: '2023-01-01T12:00:00Z',
        prescriptionList: 'prescription-list-id',
        errors: [
          {
            developerMessage: 'Prescription not eligible for refill',
            prescriptionId: '456',
            stationNumber: '456',
          },
        ],
        infoMessages: [],
      },
    },
  }

  beforeEach(() => {
    store = new TrackedStore()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    })
    ;(useAuthorizedServices as jest.Mock).mockReturnValue({
      data: {
        prescriptions: true,
        medicationsOracleHealthEnabled: false,
      },
    })
    ;(useReviewEvent as jest.Mock).mockReturnValue(jest.fn())
  })

  afterEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store.realStore}>{children}</Provider>
    </QueryClientProvider>
  )

  describe('useRequestRefills hook', () => {
    it('should successfully request refills using v0 API by default', async () => {
      const mockPut = api.put as jest.Mock
      mockPut.mockResolvedValueOnce(mockSuccessfulRefillResponse)

      const { result } = renderHook(() => useRequestRefills(), { wrapper })

      await act(async () => {
        result.current.mutate(mockPrescriptions)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBeTruthy()
      })

      expect(mockPut).toHaveBeenCalledWith('/v0/health/rx/prescriptions/refill', {
        ids: ['123', '456'],
      })

      const expectedResult: RefillRequestSummaryItems = [
        { submitted: true, data: mockPrescription1 },
        { submitted: true, data: mockPrescription2 },
      ]

      expect(result.current.data).toEqual(expectedResult)
      expect(setAnalyticsUserProperty).toHaveBeenCalledWith(UserAnalytics.vama_uses_rx())
      expect(logAnalyticsEvent).toHaveBeenCalledWith(Events.vama_rx_refill_success(['123', '456']))
    })

    it('should use v1 API when Oracle health is enabled', async () => {
      const mockPut = api.put as jest.Mock
      mockPut.mockResolvedValueOnce(mockSuccessfulRefillResponse)
      ;(useAuthorizedServices as jest.Mock).mockReturnValue({
        data: {
          prescriptions: true,
          medicationsOracleHealthEnabled: true,
        },
      })

      const { result } = renderHook(() => useRequestRefills(), { wrapper })

      await act(async () => {
        result.current.mutate(mockPrescriptions)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBeTruthy()
      })

      expect(mockPut).toHaveBeenCalledWith('/v1/health/rx/prescriptions/refill', [
        { id: '123', stationNumber: '123' },
        { id: '456', stationNumber: '456' },
      ])
    })

    it('should handle partial failures correctly', async () => {
      const mockPut = api.put as jest.Mock
      mockPut.mockResolvedValueOnce(mockPartialFailureRefillResponseV0)

      const { result } = renderHook(() => useRequestRefills(), { wrapper })

      await act(async () => {
        result.current.mutate(mockPrescriptions)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBeTruthy()
      })

      const expectedResult: RefillRequestSummaryItems = [
        { submitted: true, data: mockPrescription1 },
        { submitted: false, data: mockPrescription2 },
      ]

      expect(result.current.data).toEqual(expectedResult)
    })

    it('should handle API errors correctly', async () => {
      const mockError = new Error('API Error')
      const mockPut = api.put as jest.Mock
      mockPut.mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useRequestRefills(), { wrapper })

      await act(async () => {
        result.current.mutate(mockPrescriptions)
      })

      await waitFor(() => {
        expect(result.current.isError).toBeTruthy()
      })

      expect(result.current.error).toBe(mockError)
      expect(logAnalyticsEvent).toHaveBeenCalledWith(Events.vama_rx_refill_fail(['123', '456']))
      expect(logNonFatalErrorToFirebase).toHaveBeenCalledWith(mockError, 'requestRefills: Service error')
    })

    it('should handle empty prescription list', async () => {
      const mockPut = api.put as jest.Mock
      mockPut.mockResolvedValueOnce(mockSuccessfulRefillResponse)

      const { result } = renderHook(() => useRequestRefills(), { wrapper })

      await act(async () => {
        result.current.mutate([])
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBeTruthy()
      })

      expect(mockPut).toHaveBeenCalledWith('/v0/health/rx/prescriptions/refill', {
        ids: [],
      })

      expect(result.current.data).toEqual([])
      expect(logAnalyticsEvent).toHaveBeenCalledWith(Events.vama_rx_refill_success([]))
    })

    it('should invalidate prescriptions query on success', async () => {
      const mockPut = api.put as jest.Mock
      mockPut.mockResolvedValueOnce(mockSuccessfulRefillResponse)
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries')

      const { result } = renderHook(() => useRequestRefills(), { wrapper })

      await act(async () => {
        result.current.mutate(mockPrescriptions)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBeTruthy()
      })

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: prescriptionKeys.prescriptions })
    })

    it('should call review event registration on success', async () => {
      const mockRegisterReviewEvent = jest.fn()
      const mockPut = api.put as jest.Mock
      mockPut.mockResolvedValueOnce(mockSuccessfulRefillResponse)
      ;(useReviewEvent as jest.Mock).mockReturnValue(mockRegisterReviewEvent)

      const { result } = renderHook(() => useRequestRefills(), { wrapper })

      await act(async () => {
        result.current.mutate(mockPrescriptions)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBeTruthy()
      })

      expect(mockRegisterReviewEvent).toHaveBeenCalled()
    })

    it('should handle missing authorized services data', async () => {
      const mockPut = api.put as jest.Mock
      mockPut.mockResolvedValueOnce(mockSuccessfulRefillResponse)
      ;(useAuthorizedServices as jest.Mock).mockReturnValue({
        data: null,
      })

      const { result } = renderHook(() => useRequestRefills(), { wrapper })

      await act(async () => {
        result.current.mutate(mockPrescriptions)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBeTruthy()
      })

      // Should default to v0 API when authorized services data is null
      expect(mockPut).toHaveBeenCalledWith('/v0/health/rx/prescriptions/refill', {
        ids: ['123', '456'],
      })
    })

    it('should handle response without failedPrescriptionIds', async () => {
      const responseWithoutFailedIds: PrescriptionRefillData = {
        data: {
          id: 'refill-response',
          type: 'PrescriptionRefillResponse',
          attributes: {
            failedPrescriptionIds: [],
            failedStationList: null,
            successfulStationList: '123,456',
            lastUpdatedTime: '2023-01-01T12:00:00Z',
            prescriptionList: 'prescription-list-id',
            errors: [],
            infoMessages: [],
          },
        },
      }

      const mockPut = api.put as jest.Mock
      mockPut.mockResolvedValueOnce(responseWithoutFailedIds)

      const { result } = renderHook(() => useRequestRefills(), { wrapper })

      await act(async () => {
        result.current.mutate(mockPrescriptions)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBeTruthy()
      })

      // All prescriptions should be marked as submitted when failedPrescriptionIds is empty
      const expectedResult: RefillRequestSummaryItems = [
        { submitted: true, data: mockPrescription1 },
        { submitted: true, data: mockPrescription2 },
      ]

      expect(result.current.data).toEqual(expectedResult)
    })

    it('should handle response with errors and info messages', async () => {
      const responseWithErrorsAndInfo: PrescriptionRefillData = {
        data: {
          id: 'refill-response',
          type: 'PrescriptionRefillResponse',
          attributes: {
            failedPrescriptionIds: ['456'],
            failedStationList: '456',
            successfulStationList: '123',
            lastUpdatedTime: '2023-01-01T12:00:00Z',
            prescriptionList: 'prescription-list-id',
            errors: [
              {
                developerMessage: 'Prescription cannot be refilled at this time',
                prescriptionId: '456',
                stationNumber: '456',
              },
            ],
            infoMessages: [
              {
                prescriptionId: '123',
                message: 'Refill request processed successfully',
                stationNumber: '123',
              },
            ],
          },
        },
      }

      const mockPut = api.put as jest.Mock
      mockPut.mockResolvedValueOnce(responseWithErrorsAndInfo)

      const { result } = renderHook(() => useRequestRefills(), { wrapper })

      await act(async () => {
        result.current.mutate(mockPrescriptions)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBeTruthy()
      })

      const expectedResult: RefillRequestSummaryItems = [
        { submitted: true, data: mockPrescription1 },
        { submitted: false, data: mockPrescription2 },
      ]

      expect(result.current.data).toEqual(expectedResult)

      // Verify that the response includes the new error and info message fields
      expect(result.current.data).toBeDefined()
      expect(responseWithErrorsAndInfo.data.attributes.errors).toHaveLength(1)
      expect(responseWithErrorsAndInfo.data.attributes.infoMessages).toHaveLength(1)
    })

    describe('failedPrescriptionIds handling', () => {
      it('should handle v0 API failedPrescriptionIds as strings', async () => {
        const responseWithStringIds: PrescriptionRefillData = {
          data: {
            id: 'refill-response',
            type: 'PrescriptionRefillResponse',
            attributes: {
              failedPrescriptionIds: ['456'], // V0 API returns strings
              failedStationList: '456',
              successfulStationList: '123',
              lastUpdatedTime: '2023-01-01T12:00:00Z',
              prescriptionList: 'prescription-list-id',
              errors: [],
              infoMessages: [],
            },
          },
        }

        // Mock V0 API usage (default behavior)
        ;(useAuthorizedServices as jest.Mock).mockReturnValue({
          data: {
            prescriptions: true,
            medicationsOracleHealthEnabled: false,
          },
        })

        const mockPut = api.put as jest.Mock
        mockPut.mockResolvedValueOnce(responseWithStringIds)

        const { result } = renderHook(() => useRequestRefills(), { wrapper })

        await act(async () => {
          result.current.mutate(mockPrescriptions)
        })

        await waitFor(() => {
          expect(result.current.isSuccess).toBeTruthy()
        })

        const expectedResult: RefillRequestSummaryItems = [
          { submitted: true, data: mockPrescription1 },
          { submitted: false, data: mockPrescription2 }, // This one failed
        ]

        expect(result.current.data).toEqual(expectedResult)
      })

      it('should handle v1 API failedPrescriptionIds as objects', async () => {
        const responseWithObjectIds: PrescriptionRefillData = {
          data: {
            id: 'refill-response',
            type: 'PrescriptionRefillResponse',
            attributes: {
              failedPrescriptionIds: [
                { id: '456', stationNumber: '456' }, // V1 API returns objects
              ],
              failedStationList: '456',
              successfulStationList: '123',
              lastUpdatedTime: '2023-01-01T12:00:00Z',
              prescriptionList: 'prescription-list-id',
              errors: [],
              infoMessages: [],
            },
          },
        }

        // Mock V1 API usage
        ;(useAuthorizedServices as jest.Mock).mockReturnValue({
          data: {
            prescriptions: true,
            medicationsOracleHealthEnabled: true,
          },
        })

        const mockPut = api.put as jest.Mock
        mockPut.mockResolvedValueOnce(responseWithObjectIds)

        const { result } = renderHook(() => useRequestRefills(), { wrapper })

        await act(async () => {
          result.current.mutate(mockPrescriptions)
        })

        await waitFor(() => {
          expect(result.current.isSuccess).toBeTruthy()
        })

        const expectedResult: RefillRequestSummaryItems = [
          { submitted: true, data: mockPrescription1 },
          { submitted: false, data: mockPrescription2 }, // This one failed
        ]

        expect(result.current.data).toEqual(expectedResult)
      })

      it('should handle mixed failedPrescriptionIds types in v1 API', async () => {
        const responseWithMixedIds = {
          data: {
            id: 'refill-response',
            type: 'PrescriptionRefillResponse',
            attributes: {
              failedPrescriptionIds: [
                '123', // String format
                { id: '456', stationNumber: '456' }, // Object format
              ],
              failedStationList: '123,456',
              successfulStationList: '',
              lastUpdatedTime: '2023-01-01T12:00:00Z',
              prescriptionList: 'prescription-list-id',
              errors: [],
              infoMessages: [],
            },
          },
        } as PrescriptionRefillData

        // Mock V1 API usage
        ;(useAuthorizedServices as jest.Mock).mockReturnValue({
          data: {
            prescriptions: true,
            medicationsOracleHealthEnabled: true,
          },
        })

        const mockPut = api.put as jest.Mock
        mockPut.mockResolvedValueOnce(responseWithMixedIds)

        const { result } = renderHook(() => useRequestRefills(), { wrapper })

        await act(async () => {
          result.current.mutate(mockPrescriptions)
        })

        await waitFor(() => {
          expect(result.current.isSuccess).toBeTruthy()
        })

        const expectedResult: RefillRequestSummaryItems = [
          { submitted: false, data: mockPrescription1 }, // This one failed
          { submitted: false, data: mockPrescription2 }, // This one failed too
        ]

        expect(result.current.data).toEqual(expectedResult)
      })

      it('should handle empty failedPrescriptionIds array', async () => {
        const responseWithEmptyIds: PrescriptionRefillData = {
          data: {
            id: 'refill-response',
            type: 'PrescriptionRefillResponse',
            attributes: {
              failedPrescriptionIds: [],
              failedStationList: null,
              successfulStationList: '123,456',
              lastUpdatedTime: '2023-01-01T12:00:00Z',
              prescriptionList: 'prescription-list-id',
              errors: [],
              infoMessages: [],
            },
          },
        }

        const mockPut = api.put as jest.Mock
        mockPut.mockResolvedValueOnce(responseWithEmptyIds)

        const { result } = renderHook(() => useRequestRefills(), { wrapper })

        await act(async () => {
          result.current.mutate(mockPrescriptions)
        })

        await waitFor(() => {
          expect(result.current.isSuccess).toBeTruthy()
        })

        const expectedResult: RefillRequestSummaryItems = [
          { submitted: true, data: mockPrescription1 },
          { submitted: true, data: mockPrescription2 },
        ]

        expect(result.current.data).toEqual(expectedResult)
      })

      it('should handle null or undefined failedPrescriptionIds', async () => {
        const responseWithNullIds: PrescriptionRefillData = {
          data: {
            id: 'refill-response',
            type: 'PrescriptionRefillResponse',
            attributes: {
              failedPrescriptionIds: null as unknown as string[], // Simulating unexpected null
              failedStationList: null,
              successfulStationList: '123,456',
              lastUpdatedTime: '2023-01-01T12:00:00Z',
              prescriptionList: 'prescription-list-id',
              errors: [],
              infoMessages: [],
            },
          },
        }

        const mockPut = api.put as jest.Mock
        mockPut.mockResolvedValueOnce(responseWithNullIds)

        const { result } = renderHook(() => useRequestRefills(), { wrapper })

        await act(async () => {
          result.current.mutate(mockPrescriptions)
        })

        await waitFor(() => {
          expect(result.current.isSuccess).toBeTruthy()
        })

        // When failedPrescriptionIds is null/undefined, all should be treated as successful
        const expectedResult: RefillRequestSummaryItems = [
          { submitted: true, data: mockPrescription1 },
          { submitted: true, data: mockPrescription2 },
        ]

        expect(result.current.data).toEqual(expectedResult)
      })
    })
  })
})
