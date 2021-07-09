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
  vama_sm_save_draft: (totalTime: number, actionTime: number): Event => {
    return {
      name: 'vama_sm_save_draft',
      params: {
        totalTime,
        actionTime,
      },
    }
  },
  vama_sm_send_message: (totalTime: number, actionTime: number): Event => {
    return {
      name: 'vama_sm_send_message',
      params: {
        totalTime,
        actionTime,
      },
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
  vama_uses_letters: (): UserAnalytic => {
    return {
      name: 'vama_uses_letters',
      value: 'true',
    }
  },
  vama_uses_secure_messaging: (): UserAnalytic => {
    return {
      name: 'vama_uses_secure_messaging',
      value: 'true',
    }
  },
  vama_uses_claim_and_appeals: (): UserAnalytic => {
    return {
      name: 'vama_uses_claim_and_appeals',
      value: 'true',
    }
  },
  vama_uses_appointments: (): UserAnalytic => {
    return {
      name: 'vama_uses_appointments',
      value: 'true',
    }
  },
  vama_uses_profile: (): UserAnalytic => {
    return {
      name: 'vama_uses_profile',
      value: 'true',
    }
  },
  vama_uses_vcl: (): UserAnalytic => {
    return {
      name: 'vama_uses_vcl',
      value: 'true',
    }
  },
}
