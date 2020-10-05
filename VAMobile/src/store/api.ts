import _ from 'underscore'

const API_ROOT = ''

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

export const call = async function <T>(method: string, endpoint: string, params: Params = {}): Promise<T | void> {
	const token = _token
	const fetchObj: RequestInit = {
		method,
		credentials: 'include',
		headers: {
			authorization: `Bearer ${token}`,
		},
	}
	method = method.toUpperCase()

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
		return Promise.resolve()
	}
	if (response.status > 399) {
		return response.text().then((text) => {
			return Promise.reject({ status: response.status, text })
		})
	}
	const data = await response.json()
	return data
}
