import * as Types from './types'
import {contentTypes, get, post, setRefreshToken} from './api'

import { context, fetch } from 'testUtils'

jest.mock('../actions/auth', () => {
  return {
    refreshAccessToken: (token: string): Promise<boolean>  => {
      return Promise.resolve(true)
    }
  }
})

context('api', () => {
  it('should handle GET requests', async () => {
    fetch.mockResolvedValue({ status: 200, json: () => Promise.resolve({ foo: 'test' }) })
    const result = await get<Types.UserData>('/foo')
    expect(result).toEqual(expect.objectContaining({ foo: 'test' }))
  })

  it('should handle GET request params', async () => {
    fetch.mockResolvedValue({ status: 200, json: () => Promise.resolve({ foo: 'test' }) })
    const result = await get('/foo', { p1: 'test', p2: 't&=$?est', ary: ['123', 'asdfasdf,d,asfd', '%%%'] })
    expect(result).toEqual(expect.objectContaining({ foo: 'test' }))
    // query params should be properly escaped
    expect(fetch).toHaveBeenCalledWith('https://test-api/foo?p1=test&p2=t%26%3D%24%3Fest&ary=123&ary=asdfasdf%2Cd%2Casfd&ary=%25%25%25', expect.anything())
  })

  it('should handle 204 correctly', async () => {
    fetch.mockResolvedValue({ status: 204, json: () => Promise.reject({ foo: 'test' }) })
    const result = await get('/foo')
    expect(result).toEqual(undefined)
    // query params should be properly escaped
    expect(fetch).toHaveBeenCalledWith('https://test-api/foo', expect.anything())
  })

  it('should handle >399 errors correctly', async () => {
    fetch.mockResolvedValue({ status: 400, text: () => Promise.resolve('status test') })
    expect(async () => get('/foo')).rejects.toBeCalled()
  })

  it('should handle POST correctly if contentType not specified', async () => {
    fetch.mockResolvedValue({ status: 200, json: () => Promise.resolve({ res: 'response' }) })
    const result = await post('/foo', { p1: 'test', p2: 't&=$?est', ary: ['123', 'asdfasdf,d,asfd', '%%%'] })

    // Default content type should be application/json
    const headers = expect.objectContaining({ 'Content-Type': contentTypes.applicationJson })

    const body = JSON.stringify({ p1: 'test', p2: 't&=$?est', ary: ['123', 'asdfasdf,d,asfd', '%%%'] })

    expect(fetch).toHaveBeenCalledWith('https://test-api/foo', expect.objectContaining({ method: 'POST', body, headers }))
    expect(result).toEqual(expect.objectContaining({ res: 'response' }))
  })

  it('should handle POST correctly if contentType is specified to be multipart/form-data', async () => {
    fetch.mockResolvedValue({ status: 200, json: () => Promise.resolve({ res: 'response' }) })
    const formData = new FormData

    const result = await post('/foo', {formData} , contentTypes.multipart)

    const headers = expect.objectContaining({ 'Content-Type': contentTypes.multipart })

    const body = formData

    expect(fetch).toHaveBeenCalledWith('https://test-api/foo', expect.objectContaining({ method: 'POST', body, headers }))
    expect(result).toEqual(expect.objectContaining({ res: 'response' }))
  })

  it('should handle 401 and make the call again', async () => {
    fetch.mockResolvedValueOnce({ status: 401, text: () => Promise.resolve('unauthorized') }).mockResolvedValueOnce({ status: 200, json: () => Promise.resolve({ foo: 'test' })})

    setRefreshToken('refresh')

    const result = await get<Types.UserData>('/foo')
    expect(result).toEqual(expect.objectContaining({ foo: 'test' }))
  })
})
