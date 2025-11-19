import React from 'react'
import { Provider } from 'react-redux'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react-native'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { usePrescriptions } from 'api/prescriptions/getPrescriptions'
import { useTrackingInfo } from 'api/prescriptions/getTrackingInfo'
import {
  PrescriptionData,
  PrescriptionTrackingInfo,
  PrescriptionTrackingInfoGetData,
  PrescriptionTrackingItem,
  PrescriptionsGetData,
} from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import * as api from 'store/api'
import { TrackedStore } from 'testUtils'
import { setAnalyticsUserProperty } from 'utils/analytics'

jest.mock('store/api')
jest.mock('utils/analytics')
jest.mock('api/authorizedServices/getAuthorizedServices')
jest.mock('api/prescriptions/getPrescriptions')

describe('useTrackingInfo', () => {
  let store: TrackedStore
  let queryClient: QueryClient

  beforeEach(() => {
    store = new TrackedStore()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    jest.clearAllMocks()

    // Default mocks
    ;(useAuthorizedServices as jest.Mock).mockReturnValue({
      data: {
        medicationsOracleHealthEnabled: false,
      },
    })
    ;(usePrescriptions as jest.Mock).mockReturnValue({
      data: undefined,
    })
  })

  afterEach(() => {
    queryClient.clear()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store.realStore}>{children}</Provider>
    </QueryClientProvider>
  )

  const mockTrackingInfoV0: PrescriptionTrackingInfoGetData = {
    data: [
      {
        id: '123',
        type: 'prescriptionTrackingInfo',
        attributes: {
          prescriptionId: 123,
          prescriptionName: 'Test Medication',
          prescriptionNumber: 'RX123456',
          ndcNumber: '12345-678-90',
          trackingNumber: 'TRK123456789',
          shippedDate: '2023-12-01',
          deliveryService: 'USPS',
          otherPrescriptions: [
            {
              prescriptionName: 'Other Med 1',
              prescriptionNumber: 'RX789',
            },
          ],
        },
      },
    ],
  }

  const mockPrescriptionTrackingItem: PrescriptionTrackingItem = {
    prescriptionId: 456,
    prescriptionName: 'V1 Test Medication',
    prescriptionNumber: 'RX456789',
    ndcNumber: '54321-987-65',
    trackingNumber: 'TRK987654321',
    shippedDate: '2023-12-02',
    carrier: 'UPS',
    otherPrescriptions: [
      {
        prescriptionName: 'Other Med 2',
        prescriptionNumber: 'RX321',
      },
    ],
  }

  const mockPrescriptionWithTracking: PrescriptionData = {
    id: '456',
    type: 'Prescription',
    attributes: {
      refillStatus: 'active',
      refillSubmitDate: null,
      refillDate: null,
      refillRemaining: 3,
      facilityName: 'Test Facility',
      facilityPhoneNumber: '123-456-7890',
      isRefillable: true,
      isTrackable: true,
      orderedDate: '2023-01-01',
      quantity: 30,
      expirationDate: '2024-01-01',
      prescriptionNumber: 'RX456789',
      prescriptionName: 'V1 Test Medication',
      instructions: 'Take as directed',
      dispensedDate: null,
      stationNumber: 'STA123',
      tracking: [mockPrescriptionTrackingItem],
    },
  }

  const mockPrescriptionWithoutTracking: PrescriptionData = {
    id: '789',
    type: 'Prescription',
    attributes: {
      refillStatus: 'active',
      refillSubmitDate: null,
      refillDate: null,
      refillRemaining: 3,
      facilityName: 'Test Facility',
      facilityPhoneNumber: '123-456-7890',
      isRefillable: true,
      isTrackable: false,
      orderedDate: '2023-01-01',
      quantity: 30,
      expirationDate: '2024-01-01',
      prescriptionNumber: 'RX789',
      prescriptionName: 'No Tracking Med',
      instructions: 'Take as directed',
      dispensedDate: null,
      stationNumber: 'STA123',
      tracking: null,
    },
  }

  const mockPrescriptionsV1Data: PrescriptionsGetData = {
    data: [mockPrescriptionWithTracking, mockPrescriptionWithoutTracking],
    meta: {
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalPages: 1,
        totalEntries: 2,
      },
      prescriptionStatusCount: {
        active: 2,
        isRefillable: 1,
        discontinued: 0,
        expired: 0,
        historical: 0,
        pending: 0,
        transferred: 0,
        submitted: 0,
        hold: 0,
        unknown: 0,
        total: 2,
      },
      hasNonVaMeds: false,
    },
    links: {
      self: '',
      first: '',
      prev: null,
      next: null,
      last: '',
    },
  }

  describe('when using V0 API (shouldUseV1 = false)', () => {
    beforeEach(() => {
      ;(useAuthorizedServices as jest.Mock).mockReturnValue({
        data: {
          medicationsOracleHealthEnabled: false,
        },
      })
    })

    it('should fetch tracking info using V0 API', async () => {
      const mockGet = api.get as jest.Mock
      mockGet.mockResolvedValueOnce(mockTrackingInfoV0)

      const { result } = renderHook(() => useTrackingInfo('123'), { wrapper })

      await waitFor(() => {
        expect(result.current.isFetched).toBeTruthy()
      })

      expect(mockGet).toHaveBeenCalledWith('/v0/health/rx/prescriptions/123/tracking')
      expect(result.current.data).toEqual(mockTrackingInfoV0.data)
      expect(setAnalyticsUserProperty).toHaveBeenCalledWith(UserAnalytics.vama_uses_rx())
    })

    it('should handle API errors for V0', async () => {
      const mockGet = api.get as jest.Mock
      const mockError = new Error('API Error')
      mockGet.mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useTrackingInfo('123'), { wrapper })

      await waitFor(() => {
        expect(result.current.isError).toBeTruthy()
      })

      expect(mockGet).toHaveBeenCalledWith('/v0/health/rx/prescriptions/123/tracking')
      expect(result.current.error).toBe(mockError)
    })

    it('should respect enabled option when false', () => {
      const mockGet = api.get as jest.Mock

      const { result } = renderHook(() => useTrackingInfo('123', { enabled: false }), { wrapper })

      expect(result.current.isFetching).toBeFalsy()
      expect(mockGet).not.toHaveBeenCalled()
    })

    it('should call API when enabled option is true', async () => {
      const mockGet = api.get as jest.Mock
      mockGet.mockResolvedValueOnce(mockTrackingInfoV0)

      const { result } = renderHook(() => useTrackingInfo('123', { enabled: true }), { wrapper })

      await waitFor(() => {
        expect(result.current.isFetched).toBeTruthy()
      })

      expect(mockGet).toHaveBeenCalledWith('/v0/health/rx/prescriptions/123/tracking')
    })
  })

  describe('when using V1 API (shouldUseV1 = true)', () => {
    beforeEach(() => {
      ;(useAuthorizedServices as jest.Mock).mockReturnValue({
        data: {
          medicationsOracleHealthEnabled: true,
        },
      })
      ;(usePrescriptions as jest.Mock).mockReturnValue({
        data: mockPrescriptionsV1Data,
      })
    })

    it('should use prescription data from V1 when prescription has tracking', async () => {
      const { result } = renderHook(() => useTrackingInfo('456'), { wrapper })

      await waitFor(() => {
        expect(result.current.isFetched).toBeTruthy()
      })

      const expectedResult: PrescriptionTrackingInfo[] = [
        {
          id: '456',
          type: 'prescriptionTrackingInfo',
          attributes: {
            prescriptionId: 456,
            prescriptionName: 'V1 Test Medication',
            prescriptionNumber: 'RX456789',
            ndcNumber: '54321-987-65',
            trackingNumber: 'TRK987654321',
            shippedDate: '2023-12-02',
            carrier: 'UPS',
            otherPrescriptions: [
              {
                prescriptionName: 'Other Med 2',
                prescriptionNumber: 'RX321',
              },
            ],
          },
        },
      ]

      expect(result.current.data).toEqual(expectedResult)
      expect(api.get).not.toHaveBeenCalled() // Should not call V0 API
    })

    it('should return undefined when prescription has no tracking data', async () => {
      const { result } = renderHook(() => useTrackingInfo('789'), { wrapper })

      await waitFor(() => {
        expect(result.current.isFetched).toBeTruthy()
      })

      expect(result.current.data).toBeUndefined()
      expect(api.get).not.toHaveBeenCalled()
    })

    it('should return undefined when prescription is not found', async () => {
      const { result } = renderHook(() => useTrackingInfo('999'), { wrapper })

      await waitFor(() => {
        expect(result.current.isFetched).toBeTruthy()
      })

      expect(result.current.data).toBeUndefined()
      expect(api.get).not.toHaveBeenCalled()
    })

    it('should handle empty prescription data', async () => {
      ;(usePrescriptions as jest.Mock).mockReturnValue({
        data: undefined,
      })

      const { result } = renderHook(() => useTrackingInfo('456'), { wrapper })

      await waitFor(() => {
        expect(result.current.isFetched).toBeTruthy()
      })

      expect(result.current.data).toBeUndefined()
      expect(api.get).not.toHaveBeenCalled()
    })

    it('should handle prescription with empty tracking array', async () => {
      const prescriptionWithEmptyTracking: PrescriptionData = {
        ...mockPrescriptionWithTracking,
        attributes: {
          ...mockPrescriptionWithTracking.attributes,
          tracking: [],
        },
      }

      ;(usePrescriptions as jest.Mock).mockReturnValue({
        data: {
          ...mockPrescriptionsV1Data,
          data: [prescriptionWithEmptyTracking],
        },
      })

      const { result } = renderHook(() => useTrackingInfo('456'), { wrapper })

      await waitFor(() => {
        expect(result.current.isFetched).toBeTruthy()
      })

      expect(result.current.data).toEqual([])
      expect(api.get).not.toHaveBeenCalled()
    })
  })

  describe('query configuration', () => {
    it('should use correct query key', () => {
      renderHook(() => useTrackingInfo('123'), { wrapper })

      // Access the query client to check the query key
      const queries = queryClient.getQueryCache().getAll()
      const trackingQuery = queries[0].queryKey

      expect(trackingQuery).toBeDefined()
      expect(trackingQuery).toEqual([['trackingInfo'], '123'])
    })
  })

  describe('edge cases', () => {
    it('should handle undefined authorizedServices', async () => {
      ;(useAuthorizedServices as jest.Mock).mockReturnValue({
        data: undefined,
      })

      const mockGet = api.get as jest.Mock
      mockGet.mockResolvedValueOnce(mockTrackingInfoV0)

      const { result } = renderHook(() => useTrackingInfo('123'), { wrapper })

      await waitFor(() => {
        expect(result.current.isFetched).toBeTruthy()
      })

      // Should default to V0 API when authorizedServices is undefined
      expect(mockGet).toHaveBeenCalledWith('/v0/health/rx/prescriptions/123/tracking')
    })

    it('should handle null tracking data in prescription', async () => {
      ;(useAuthorizedServices as jest.Mock).mockReturnValue({
        data: {
          medicationsOracleHealthEnabled: true,
        },
      })

      const prescriptionWithNullTracking: PrescriptionData = {
        ...mockPrescriptionWithTracking,
        attributes: {
          ...mockPrescriptionWithTracking.attributes,
          tracking: null,
        },
      }

      ;(usePrescriptions as jest.Mock).mockReturnValue({
        data: {
          ...mockPrescriptionsV1Data,
          data: [prescriptionWithNullTracking],
        },
      })

      const { result } = renderHook(() => useTrackingInfo('456'), { wrapper })

      await waitFor(() => {
        expect(result.current.isFetched).toBeTruthy()
      })

      expect(result.current.data).toBeUndefined()
    })
  })
})
