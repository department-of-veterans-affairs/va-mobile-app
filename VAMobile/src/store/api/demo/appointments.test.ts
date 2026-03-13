import { getAvsBinaries } from 'store/api/demo/appointments'
import { DemoStore } from 'store/api/demo/store'

describe('demo appointments API: getAvsBinaries', () => {
  it('returns undefined when endpoint does not include an appointment id', () => {
    const result = getAvsBinaries({} as DemoStore, { docIds: '208750417891' }, '/v0/appointments/avs_binaries')

    expect(result).toBeUndefined()
  })

  it('returns empty data when appointment id is not found in AVS mock data', () => {
    const result = getAvsBinaries({} as DemoStore, {}, '/v0/appointments/avs_binaries/does-not-exist')

    expect(result).toEqual({ data: [] })
  })

  it('filters AVS binaries by docIds and returns API-shaped response', () => {
    const result = getAvsBinaries(
      {} as DemoStore,
      { docIds: '208750417892' },
      '/v0/appointments/avs_binaries/testcerner001a',
    )

    expect(result).toEqual({
      data: [
        {
          id: '208750417892',
          type: 'avs_binary',
          attributes: {
            docId: '208750417892',
            binary: expect.any(String),
            error: null,
          },
        },
      ],
    })
  })

  it('returns all AVS binaries when docIds is not provided', () => {
    const result = getAvsBinaries({} as DemoStore, {}, '/v0/appointments/avs_binaries/testcerner001a')

    expect(result).toEqual({
      data: [
        {
          id: '208750417891',
          type: 'avs_binary',
          attributes: {
            docId: '208750417891',
            binary: expect.any(String),
            error: null,
          },
        },
        {
          id: '208750417892',
          type: 'avs_binary',
          attributes: {
            docId: '208750417892',
            binary: expect.any(String),
            error: null,
          },
        },
      ],
    })
  })
})
