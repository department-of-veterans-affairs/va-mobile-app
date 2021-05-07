import { refreshAccessToken } from 'store/actions/auth'
import _ from 'underscore'
import getEnv from 'utils/env'

const { API_ROOT } = getEnv()

let _token: string | undefined
let _refresh_token: string | undefined
let refreshPromise: Promise<boolean> | undefined

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

export type Params = {
  [key: string]: string | Array<string> | FormData
}

const doRequest = async function (method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE', endpoint: string, params: Params = {}): Promise<Response> {
  const token = _token
  const fetchObj: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      authorization: `Bearer ${token}`,
      'X-Key-Inflection': 'camel',
    },
  }

  if (params.formData) {
    fetchObj.headers = {
      ...fetchObj.headers,
      'Content-Type': 'multipart/form-data',
    }
    fetchObj.body = params.formData as FormData
  } else if (['POST', 'PUT', 'PATCH', 'DELETE'].indexOf(method) > -1) {
    fetchObj.headers = {
      ...fetchObj.headers,
      'Content-Type': 'application/json',
    }
    fetchObj.body = JSON.stringify(params)
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

const call = async function <T>(method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE', endpoint: string, params: Params = {}): Promise<T | undefined> {
  let response

  try {
    response = await doRequest(method, endpoint, params)
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
  const data = await response.json()
  return data
}

export const get = async function <T>(endpoint: string, params: Params = {}): Promise<T | undefined> {
  return call<T>('GET', endpoint, params)
}

export const post = async function <T>(endpoint: string, params: Params = {}): Promise<T | undefined> {
  return call<T>('POST', endpoint, params)
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
