import { refreshAccessToken } from 'store/actions/auth'
import { transform } from './demo/store'
import _ from 'underscore'
import getEnv from 'utils/env'

const { API_ROOT } = getEnv()

let _token: string | undefined
let _refresh_token: string | undefined
let refreshPromise: Promise<boolean> | undefined
let _demoMode = false

export const setAccessToken = (token?: string): void => {
  _token = token
}

export const getAccessToken = (): string | undefined => {
  return _token
}

export const setRefreshToken = (token?: string): void => {
  _refresh_token = token
}

export const getRefreshToken = (): string | undefined => {
  return _refresh_token
}

export const setDemoMode = (demoMode: boolean): void => {
  console.log('api done')
  _demoMode = demoMode
}

export type Params = {
  [key: string]: string | Array<string> | FormData
}

export type ContentTypes = 'application/json' | 'multipart/form-data'

export const contentTypes: {
  applicationJson: ContentTypes
  multipart: ContentTypes
} = {
  applicationJson: 'application/json',
  multipart: 'multipart/form-data',
}

const doRequest = async function (
  method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE',
  endpoint: string,
  params: Params = {},
  contentType: ContentTypes = contentTypes.applicationJson,
): Promise<Response> {
  const fetchObj: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      authorization: `Bearer ${_token}`,
      'X-Key-Inflection': 'camel',
    },
  }

  if (['POST', 'PUT', 'PATCH', 'DELETE'].indexOf(method) > -1) {
    fetchObj.headers = {
      ...fetchObj.headers,
      'Content-Type': contentType,
    }
    fetchObj.body = contentType === contentTypes.multipart ? ((params as unknown) as FormData) : JSON.stringify(params)
  } else {
    if (_.keys(params).length > 0) {
      endpoint +=
        '?' +
        _.map(params, (val, key) => {
          if (val instanceof Array) {
            return _.map(val, (v) => {
              return `${encodeURIComponent(key)}=${encodeURIComponent(v)}`
            }).join('&')
          } else {
            return `${encodeURIComponent(key)}=${encodeURIComponent(val as string)}`
          }
        }).join('&')
    }
  }

  return fetch(`${API_ROOT}${endpoint}`, fetchObj)
}

const call = async function <T>(method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE', endpoint: string, params: Params = {}, contentType?: ContentTypes): Promise<T | undefined> {
  if (!_demoMode) {
    let response

    try {
      response = await doRequest(method, endpoint, params, contentType)
    } catch (networkError) {
      throw { networkError: true }
    }

    if (response.status === 401) {
      console.debug('API: Authentication failed for ' + endpoint + ', attempting to refresh access token')
      // If the access token is expired, attempt to refresh it and redo the request
      if (!refreshPromise) {
        // If there is not already a refresh request in flight, create one
        refreshPromise = refreshAccessToken(_refresh_token || '')
      }

      // Wait for the token refresh to complete and try the call again
      const didRefresh = await refreshPromise
      refreshPromise = undefined

      if (didRefresh) {
        console.debug('Refreshed access token, attempting ' + endpoint + ' request again')
        response = await doRequest(method, endpoint, params)
      }
    }
    if (response.status === 204) {
      return
    }
    if (response.status > 399) {
      // clone response to access the response stream twice
      const clonedResponse = await response.clone()
      const json = await clonedResponse.json()
      const text = await response.text()

      throw { status: response.status, text, json }
    }
    return await response.json()
  } else {
    return (transform(method, endpoint, params) as unknown) as T
  }
}

export const get = async function <T>(endpoint: string, params: Params = {}): Promise<T | undefined> {
  return call<T>('GET', endpoint, params)
}

export const post = async function <T>(endpoint: string, params: Params = {}, contentType?: ContentTypes): Promise<T | undefined> {
  return call<T>('POST', endpoint, params, contentType)
}

export const put = async function <T>(endpoint: string, params: Params = {}): Promise<T | undefined> {
  return call<T>('PUT', endpoint, params)
}

export const patch = async function <T>(endpoint: string, params: Params = {}): Promise<T | undefined> {
  return call<T>('PATCH', endpoint, params)
}

export const del = async function <T>(endpoint: string, params: Params = {}): Promise<T | undefined> {
  return call<T>('DELETE', endpoint, params)
}
