import { CategoryTypes } from 'store/api'
import { Event, EventParams, UserAnalytic } from 'utils/analytics'

/**
 * Firebase strings have to be less than 24 chars or it doesn't go through. this lint rule enforces that.
 */
/*eslint id-length: ["error", { "max": 24 }]*/
export const Events = {
  vama_accordion_click: (section: string, isOpened: boolean): Event => {
    return {
      name: 'vama_accordion_click',
      params: {
        section: section,
        isOpened: isOpened,
      },
    }
  },
  vama_appt_cancel: (
    isPendingAppointment: boolean,
    apt_id: string | undefined,
    apt_status: string | undefined,
    apt_type: string | undefined,
    days_to_apt: number | undefined,
  ): Event => {
    return {
      name: 'vama_appt_cancel',
      params: {
        isPending: isPendingAppointment,
        apt_id: apt_id,
        apt_status: apt_status,
        apt_type: apt_type,
        days_to_apt: days_to_apt,
      },
    }
  },
  vama_appt_view_details: (
    isPendingAppointment: boolean,
    apt_id: string | undefined,
    apt_status: string | undefined,
    apt_type: string | undefined,
    days_to_apt: number | undefined,
  ): Event => {
    return {
      name: 'vama_appt_view_details',
      params: {
        isPending: isPendingAppointment,
        apt_id: apt_id,
        apt_status: apt_status,
        apt_type: apt_type,
        days_to_apt: days_to_apt,
      },
    }
  },
  // Issue#2273 Track appointment pagination discrepancies
  vama_appts_page_warning: (): Event => {
    return {
      name: 'vama_appts_page_warning',
    }
  },
  vama_apt_add_cal: (apt_id: string, apt_status: string | undefined, apt_type: string, days_to_apt: number): Event => {
    return {
      name: 'vama_apt_add_cal',
      params: {
        apt_id: apt_id,
        apt_status: apt_status,
        apt_type: apt_type,
        days_to_apt: days_to_apt,
      },
    }
  },
  vama_apt_cancel_clicks: (apt_id: string, apt_status: string, apt_type: string, days_to_apt: number, step: string): Event => {
    return {
      name: 'vama_apt_cancel_clicks',
      params: {
        apt_id: apt_id,
        apt_status: apt_status,
        apt_type: apt_type,
        days_to_apt: days_to_apt,
        step: step,
      },
    }
  },
  vama_auth_completed: (): Event => {
    return {
      name: 'vama_auth_completed',
    }
  },
  vama_claim_call: (claim_id: string, claim_type: string, claim_step: number): Event => {
    return {
      name: 'vama_claim_call',
      params: {
        claim_id,
        claim_type,
        claim_step,
      },
    }
  },
  vama_claim_count: (closed_claims: number, open_claims: number, claims_tab: string): Event => {
    return {
      name: 'vama_claim_count',
      params: {
        closed_claims,
        open_claims,
        claims_tab,
      },
    }
  },
  vama_claim_details_exp: (claim_id: string, claim_type: string, claim_step: number, step_expanded: boolean, claim_step_change: string, claim_submitted_date: string): Event => {
    return {
      name: 'vama_claim_details_exp',
      params: {
        claim_id,
        claim_type,
        claim_step,
        step_expanded,
        claim_step_change,
        claim_submitted_date,
      },
    }
  },
  vama_claim_details_open: (claim_id: string, claim_type: string, claim_step: number, claim_step_change: string, claim_submitted_date: string): Event => {
    return {
      name: 'vama_claim_details_open',
      params: {
        claim_id,
        claim_type,
        claim_step,
        claim_step_change,
        claim_submitted_date,
      },
    }
  },
  vama_claim_details_tab: (claim_id: string, claim_type: string, claim_step: number, claim_submitted_date: string): Event => {
    return {
      name: 'vama_claim_details_tab',
      params: {
        claim_id,
        claim_type,
        claim_step,
        claim_submitted_date,
      },
    }
  },
  vama_claim_details_ttv: (claim_id: string, claim_type: string, claim_step: number, claim_step_change: string, claim_submitted_date: string, ttv_claim_details: number): Event => {
    return {
      name: 'vama_claim_details_ttv',
      params: {
        claim_id,
        claim_type,
        claim_step,
        claim_step_change,
        claim_submitted_date,
        ttv_claim_details,
      },
    }
  },
  vama_claim_disag: (claim_id: string, claim_type: string, claim_step: number): Event => {
    return {
      name: 'vama_claim_disag',
      params: {
        claim_id,
        claim_type,
        claim_step,
      },
    }
  },
  vama_claim_eval: (claim_id: string, claim_type: string, claim_step: number, num_requests: number): Event => {
    return {
      name: 'vama_claim_eval',
      params: {
        claim_id,
        claim_type,
        claim_step,
        num_requests,
      },
    }
  },
  vama_claim_eval_cancel: (claim_id: string, claim_type: string, claim_step: number, num_requests: number): Event => {
    return {
      name: 'vama_claim_eval_cancel',
      params: {
        claim_id,
        claim_type,
        claim_step,
        num_requests,
      },
    }
  },
  vama_claim_eval_check: (claim_id: string, claim_type: string, num_requests: number): Event => {
    return {
      name: 'vama_claim_eval_check',
      params: {
        claim_id,
        claim_type,
        num_requests,
      },
    }
  },
  vama_claim_eval_conf: (claim_id: string, claim_type: string, num_requests: number): Event => {
    return {
      name: 'vama_claim_eval_conf',
      params: {
        claim_id,
        claim_type,
        num_requests,
      },
    }
  },
  vama_claim_eval_submit: (claim_id: string, claim_type: string, num_requests: number): Event => {
    return {
      name: 'vama_claim_eval_submit',
      params: {
        claim_id,
        claim_type,
        num_requests,
      },
    }
  },
  vama_claim_file_request: (): Event => {
    return {
      name: 'vama_claim_file_request',
    }
  },
  vama_claim_review: (claim_id: string, claim_type: string, num_requests: number): Event => {
    return {
      name: 'vama_claim_review',
      params: {
        claim_id,
        claim_type,
        num_requests,
      },
    }
  },
  vama_claim_status_tab: (claim_id: string, claim_type: string, claim_step: number, claim_submitted_date: string): Event => {
    return {
      name: 'vama_claim_status_tab',
      params: {
        claim_id,
        claim_type,
        claim_step,
        claim_submitted_date,
      },
    }
  },
  vama_claim_upload_compl: (claim_id: string, claim_request_id: number | null, claim_request_type: string, evidence_method: string): Event => {
    return {
      name: 'vama_claim_upload_compl',
      params: {
        claim_id,
        claim_request_id,
        claim_request_type,
        evidence_method,
      },
    }
  },
  vama_claim_upload_fail: (claim_id: string, claim_request_id: number | null, claim_request_type: string, evidence_method: string): Event => {
    return {
      name: 'vama_claim_upload_fail',
      params: {
        claim_id,
        claim_request_id,
        claim_request_type,
        evidence_method,
      },
    }
  },
  vama_claim_upload_start: (claim_id: string, claim_request_id: number | null, claim_request_type: string, evidence_method: string): Event => {
    return {
      name: 'vama_claim_upload_start',
      params: {
        claim_id,
        claim_request_id,
        claim_request_type,
        evidence_method,
      },
    }
  },
  vama_claim_why_combine: (claim_id: string, claim_type: string, claim_step: number): Event => {
    return {
      name: 'vama_claim_why_combine',
      params: {
        claim_id,
        claim_type,
        claim_step,
      },
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
  vama_error: (errorName: string, errorMessage: string, callStack?: string, statusCode?: number, endpoint?: string): Event => {
    return {
      name: 'vama_error',
      params: {
        errorName,
        errorMessage,
        callStack,
        statusCode,
        endpoint,
      },
    }
  },
  vama_eu_shown: (): Event => {
    return {
      name: 'vama_eu_shown',
    }
  },
  vama_eu_skipped: (): Event => {
    return {
      name: 'vama_eu_skipped',
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
  vama_evidence_cancel_1: (claim_id: string, claim_request_id: number | null, claim_request_type: string, evidence_method: string): Event => {
    return {
      name: 'vama_claim_cancel_1',
      params: {
        claim_id,
        claim_request_id,
        claim_request_type,
        evidence_method,
      },
    }
  },
  vama_evidence_cancel_2: (claim_id: string, claim_request_id: number | null, claim_request_type: string, evidence_method: string): Event => {
    return {
      name: 'vama_claim_cancel_2',
      params: {
        claim_id,
        claim_request_id,
        claim_request_type,
        evidence_method,
      },
    }
  },
  vama_evidence_conf: (claim_id: string, claim_request_id: number | null, claim_request_type: string, evidence_method: string): Event => {
    return {
      name: 'vama_evidence_conf',
      params: {
        claim_id,
        claim_request_id,
        claim_request_type,
        evidence_method,
      },
    }
  },
  vama_evidence_cont_1: (claim_id: string, claim_request_id: number | null, claim_request_type: string, evidence_method: string): Event => {
    return {
      name: 'vama_evidence_cont_1',
      params: {
        claim_id,
        claim_request_id,
        claim_request_type,
        evidence_method,
      },
    }
  },
  vama_evidence_cont_2: (
    claim_id: string,
    claim_request_id: number | null,
    claim_request_type: string,
    evidence_method: string,
    upload_size: number,
    num_photos: number,
  ): Event => {
    return {
      name: 'vama_evidence_cont_2',
      params: {
        claim_id,
        claim_request_id,
        claim_request_type,
        evidence_method,
        upload_size,
        num_photos,
      },
    }
  },
  vama_evidence_cont_3: (claim_id: string, claim_request_id: number | null, claim_request_type: string, evidence_method: string): Event => {
    return {
      name: 'vama_evidence_cont_3',
      params: {
        claim_id,
        claim_request_id,
        claim_request_type,
        evidence_method,
      },
    }
  },
  vama_evidence_start: (claim_id: string, claim_request_id: number | null, claim_request_type: string, evidence_method: string): Event => {
    return {
      name: 'vama_evidence_start',
      params: {
        claim_id,
        claim_request_id,
        claim_request_type,
        evidence_method,
      },
    }
  },
  vama_evidence_type: (claim_id: string, claim_request_id: number | null, claim_request_type: string, evidence_method: string, evidence_type: string): Event => {
    return {
      name: 'vama_evidence_type',
      params: {
        claim_id,
        claim_request_id,
        claim_request_type,
        evidence_method,
        evidence_type,
      },
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
  vama_find_location: (): Event => {
    return {
      name: 'vama_find_location',
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
  vama_link_click: (params: EventParams): Event => {
    return {
      name: 'vama_link_click',
      params,
    }
  },
  vama_link_confirm: (params: EventParams): Event => {
    return {
      name: 'vama_link_confirm',
      params,
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
  vama_modalpick_open: (modal: string): Event => {
    return {
      name: 'vama_modalpick_open',
      params: {
        modal: modal,
      },
    }
  },
  vama_modalpick_sel: (modal: string, selection: string): Event => {
    return {
      name: 'vama_modalpick_sel',
      params: {
        modal: modal,
        selection: selection,
      },
    }
  },
  vama_notification_click: (notification_url?: string): Event => {
    return {
      name: 'vama_notification_click',
      params: {
        notification_url,
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
  vama_request_details: (claim_id: string, claim_request_id: number | null, claim_request_type: string): Event => {
    return {
      name: 'vama_request_details',
      params: {
        claim_id,
        claim_request_id,
        claim_request_type,
      },
    }
  },
  vama_rx_cerner_exp: (): Event => {
    return {
      name: 'vama_rx_cerner_exp ',
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
  vama_rx_help: (): Event => {
    return {
      name: 'vama_rx_help',
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
  vama_segcontrol_click: (label: string): Event => {
    return {
      name: 'vama_segcontrol_click',
      params: {
        label: label,
      },
    }
  },
  vama_select_all: (): Event => {
    return {
      name: 'vama_select_all',
    }
  },
  vama_sm_attach: (type: string): Event => {
    return {
      name: 'vama_sm_attach',
      params: {
        type: type,
      },
    }
  },
  vama_sm_attach_outcome: (attached: string): Event => {
    return {
      name: 'vama_sm_attach_outcome',
      params: {
        attached: attached,
      },
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
  vama_sm_folder_open: (folder: string): Event => {
    return {
      name: 'vama_sm_folder_open',
      params: {
        folder: folder,
      },
    }
  },
  vama_sm_folders: (draft_count: number): Event => {
    return {
      name: 'vama_sm_folders',
      params: {
        draft_count: draft_count,
      },
    }
  },
  vama_sm_move: (): Event => {
    return {
      name: 'vama_sm_move',
    }
  },
  vama_sm_move_outcome: (outcome: string): Event => {
    return {
      name: 'vama_sm_move_outcome',
      params: {
        outcome: outcome,
      },
    }
  },
  vama_sm_nonurgent: (): Event => {
    return {
      name: 'vama_sm_nonurgent',
    }
  },
  vama_sm_open: (sm_id: number, location: string, status: string): Event => {
    return {
      name: 'vama_sm_open',
      params: {
        sm_id: sm_id,
        location: location,
        status: status,
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
  vama_sm_send_message: (totalTime: number, actionTime: number, messageCategory: CategoryTypes, replyToID: number | undefined): Event => {
    return {
      name: 'vama_sm_send_message',
      params: {
        totalTime,
        actionTime,
        messageCategory,
        replyToID,
      },
    }
  },
  vama_sm_start: (): Event => {
    return {
      name: 'vama_sm_start',
    }
  },
  vama_snackbar_null: (location: string): Event => {
    return {
      name: 'vama_snackbar_null',
      params: {
        location,
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
  vama_haptic_setting_off: (): UserAnalytic => {
    return {
      name: 'vama_haptic_setting_off',
      value: 'true',
    }
  },
  vama_haptic_setting_on: (): UserAnalytic => {
    return {
      name: 'vama_haptic_setting_on',
      value: 'true',
    }
  },
  vama_uses_appointments: (): UserAnalytic => {
    return {
      name: 'vama_uses_appointments',
      value: 'true',
    }
  },
  vama_uses_biometric: (value: boolean): UserAnalytic => {
    return {
      name: 'vama_uses_biometric',
      value: value.toString(),
    }
  },
  vama_uses_cap: (): UserAnalytic => {
    return {
      name: 'vama_uses_cap',
      value: 'true',
    }
  },
  vama_uses_large_text: (value: boolean): UserAnalytic => {
    return {
      name: 'vama_uses_large_text',
      value: value.toString(),
    }
  },
  vama_uses_letters: (): UserAnalytic => {
    return {
      name: 'vama_uses_letters',
      value: 'true',
    }
  },
  vama_uses_preferred_name: (): UserAnalytic => {
    return {
      name: 'vama_uses_preferred_name',
      value: 'true',
    }
  },
  vama_uses_profile: (): UserAnalytic => {
    return {
      name: 'vama_uses_profile',
      value: 'true',
    }
  },
  vama_uses_rx: (): UserAnalytic => {
    return {
      name: 'vama_uses_rx',
      value: 'true',
    }
  },
  vama_uses_screen_reader: (value: boolean): UserAnalytic => {
    return {
      name: 'vama_uses_screen_reader',
      value: value.toString(),
    }
  },
  vama_uses_sm: (): UserAnalytic => {
    return {
      name: 'vama_uses_sm',
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
