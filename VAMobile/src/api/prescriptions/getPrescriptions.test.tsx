import React from 'react'
import { Provider } from 'react-redux'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react-native'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { usePrescriptions } from 'api/prescriptions/getPrescriptions'
import { PrescriptionsGetData } from 'api/types'
import * as api from 'store/api'
import { TrackedStore } from 'testUtils'
import { waygateEnabled } from 'utils/waygateConfig'

jest.mock('store/api')
jest.mock('utils/waygateConfig')
jest.mock('api/authorizedServices/getAuthorizedServices')

describe('usePrescriptions', () => {
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
    ;(useAuthorizedServices as jest.Mock).mockReturnValue({
      data: {
        prescriptions: true,
        medicationsOracleHealthEnabled: false,
      },
    })
    ;(waygateEnabled as jest.Mock).mockReturnValue({ enabled: false })
  })

  afterEach(() => {
    queryClient.clear()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store.realStore}>{children}</Provider>
    </QueryClientProvider>
  )

  const mockPrescriptionsV0: PrescriptionsGetData = {
    data: [
      {
        id: '123',
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
          prescriptionNumber: 'RX123',
          prescriptionName: 'Test Med',
          instructions: 'Take as directed',
          dispensedDate: null,
          stationNumber: 'STA123',
        },
      },
    ],
    meta: {
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalPages: 1,
        totalEntries: 1,
      },
      prescriptionStatusCount: {
        active: 1,
        isRefillable: 1,
        discontinued: 0,
        expired: 0,
        historical: 0,
        pending: 0,
        transferred: 0,
        submitted: 0,
        hold: 0,
        unknown: 0,
        total: 1,
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

  const mockPrescriptionsV1 = {
    data: [
      {
        ...mockPrescriptionsV0.data[0],
        attributes: {
          ...mockPrescriptionsV0.data[0].attributes,
          dataSourceSystem: 'oracle_health',
          prescriptionSource: 'test source',
          ndcNumber: '12345',
          prescribedDate: '2023-01-01',
          tracking_number: 'TRK123',
          shipper: 'UPS',
          trackingInfo: null,
        },
      },
    ],
    meta: mockPrescriptionsV0.meta,
    links: mockPrescriptionsV0.links,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch prescriptions using v0 API by default', async () => {
    const mockGet = api.get as jest.Mock
    mockGet.mockResolvedValueOnce(mockPrescriptionsV0)

    const { result } = renderHook(() => usePrescriptions(), { wrapper })

    await waitFor(() => {
      expect(result.current.isFetched).toBeTruthy()
    })

    expect(mockGet).toHaveBeenCalledWith('/v0/health/rx/prescriptions', expect.any(Object))
    expect(result.current.data).toEqual(mockPrescriptionsV0)
  })

  it('should use v1 API when waygate and authorization are enabled', async () => {
    const mockGet = api.get as jest.Mock
    mockGet.mockResolvedValueOnce(mockPrescriptionsV1)
    ;(waygateEnabled as jest.Mock).mockReturnValue({ enabled: true })
    ;(useAuthorizedServices as jest.Mock).mockReturnValue({
      data: {
        prescriptions: true,
        medicationsOracleHealthEnabled: true,
      },
    })

    const { result } = renderHook(() => usePrescriptions(), { wrapper })

    await waitFor(() => {
      expect(result.current.isFetched).toBeTruthy()
    })

    expect(mockGet).toHaveBeenCalledWith('/v1/health/rx/prescriptions', expect.any(Object))
    expect(result.current.data).toEqual(mockPrescriptionsV1)
  })

  it('should handle error responses', async () => {
    const mockGet = api.get as jest.Mock
    const error = new Error('API Error')
    mockGet.mockRejectedValueOnce(error)

    const { result } = renderHook(() => usePrescriptions(), { wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBeTruthy()
    })

    expect(result.current.error).toBeDefined()
  })

  it('should handle response data correctly', async () => {
    const mockGet = api.get as jest.Mock
    mockGet.mockResolvedValueOnce(mockPrescriptionsV0)

    const { result } = renderHook(() => usePrescriptions(), { wrapper })

    await waitFor(() => {
      expect(result.current.isFetched).toBeTruthy()
    })

    expect(result.current.data).toBeDefined()
    if (result.current.data) {
      expect(Array.isArray(result.current.data.data)).toBeTruthy()
      expect(result.current.data.data.length).toBe(1)
    }
  })

  it('should not call API if enabled is false', async () => {
    const mockGet = api.get as jest.Mock

    const { result } = renderHook(
      () =>
        usePrescriptions({
          enabled: false,
        }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.isFetched).toBeFalsy()
    })

    expect(mockGet).not.toHaveBeenCalled()
  })

  it('should not call API if prescriptions are not authorized', async () => {
    const mockGet = api.get as jest.Mock
    ;(useAuthorizedServices as jest.Mock).mockReturnValue({
      data: {
        prescriptions: false,
        medicationsOracleHealthEnabled: false,
      },
    })

    const { result } = renderHook(() => usePrescriptions(), { wrapper })

    await waitFor(() => {
      expect(result.current.isFetched).toBeFalsy()
    })

    expect(mockGet).not.toHaveBeenCalled()
  })

  it('should match v1 response type when using v1 API', async () => {
    const mockGet = api.get as jest.Mock
    mockGet.mockResolvedValueOnce(mockPrescriptionsV1)
    ;(waygateEnabled as jest.Mock).mockReturnValue({ enabled: true })
    ;(useAuthorizedServices as jest.Mock).mockReturnValue({
      data: {
        prescriptions: true,
        medicationsOracleHealthEnabled: true,
      },
    })

    const { result } = renderHook(() => usePrescriptions(), { wrapper })

    await waitFor(() => {
      expect(result.current.isFetched).toBeTruthy()
    })

    // Check that v1-specific fields are present
    if (result.current.data) {
      const prescription = result.current.data.data[0]
      expect(prescription.attributes).toHaveProperty('dataSourceSystem', 'oracle_health')
      expect(prescription.attributes).toHaveProperty('prescriptionSource', 'test source')
      expect(prescription.attributes).toHaveProperty('ndcNumber', '12345')
      expect(prescription.attributes).toHaveProperty('prescribedDate', '2023-01-01')
      expect(prescription.attributes).toHaveProperty('tracking_number', 'TRK123')
      expect(prescription.attributes).toHaveProperty('shipper', 'UPS')
      expect(prescription.attributes).toHaveProperty('trackingInfo', null)
    }
  })

  it('should use v0 API when waygate is disabled even if authorization is enabled', async () => {
    const mockGet = api.get as jest.Mock
    mockGet.mockResolvedValueOnce(mockPrescriptionsV0)
    ;(waygateEnabled as jest.Mock).mockReturnValue({ enabled: false })
    ;(useAuthorizedServices as jest.Mock).mockReturnValue({
      data: {
        prescriptions: true,
        medicationsOracleHealthEnabled: true,
      },
    })

    const { result } = renderHook(() => usePrescriptions(), { wrapper })

    await waitFor(() => {
      expect(result.current.isFetched).toBeTruthy()
    })

    expect(mockGet).toHaveBeenCalledWith('/v0/health/rx/prescriptions', expect.any(Object))
    expect(result.current.data).toEqual(mockPrescriptionsV0)
  })

  it('should use v0 API when authorization is disabled even if waygate is enabled', async () => {
    const mockGet = api.get as jest.Mock
    mockGet.mockResolvedValueOnce(mockPrescriptionsV0)
    ;(waygateEnabled as jest.Mock).mockReturnValue({ enabled: true })
    ;(useAuthorizedServices as jest.Mock).mockReturnValue({
      data: {
        prescriptions: true,
        medicationsOracleHealthEnabled: false,
      },
    })

    const { result } = renderHook(() => usePrescriptions(), { wrapper })

    await waitFor(() => {
      expect(result.current.isFetched).toBeTruthy()
    })

    expect(mockGet).toHaveBeenCalledWith('/v0/health/rx/prescriptions', expect.any(Object))
    expect(result.current.data).toEqual(mockPrescriptionsV0)
  })

  it('should call waygateEnabled with correct parameter', async () => {
    const mockGet = api.get as jest.Mock
    mockGet.mockResolvedValueOnce(mockPrescriptionsV0)

    const { result } = renderHook(() => usePrescriptions(), { wrapper })

    await waitFor(() => {
      expect(result.current.isFetched).toBeTruthy()
    })

    expect(waygateEnabled).toHaveBeenCalledWith('WG_MedsOracleHealthApiEnabled')
  })
})
