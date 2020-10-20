import _ from 'underscore'
import getEnv from 'utils/env'

const { API_ROOT } = getEnv()

let _token: string | undefined

export const setAccessToken = (token?: string): void => {
  _token = token
}

export const getAccessToken = (): string | undefined => {
  return _token
}

type Params = {
  [key: string]: string | Array<string>
}

const call = async function <T>(method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE', endpoint: string, params: Params = {}): Promise<T | undefined> {
  const token = _token
  const fetchObj: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      authorization: `Bearer ${token}`,
    },
  }

  if (['POST', 'PUT', 'PATCH', 'DELETE'].indexOf(method) > -1) {
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

  //TODO update this for VA
  /*if (response.status === 401 && data.code === 'SESSION_EXPIRED') {
		return Promise.reject(new Error('session expired'))
	} else if (response.status >= 200 && response.status < 400) {
		return data
	} else {
		throw new Error(JSON.stringify(data))
	}
	*/

  const response = await fetch(`${API_ROOT}${endpoint}`, fetchObj)

  if (response.status === 204) {
    return
  }
  if (response.status > 399) {
    const text = await response.text()
    throw { status: response.status, text }
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
