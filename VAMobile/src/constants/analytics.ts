import { Event, UserAnalytic } from 'utils/analytics'

export const Events = {
  vama_login_success: (): Event => {
    return {
      name: 'vama_login_success',
    }
  },
  vama_login_fail: (): Event => {
    return {
      name: 'vama_login_fail',
    }
  },
  vama_sm_send_message: (): Event => {
    return {
      name: 'vama_sm_send_message',
    }
  },
}

export const UserAnalytics = {
  vama_login_uses_biometric: (value: boolean): UserAnalytic => {
    return {
      name: 'vama_login_uses_biometric',
      value: value.toString(),
    }
  },
  vama_login_biometric_device: (value: boolean): UserAnalytic => {
    return {
      name: 'vama_login_biometric_device',
      value: value.toString(),
    }
  },
  vama_environment: (value: string): UserAnalytic => {
    return {
      name: 'vama_environment',
      value: value,
    }
  },
}
