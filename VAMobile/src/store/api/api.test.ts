import { context, fetch } from 'testUtils'

import { contentTypes, get, post } from './api'
import * as Types from './types'

jest.mock('store/slices', () => {
  return {
    refreshAccessToken: (): Promise<boolean> => {
      return Promise.resolve(true)
    },
  }
})

context('api', () => {
  it('should handle GET requests', async () => {
    const responseBlob = new Blob([JSON.stringify({ foo: 'test' }, null, 2)])
    const response = new Response(responseBlob, {
      status: 200,
      headers: { 'Content-Type': contentTypes.applicationJson },
    })
    fetch.mockResolvedValue(response)
    const result = await get<Types.UserData>('/foo')
    expect(result).toEqual(expect.objectContaining({ foo: 'test' }))
  })

  it('should handle GET request params', async () => {
    const responseBlob = new Blob([JSON.stringify({ foo: 'test' }, null, 2)])
    const response = new Response(responseBlob, {
      status: 200,
      headers: { 'Content-Type': contentTypes.applicationJson },
    })
    fetch.mockResolvedValue(response)
    const result = await get('/foo', { p1: 'test', p2: 't&=$?est', ary: ['123', 'asdfasdf,d,asfd', '%%%'] })
    expect(result).toEqual(expect.objectContaining({ foo: 'test' }))
    // query params should be properly escaped
    expect(fetch).toHaveBeenCalledWith(
      'https://test-api/foo?p1=test&p2=t%26%3D%24%3Fest&ary=123&ary=asdfasdf%2Cd%2Casfd&ary=%25%25%25',
      expect.anything(),
    )
  })

  it('should handle 204 correctly', async () => {
    fetch.mockResolvedValue({ status: 204, json: () => Promise.reject({ foo: 'test' }) })
    const result = await get('/foo')
    expect(result).toEqual(undefined)
    // query params should be properly escaped
    expect(fetch).toHaveBeenCalledWith('https://test-api/foo', expect.anything())
  })

  it('should handle >399 errors correctly', async () => {
    fetch.mockResolvedValue({ status: 400, text: () => Promise.resolve('status test'), clone: () => Promise.resolve() })
    await expect(async () => get('/foo')).rejects.toThrow()
  })

  it('should handle POST correctly if contentType not specified', async () => {
    const responseBlob = new Blob([JSON.stringify({ res: 'response' }, null, 2)])
    const response = new Response(responseBlob, {
      status: 200,
      headers: { 'Content-Type': contentTypes.applicationJson },
    })
    fetch.mockResolvedValue(response)
    const result = await post('/foo', { p1: 'test', p2: 't&=$?est', ary: ['123', 'asdfasdf,d,asfd', '%%%'] })

    // Default content type should be application/json
    const headers = expect.objectContaining({ 'Content-Type': contentTypes.applicationJson })

    const body = JSON.stringify({ p1: 'test', p2: 't&=$?est', ary: ['123', 'asdfasdf,d,asfd', '%%%'] })

    expect(fetch).toHaveBeenCalledWith(
      'https://test-api/foo',
      expect.objectContaining({ method: 'POST', body, headers }),
    )
    expect(result).toEqual(expect.objectContaining({ res: 'response' }))
  })

  it('should handle POST correctly if contentType is specified to be multipart/form-data', async () => {
    const responseBlob = new Blob([JSON.stringify({ res: 'response' }, null, 2)])
    const response = new Response(responseBlob, {
      status: 200,
      headers: { 'Content-Type': contentTypes.applicationJson },
    })
    fetch.mockResolvedValue(response)
    const formData = new FormData()

    const result = await post('/foo', { formData }, contentTypes.multipart)

    const headers = expect.objectContaining({ 'Content-Type': contentTypes.multipart })

    const body = { formData: formData }

    expect(fetch).toHaveBeenCalledWith(
      'https://test-api/foo',
      expect.objectContaining({ method: 'POST', body, headers }),
    )
    expect(result).toEqual(expect.objectContaining({ res: 'response' }))
  })

  it("returns undefined when the Content-Type of a successful response is not 'application/json'", async () => {
    const responseBlob = new Blob(['Success'])
    const response = new Response(responseBlob, { status: 200, headers: { 'Content-Type': 'text/html' } })
    fetch.mockResolvedValue(response)
    const result = await post('/v0/user/logged-in')
    expect(result).toEqual(undefined)
  })
})
