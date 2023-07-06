import { CategoryTypes } from 'store/api'
import { Event, UserAnalytic } from 'utils/analytics'

/**
 * Firebase strings have to be less than 24 chars or it doesn't go through. this lint rule enforces that.
 */
/*eslint id-length: ["error", { "max": 24 }]*/
export const Events = {
  vama_appt_cancel: (isPendingAppointment: boolean): Event => {
    return {
      name: 'vama_appt_cancel',
      params: {
        isPending: isPendingAppointment,
      },
    }
  },
  vama_appt_view_details: (isPendingAppointment: boolean): Event => {
    return {
      name: 'vama_appt_view_details',
      params: {
        isPending: isPendingAppointment,
      },
    }
  },
  // Issue#2273 Track appointment pagination discrepancies
  vama_appts_page_warning: (): Event => {
    return {
      name: 'vama_appts_page_warning',
    }
  },
  vama_auth_completed: (): Event => {
    return {
      name: 'vama_auth_completed',
    }
  },
  vama_claim_file_request: (): Event => {
    return {
      name: 'vama_claim_file_request',
    }
  },
  vama_claim_step_three: (): Event => {
    return {
      name: 'vama_claim_step_three',
    }
  },
  vama_claim_upload_compl: (): Event => {
    return {
      name: 'vama_claim_upload_compl',
    }
  },
  vama_claim_upload_fail: (): Event => {
    return {
      name: 'vama_claim_upload_fail',
    }
  },
  vama_claim_upload_start: (): Event => {
    return {
      name: 'vama_claim_upload_start',
    }
  },
  vama_covid_links: (referringScreen: string): Event => {
    return {
      name: 'vama_covid_links',
      params: {
        referringScreen,
      },
    }
  },
  vama_ddl_button_shown: (): Event => {
    return {
      name: 'vama_ddl_button_shown',
    }
  },
  vama_ddl_landing_click: (): Event => {
    return {
      name: 'vama_ddl_landing_click',
    }
  },
  vama_ddl_letter_view: (): Event => {
    return {
      name: 'vama_ddl_letter_view',
    }
  },
  vama_ddl_status_click: (): Event => {
    return {
      name: 'vama_ddl_status_click',
    }
  },
  vama_eu_skipped: (): Event => {
    return {
      name: 'vama_eu_skipped',
    }
  },
  vama_eu_shown: (): Event => {
    return {
      name: 'vama_eu_shown',
    }
  },
  vama_eu_updated: (): Event => {
    return {
      name: 'vama_eu_updated',
    }
  },
  vama_eu_updated_success: (): Event => {
    return {
      name: 'vama_eu_updated_success',
    }
  },
  vama_exchange_failed: (): Event => {
    return {
      name: 'vama_exchange_failed',
    }
  },
  vama_fail: (): Event => {
    return {
      name: 'vama_fail',
    }
  },
  vama_fail_refresh: (): Event => {
    return {
      name: 'vama_fail_refresh',
    }
  },
  vama_gender_id_fail: (): Event => {
    return {
      name: 'vama_gender_id_fail',
    }
  },
  vama_gender_id_help: (): Event => {
    return {
      name: 'vama_gender_id_help',
    }
  },
  vama_gender_id_success: (): Event => {
    return {
      name: 'vama_gender_id_success',
    }
  },
  vama_letter_download: (letterName: string): Event => {
    return {
      name: 'vama_letter_download',
      params: {
        letterName,
      },
    }
  },
  vama_login_closed: (isSIS = false): Event => {
    return {
      name: 'vama_login_closed',
      params: {
        sis: isSIS.toString(),
      },
    }
  },
  vama_login_fail: (error: Error, isSIS = false): Event => {
    return {
      name: 'vama_login_fail',
      params: {
        error: JSON.stringify(error),
        sis: isSIS.toString(),
      },
    }
  },
  vama_login_start: (isSIS = false): Event => {
    return {
      name: 'vama_login_start',
      params: {
        sis: isSIS.toString(),
      },
    }
  },
  vama_login_success: (isSIS = false): Event => {
    return {
      name: 'vama_login_success',
      params: {
        sis: isSIS.toString(),
      },
    }
  },
  vama_pagination: (pages: number, to_page: number, tab?: string): Event => {
    return {
      name: 'vama_pagination',
      params: {
        pages: pages,
        to_page: to_page,
        tab: tab,
      },
    }
  },
  vama_pref_name_fail: (): Event => {
    return {
      name: 'vama_pref_name_fail',
    }
  },
  vama_pref_name_success: (): Event => {
    return {
      name: 'vama_pref_name_success',
    }
  },
  vama_prof_update_address: (totalTime: number, actionTime: number): Event => {
    return {
      name: 'vama_prof_update_address',
      params: {
        totalTime,
        actionTime,
      },
    }
  },
  vama_prof_update_email: (totalTime: number, actionTime: number): Event => {
    return {
      name: 'vama_prof_update_email',
      params: {
        totalTime,
        actionTime,
      },
    }
  },
  vama_prof_update_gender: (totalTime: number, actionTime: number): Event => {
    return {
      name: 'vama_prof_update_gender',
      params: {
        totalTime,
        actionTime,
      },
    }
  },
  vama_prof_update_phone: (totalTime: number, actionTime: number): Event => {
    return {
      name: 'vama_prof_update_phone',
      params: {
        totalTime,
        actionTime,
      },
    }
  },
  vama_rx_cerner_exp: (): Event => {
    return {
      name: 'vama_rx_cerner_exp ',
    }
  },
  vama_rx_det_open_tt: (pages_touched: number, totalTime: number): Event => {
    return {
      name: 'vama_rx_det_open_tt',
      params: {
        pages_touched: pages_touched,
        totalTime: totalTime,
      },
    }
  },
  vama_rx_details: (rx_id: string): Event => {
    return {
      name: 'vama_rx_details ',
      params: {
        rx_id: rx_id,
      },
    }
  },
  vama_rx_help: (): Event => {
    return {
      name: 'vama_rx_help',
    }
  },
  vama_rx_filter: (): Event => {
    return {
      name: 'vama_rx_filter',
    }
  },
  vama_rx_filter_sel: (filter: string): Event => {
    return {
      name: 'vama_rx_filter_sel',
      params: {
        filter,
      },
    }
  },
  vama_rx_first_refill_ttc: (totalTime: number): Event => {
    return {
      name: 'vama_rx_first_refill_ttc',
      params: {
        totalTime: totalTime,
      },
    }
  },
  vama_rx_na: (): Event => {
    return {
      name: 'vama_rx_na',
    }
  },
  vama_rx_noauth: (): Event => {
    return {
      name: 'vama_rx_noauth',
    }
  },
  vama_rx_pendingtab: (): Event => {
    return {
      name: 'vama_rx_pendingtab',
    }
  },
  vama_rx_refill_cerner: (): Event => {
    return {
      name: 'vama_rx_refill_cerner',
    }
  },
  vama_rx_refill_fail: (rx_ids: string[]): Event => {
    return {
      name: 'vama_rx_refill_fail',
      params: {
        rx_ids: rx_ids,
      },
    }
  },
  vama_rx_refill_retry: (rx_ids: string[]): Event => {
    return {
      name: 'vama_rx_refill_retry',
      params: {
        rx_ids: rx_ids,
      },
    }
  },
  vama_rx_refill_success: (rx_ids: string[]): Event => {
    return {
      name: 'vama_rx_refill_success',
      params: {
        rx_ids: rx_ids,
      },
    }
  },
  vama_rx_request_cancel: (rx_ids: string[]): Event => {
    return {
      name: 'vama_rx_request_cancel ',
      params: {
        rx_ids: rx_ids,
      },
    }
  },
  vama_rx_request_confirm: (rx_ids: string[]): Event => {
    return {
      name: 'vama_rx_request_confirm',
      params: {
        rx_ids: rx_ids,
      },
    }
  },
  vama_rx_request_start: (rx_ids: string[]): Event => {
    return {
      name: 'vama_rx_request_start',
      params: {
        rx_ids: rx_ids,
      },
    }
  },
  vama_rx_select_all: (): Event => {
    return {
      name: 'vama_rx_select_all',
    }
  },
  vama_rx_sort: (): Event => {
    return {
      name: 'vama_rx_sort',
    }
  },
  vama_rx_sort_sel: (sort: string): Event => {
    return {
      name: 'vama_rx_sort_sel',
      params: {
        sort,
      },
    }
  },
  vama_rx_status: (status: string, ttv: number): Event => {
    return {
      name: 'vama_rx_status',
      params: {
        status: status,
        ttv: ttv,
      },
    }
  },
  vama_rx_trackdet: (rx_id: string): Event => {
    return {
      name: 'vama_rx_trackdet',
      params: {
        rx_id: rx_id,
      },
    }
  },
  vama_rx_trackdetnum: (rx_id: string): Event => {
    return {
      name: 'vama_rx_trackdetnum',
      params: {
        rx_id: rx_id,
      },
    }
  },
  vama_rx_trackdet_close: (rx_id: string): Event => {
    return {
      name: 'vama_rx_trackdet_close',
      params: {
        rx_id: rx_id,
      },
    }
  },
  vama_rx_trackingtab: (): Event => {
    return {
      name: 'vama_rx_trackingtab',
    }
  },
  vama_sm_change_category: (messageCategory: CategoryTypes, previousCategory: CategoryTypes): Event => {
    return {
      name: 'vama_sm_change_category',
      params: {
        messageCategory,
        previousCategory,
      },
    }
  },
  vama_sm_save_draft: (totalTime: number, actionTime: number, messageCategory: CategoryTypes): Event => {
    return {
      name: 'vama_sm_save_draft',
      params: {
        totalTime,
        actionTime,
        messageCategory,
      },
    }
  },
  vama_sm_send_message: (totalTime: number, actionTime: number, messageCategory: CategoryTypes): Event => {
    return {
      name: 'vama_sm_send_message',
      params: {
        totalTime,
        actionTime,
        messageCategory,
      },
    }
  },
  vama_ttv_appt_details: (totalTime: number): Event => {
    return {
      name: 'vama_ttv_appt_details',
      params: {
        totalTime,
      },
    }
  },
  vama_ttv_cap_details: (totalTime: number): Event => {
    return {
      name: 'vama_ttv_cap_details',
      params: {
        totalTime,
      },
    }
  },
  vama_update_dir_dep: (totalTime: number, actionTime: number): Event => {
    return {
      name: 'vama_update_dir_dep',
      params: {
        totalTime,
        actionTime,
      },
    }
  },
  vama_vaccine_details: (groupName: string): Event => {
    return {
      name: 'vama_vaccine_details',
      params: {
        groupName,
      },
    }
  },
  vama_whatsnew_alert: (): Event => {
    return {
      name: 'vama_whatsnew_alert',
    }
  },
  vama_whatsnew_close: (): Event => {
    return {
      name: 'vama_whatsnew_close',
    }
  },
  vama_whatsnew_dont_show: (): Event => {
    return {
      name: 'vama_whatsnew_dont_show',
    }
  },
  vama_whatsnew_more: (): Event => {
    return {
      name: 'vama_whatsnew_more',
    }
  },
}

export const UserAnalytics = {
  vama_uses_biometric: (value: boolean): UserAnalytic => {
    return {
      name: 'vama_uses_biometric',
      value: value.toString(),
    }
  },
  vama_biometric_device: (value: boolean): UserAnalytic => {
    return {
      name: 'vama_biometric_device',
      value: value.toString(),
    }
  },
  vama_environment: (value: string): UserAnalytic => {
    return {
      name: 'vama_environment',
      value: value,
    }
  },
  vama_haptic_setting_on: (): UserAnalytic => {
    return {
      name: 'vama_haptic_setting_on',
      value: 'true',
    }
  },
  vama_haptic_setting_off: (): UserAnalytic => {
    return {
      name: 'vama_haptic_setting_off',
      value: 'true',
    }
  },
  vama_uses_letters: (): UserAnalytic => {
    return {
      name: 'vama_uses_letters',
      value: 'true',
    }
  },
  vama_uses_rx: (): UserAnalytic => {
    return {
      name: 'vama_uses_rx',
      value: 'true',
    }
  },
  vama_uses_sm: (): UserAnalytic => {
    return {
      name: 'vama_uses_sm',
      value: 'true',
    }
  },
  vama_uses_cap: (): UserAnalytic => {
    return {
      name: 'vama_uses_cap',
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
  vama_uses_preferred_name: (): UserAnalytic => {
    return {
      name: 'vama_uses_preferred_name',
      value: 'true',
    }
  },
  vama_uses_vcl: (): UserAnalytic => {
    return {
      name: 'vama_uses_vcl',
      value: 'true',
    }
  },
  vama_uses_large_text: (value: boolean): UserAnalytic => {
    return {
      name: 'vama_uses_large_text',
      value: value.toString(),
    }
  },
  vama_uses_screen_reader: (value: boolean): UserAnalytic => {
    return {
      name: 'vama_uses_screen_reader',
      value: value.toString(),
    }
  },
}
