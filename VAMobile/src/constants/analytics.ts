import { DateTime } from 'luxon'

import { CategoryTypes } from 'api/types'
import { Event, EventParams, UserAnalytic } from 'utils/analytics'
import { trimNotificationUrl } from 'utils/notifications'

/**
 * Firebase strings have to be less than 24 chars or it doesn't go through. this lint rule enforces that.
 */
/*eslint id-length: ["error", { "max": 24 }]*/
export const Events = {
  vama_af_shown: (af_status: string, firebase_screen: string): Event => {
    return {
      name: 'vama_af_shown',
      params: {
        p1: af_status,
        p2: firebase_screen,
      },
    }
  },
  vama_af_updated: (): Event => {
    return {
      name: 'vama_af_updated',
    }
  },
  vama_allergy_details: (): Event => {
    return {
      name: 'vama_allergy_details',
    }
  },
  vama_allergy_list: (): Event => {
    return {
      name: 'vama_allergy_list',
    }
  },
  vama_lab_or_test_list: (timeFrame: string, count?: number): Event => {
    return {
      name: 'vama_lab_or_test_list',
      params: {
        p1: timeFrame,
        p2: count,
      },
    }
  },
  vama_lab_or_test_details: (labType: string): Event => {
    return {
      name: 'vama_lab_or_test_details',
      params: {
        p1: labType,
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
        p1: apt_id,
        p2: apt_status,
        p3: apt_type,
        p4: days_to_apt,
      },
    }
  },
  vama_appt_deep_link_fail: (vetext_id: string): Event => {
    return {
      name: 'vama_appt_deep_link_fail',
      params: {
        p1: vetext_id,
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
        p1: apt_id,
        p2: apt_status,
        p3: apt_type,
        p4: days_to_apt,
      },
    }
  },
  vama_apt_add_cal: (apt_id: string, apt_status: string | undefined, apt_type: string, days_to_apt: number): Event => {
    return {
      name: 'vama_apt_add_cal',
      params: {
        p1: apt_id,
        p2: apt_status,
        p3: apt_type,
        p4: days_to_apt,
      },
    }
  },
  vama_apt_cancel_click: (
    apt_id: string,
    apt_status: string,
    apt_type: string,
    days_to_apt: number,
    step: string,
  ): Event => {
    return {
      name: 'vama_apt_cancel_clicks',
      params: {
        p1: apt_id,
        p2: apt_status,
        p3: apt_type,
        p4: days_to_apt,
        p5: step,
      },
    }
  },
  vama_appt_noauth: (): Event => {
    return {
      name: 'vama_appt_noauth',
    }
  },
  vama_appt_invalid_range: (): Event => {
    return {
      name: 'vama_appt_invalid_range',
    }
  },
  vama_appt_empty_range: (): Event => {
    return {
      name: 'vama_appt_empty_range',
    }
  },
  vama_appt_time_frame: (timeFrame: string): Event => {
    return {
      name: 'vama_appt_time_frame',
      params: {
        p1: timeFrame,
      },
    }
  },
  vama_cerner_alert: (): Event => {
    return {
      name: 'vama_cerner_alert',
    }
  },
  vama_cerner_alert_exp: (): Event => {
    return {
      name: 'vama_cerner_alert_exp',
    }
  },
  vama_be_af_refresh: (): Event => {
    return {
      name: 'vama_be_af_refresh',
    }
  },
  vama_be_af_shown: (): Event => {
    return {
      name: 'vama_be_af_shown',
    }
  },
  vama_claim_details_exp: (
    claim_id: string,
    claim_type: string,
    claim_step: number,
    step_expanded: boolean,
    claim_step_change: string,
    claim_submitted_date: string,
    claim_current_step: number,
  ): Event => {
    return {
      name: 'vama_claim_details_exp',
      params: {
        p1: claim_id,
        p2: claim_type,
        p3: claim_step,
        p4: step_expanded,
        p5: claim_step_change,
        p6: claim_submitted_date,
        p7: claim_current_step,
      },
    }
  },
  vama_claim_details_open: (
    claim_id: string,
    claim_type: string,
    claim_step: number,
    claim_step_change: string,
    claim_submitted_date: string,
    claim_type_code: string,
    is_disability_comp_claim: boolean,
  ): Event => {
    return {
      name: 'vama_claim_details_open',
      params: {
        p1: claim_id,
        p2: claim_type,
        p3: claim_step,
        p4: claim_step_change,
        p5: claim_submitted_date,
        p6: claim_type_code,
        p7: is_disability_comp_claim,
      },
    }
  },
  vama_claim_details_tab: (
    claim_id: string,
    claim_type: string,
    claim_step: number,
    claim_submitted_date: string,
  ): Event => {
    return {
      name: 'vama_claim_details_tab',
      params: {
        p1: claim_id,
        p2: claim_type,
        p3: claim_step,
        p4: claim_submitted_date,
      },
    }
  },
  vama_claim_details_ttv: (
    claim_id: string,
    claim_type: string,
    claim_step: number,
    claim_step_change: string,
    claim_submitted_date: string,
    ttv_claim_details: number,
  ): Event => {
    return {
      name: 'vama_claim_details_ttv',
      params: {
        p1: claim_id,
        p2: claim_type,
        p3: claim_step,
        p4: claim_step_change,
        p5: claim_submitted_date,
        p6: ttv_claim_details,
      },
    }
  },
  vama_claim_disag: (claim_id: string, claim_type: string, claim_step: number): Event => {
    return {
      name: 'vama_claim_disag',
      params: {
        p1: claim_id,
        p2: claim_type,
        p3: claim_step,
      },
    }
  },
  vama_claim_eval: (claim_id: string, claim_type: string, claim_step: number, num_requests: number): Event => {
    return {
      name: 'vama_claim_eval',
      params: {
        p1: claim_id,
        p2: claim_type,
        p3: claim_step,
        p4: num_requests,
      },
    }
  },
  vama_claim_eval_cancel: (claim_id: string, claim_type: string, claim_step: number, num_requests: number): Event => {
    return {
      name: 'vama_claim_eval_cancel',
      params: {
        p1: claim_id,
        p2: claim_type,
        p3: claim_step,
        p4: num_requests,
      },
    }
  },
  vama_claim_eval_check: (claim_id: string, claim_type: string, num_requests: number): Event => {
    return {
      name: 'vama_claim_eval_check',
      params: {
        p1: claim_id,
        p2: claim_type,
        p3: num_requests,
      },
    }
  },
  vama_claim_eval_conf: (claim_id: string, claim_type: string, num_requests: number): Event => {
    return {
      name: 'vama_claim_eval_conf',
      params: {
        p1: claim_id,
        p2: claim_type,
        p3: num_requests,
      },
    }
  },
  vama_claim_eval_submit: (claim_id: string, claim_type: string, num_requests: number): Event => {
    return {
      name: 'vama_claim_eval_submit',
      params: {
        p1: claim_id,
        p2: claim_type,
        p3: num_requests,
      },
    }
  },
  vama_claim_file_request: (claim_id: string): Event => {
    return {
      name: 'vama_claim_file_request',
      params: {
        p1: claim_id,
      },
    }
  },
  vama_claim_file_view: (): Event => {
    return {
      name: 'vama_claim_file_view',
    }
  },
  vama_claim_review: (claim_id: string, claim_type: string, num_requests: number): Event => {
    return {
      name: 'vama_claim_review',
      params: {
        p1: claim_id,
        p2: claim_type,
        p3: num_requests,
      },
    }
  },
  vama_claim_status_tab: (
    claim_id: string,
    claim_type: string,
    claim_step: number,
    claim_submitted_date: string,
  ): Event => {
    return {
      name: 'vama_claim_status_tab',
      params: {
        p1: claim_id,
        p2: claim_type,
        p3: claim_step,
        p4: claim_submitted_date,
      },
    }
  },
  vama_claim_submit_ev: (claim_id: string): Event => {
    return {
      name: 'vama_claim_submit_ev',
      params: {
        p1: claim_id,
      },
    }
  },
  vama_claim_submit_tap: (claim_id: string, claim_type: string): Event => {
    return {
      name: 'vama_claim_submit_tap',
      params: {
        p1: claim_id,
        p2: claim_type,
      },
    }
  },
  vama_claim_upload_compl: (
    claim_id: string,
    claim_request_id: number | null,
    claim_request_type: string,
    evidence_method: string,
  ): Event => {
    return {
      name: 'vama_claim_upload_compl',
      params: {
        p1: claim_id,
        p2: claim_request_id,
        p3: claim_request_type,
        p4: evidence_method,
      },
    }
  },
  vama_claim_upload_start: (
    claim_id: string,
    claim_request_id: number | null,
    claim_request_type: string,
    evidence_method: string,
  ): Event => {
    return {
      name: 'vama_claim_upload_start',
      params: {
        p1: claim_id,
        p2: claim_request_id,
        p3: claim_request_type,
        p4: evidence_method,
      },
    }
  },
  vama_claim_why_combine: (claim_id: string, claim_type: string, claim_step: number): Event => {
    return {
      name: 'vama_claim_why_combine',
      params: {
        p1: claim_id,
        p2: claim_type,
        p3: claim_step,
      },
    }
  },
  vama_click: (text_clicked: string, screen_name: string, additional_details?: string): Event => {
    return {
      name: 'vama_click',
      params: {
        p1: text_clicked,
        screen_name,
        p2: additional_details,
      },
    }
  },
  vama_copay_stmt_download: (id: string): Event => {
    return {
      name: 'vama_copay_stmt_download',
      params: {
        p1: id,
      },
    }
  },
  vama_ddl_landing_click: (): Event => {
    return {
      name: 'vama_ddl_landing_click',
    }
  },
  vama_ddl_letter_view: (letterName: string): Event => {
    return {
      name: 'vama_ddl_letter_view',
      params: {
        letterName,
      },
    }
  },
  vama_ddl_status_click: (): Event => {
    return {
      name: 'vama_ddl_status_click',
    }
  },
  vama_error: (
    errorName: string,
    errorMessage: string,
    callStack?: string,
    statusCode?: number,
    endpoint?: string,
  ): Event => {
    return {
      name: 'vama_error',
      params: {
        p1: errorName,
        errorMessage,
        p2: callStack,
        p3: statusCode,
        p4: endpoint,
      },
    }
  },
  vama_error_json_resp: (endpoint?: string, statusCode?: number): Event => {
    return {
      name: 'vama_error_json_resp',
      params: {
        p1: statusCode,
        p2: endpoint,
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
  vama_evidence_cancel_1: (
    claim_id: string,
    claim_request_id: number | null,
    claim_request_type: string,
    evidence_method: string,
  ): Event => {
    return {
      name: 'vama_claim_cancel_1',
      params: {
        p1: claim_id,
        p2: claim_request_id,
        p3: claim_request_type,
        p4: evidence_method,
      },
    }
  },
  vama_evidence_cancel_2: (
    claim_id: string,
    claim_request_id: number | null,
    claim_request_type: string,
    evidence_method: string,
  ): Event => {
    return {
      name: 'vama_claim_cancel_2',
      params: {
        p1: claim_id,
        p2: claim_request_id,
        p3: claim_request_type,
        p4: evidence_method,
      },
    }
  },
  vama_evidence_conf: (
    claim_id: string,
    claim_request_id: number | null,
    claim_request_type: string,
    evidence_method: string,
  ): Event => {
    return {
      name: 'vama_evidence_conf',
      params: {
        p1: claim_id,
        p2: claim_request_id,
        p3: claim_request_type,
        p4: evidence_method,
      },
    }
  },
  vama_evidence_cont_1: (
    claim_id: string,
    claim_request_id: number | null,
    claim_request_type: string,
    evidence_method: string,
  ): Event => {
    return {
      name: 'vama_evidence_cont_1',
      params: {
        p1: claim_id,
        p2: claim_request_id,
        p3: claim_request_type,
        p4: evidence_method,
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
        p1: claim_id,
        p2: claim_request_id,
        p3: claim_request_type,
        p4: evidence_method,
        p5: upload_size,
        p6: num_photos,
      },
    }
  },
  vama_evidence_cont_3: (
    claim_id: string,
    claim_request_id: number | null,
    claim_request_type: string,
    evidence_method: string,
  ): Event => {
    return {
      name: 'vama_evidence_cont_3',
      params: {
        p1: claim_id,
        p2: claim_request_id,
        p3: claim_request_type,
        p4: evidence_method,
      },
    }
  },
  vama_evidence_start: (
    claim_id: string,
    claim_request_id: number | null,
    claim_request_type: string,
    evidence_method: string,
  ): Event => {
    return {
      name: 'vama_evidence_start',
      params: {
        p1: claim_id,
        p2: claim_request_id,
        p3: claim_request_type,
        p4: evidence_method,
      },
    }
  },
  vama_evidence_type: (
    claim_id: string,
    claim_request_id: number | null,
    claim_request_type: string,
    evidence_method: string,
    evidence_type: string,
  ): Event => {
    return {
      name: 'vama_evidence_type',
      params: {
        p1: claim_id,
        p2: claim_request_id,
        p3: claim_request_type,
        p4: evidence_method,
        p5: evidence_type,
      },
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
  vama_feedback_ask: (screen: string, response: boolean): Event => {
    return {
      name: 'vama_feedback_ask',
      params: {
        screen,
        response,
      },
    }
  },
  vama_feedback_closed: (screen: string): Event => {
    return {
      name: 'vama_feedback_closed',
      params: {
        screen,
      },
    }
  },
  vama_feedback_submitted: (screen: string, taskCompleted: string, satisfaction: string): Event => {
    return {
      name: 'vama_feedback_submitted',
      params: {
        screen,
        taskCompleted,
        satisfaction,
      },
    }
  },
  vama_givefb_close: (screenName: string): Event => {
    return {
      name: 'vama_givefb_close',
      params: {
        p1: screenName,
      },
    }
  },
  vama_givefb_open: (linkType: string): Event => {
    return {
      name: 'vama_givefb_open',
      params: {
        p1: linkType,
      },
    }
  },
  vama_feedback: (satisfaction: string, meetsMyNeeds: string, easyToUse: string, task: string): Event => {
    return {
      name: 'vama_feedback',
      params: {
        satisfaction,
        meetsMyNeeds,
        easyToUse,
        task,
      },
    }
  },
  vama_hs_appts_load_time: (loadTime: number): Event => {
    return {
      name: 'vama_hs_appts_load_time',
      params: {
        p1: loadTime,
      },
    }
  },
  vama_hs_claims_load_time: (loadTime: number): Event => {
    return {
      name: 'vama_hs_claims_load_time',
      params: {
        p1: loadTime,
      },
    }
  },
  vama_hs_rx_load_time: (loadTime: number): Event => {
    return {
      name: 'vama_hs_rx_load_time',
      params: {
        p1: loadTime,
      },
    }
  },
  vama_hs_scroll_banner: (): Event => {
    return {
      name: 'vama_hs_scroll_ab',
    }
  },
  vama_hs_scroll_activity: (): Event => {
    return {
      name: 'vama_hs_scroll_act',
    }
  },
  vama_hs_scroll_resources: (): Event => {
    return {
      name: 'vama_hs_scroll_var',
    }
  },
  vama_hs_sm_load_time: (loadTime: number): Event => {
    return {
      name: 'vama_hs_sm_load_time',
      params: {
        p1: loadTime,
      },
    }
  },

  vama_hs_load_time: (loadTime: number): Event => {
    return {
      name: 'vama_hs_load_time',
      params: {
        p1: loadTime,
      },
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
  vama_login_start: (isSIS = true, isBiometric = false): Event => {
    return {
      name: 'vama_login_start',
      params: {
        sis: isSIS.toString(),
        p1: isBiometric.toString(),
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
  vama_login_token_fetch: (error: Error): Event => {
    return {
      name: 'vama_login_token_fetch',
      params: {
        error: JSON.stringify(error),
      },
    }
  },
  vama_login_token_refresh: (error: Error): Event => {
    return {
      name: 'vama_login_token_refresh',
      params: {
        error: JSON.stringify(error),
      },
    }
  },
  vama_login_token_store: (success: boolean): Event => {
    return {
      name: 'vama_login_token_store',
      params: {
        p1: success,
      },
    }
  },
  vama_mw_shown: (feature: string, start: DateTime, end: DateTime): Event => {
    return {
      name: 'vama_mw_shown',
      params: {
        feature,
        start,
        end,
      },
    }
  },
  vama_notification_click: (notification_url?: string): Event => {
    // Omit the id that follows the main url path for better logging
    const trimmed_notification_url = trimNotificationUrl(notification_url || '')
    return {
      name: 'vama_notification_click',
      params: {
        notification_url: trimmed_notification_url,
      },
    }
  },
  vama_offline_access: (screen_name: string): Event => {
    return {
      name: 'vama_offline_access',
      params: {
        value: screen_name,
      },
    }
  },
  vama_offline_action: (): Event => {
    return {
      name: 'vama_offline_action',
    }
  },
  vama_offline_cache: (queryKey: string): Event => {
    return {
      name: 'vama_offline_cache',
      params: {
        value: queryKey,
      },
    }
  },
  vama_offline_no_data: (queryKey: string): Event => {
    return {
      name: 'vama_offline_no_data',
      params: {
        value: queryKey,
      },
    }
  },
  vama_pagination: (pages: number, to_page: number, tab?: string): Event => {
    return {
      name: 'vama_pagination',
      params: {
        p1: pages,
        p2: to_page,
        p3: tab,
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
  vama_prof_person_noauth: (): Event => {
    return {
      name: 'vama_prof_person_noauth',
    }
  },
  vama_prof_contact_noauth: (): Event => {
    return {
      name: 'vama_prof_contact_noauth',
    }
  },
  vama_prof_update_address: (): Event => {
    return {
      name: 'vama_prof_update_address',
    }
  },
  vama_prof_update_email: (): Event => {
    return {
      name: 'vama_prof_update_email',
    }
  },
  vama_prof_update_phone: (): Event => {
    return {
      name: 'vama_prof_update_phone',
    }
  },
  vama_review_prompt: (): Event => {
    return {
      name: 'vama_review_prompt',
    }
  },
  vama_request_details: (claim_id: string, claim_request_id: number | null, claim_request_type: string): Event => {
    return {
      name: 'vama_request_details',
      params: {
        p1: claim_id,
        p2: claim_request_id,
        p3: claim_request_type,
      },
    }
  },
  vama_rx_details: (rx_id: string): Event => {
    return {
      name: 'vama_rx_details ',
      params: {
        p1: rx_id,
      },
    }
  },
  vama_rx_filter: (): Event => {
    return {
      name: 'vama_rx_filter',
    }
  },
  vama_rx_filter_cancel: (): Event => {
    return {
      name: 'vama_rx_filter_cancel',
    }
  },
  vama_rx_filter_sel: (filter: string, sort: string): Event => {
    return {
      name: 'vama_rx_filter_sel',
      params: {
        p1: filter,
        p2: sort,
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
  vama_rx_refill_fail: (rx_ids: string[]): Event => {
    return {
      name: 'vama_rx_refill_fail',
      params: {
        p1: rx_ids,
      },
    }
  },
  vama_rx_refill_retry: (rx_ids: string[]): Event => {
    return {
      name: 'vama_rx_refill_retry',
      params: {
        p1: rx_ids,
      },
    }
  },
  vama_rx_refill_success: (rx_ids: string[]): Event => {
    return {
      name: 'vama_rx_refill_success',
      params: {
        p1: rx_ids,
      },
    }
  },
  vama_rx_request_cancel: (rx_ids: string[]): Event => {
    return {
      name: 'vama_rx_request_cancel ',
      params: {
        p1: rx_ids,
      },
    }
  },
  vama_rx_request_confirm: (rx_ids: string[]): Event => {
    return {
      name: 'vama_rx_request_confirm',
      params: {
        p1: rx_ids,
      },
    }
  },
  vama_rx_request_start: (rx_ids: string[]): Event => {
    return {
      name: 'vama_rx_request_start',
      params: {
        p1: rx_ids,
      },
    }
  },
  vama_rx_status: (status: string, ttv: number): Event => {
    return {
      name: 'vama_rx_status',
      params: {
        p1: status,
        p2: ttv,
      },
    }
  },
  vama_rx_trackdet: (rx_id: string): Event => {
    return {
      name: 'vama_rx_trackdet',
      params: {
        p1: rx_id,
      },
    }
  },
  vama_rx_trackdet_close: (rx_id: string): Event => {
    return {
      name: 'vama_rx_trackdet_close',
      params: {
        p1: rx_id,
      },
    }
  },
  vama_sm_attach: (type: string): Event => {
    return {
      name: 'vama_sm_attach',
      params: {
        p1: type,
      },
    }
  },
  vama_sm_attach_outcome: (attached: string): Event => {
    return {
      name: 'vama_sm_attach_outcome',
      params: {
        p1: attached,
      },
    }
  },
  vama_sm_change_category: (messageCategory: CategoryTypes, previousCategory: CategoryTypes): Event => {
    return {
      name: 'vama_sm_change_category',
      params: {
        p1: messageCategory,
        p2: previousCategory,
      },
    }
  },
  vama_sm_folder_open: (folder: string): Event => {
    return {
      name: 'vama_sm_folder_open',
      params: {
        p1: folder,
      },
    }
  },
  vama_sm_folders: (draft_count: number): Event => {
    return {
      name: 'vama_sm_folders',
      params: {
        p1: draft_count,
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
        p1: outcome,
      },
    }
  },
  vama_sm_nonurgent: (): Event => {
    return {
      name: 'vama_sm_nonurgent',
    }
  },
  vama_sm_notenrolled: (): Event => {
    return {
      name: 'vama_sm_notenrolled',
    }
  },
  vama_sm_open: (sm_id: number, location: string, status: string): Event => {
    return {
      name: 'vama_sm_open',
      params: {
        p1: sm_id,
        p2: location,
        p3: status,
      },
    }
  },
  vama_sm_save_draft: (messageCategory: CategoryTypes): Event => {
    return {
      name: 'vama_sm_save_draft',
      params: {
        p1: messageCategory,
      },
    }
  },
  vama_sm_send_message: (messageCategory: CategoryTypes, replyToID: number | undefined): Event => {
    return {
      name: 'vama_sm_send_message',
      params: {
        p1: messageCategory,
        p2: replyToID,
      },
    }
  },
  vama_sm_start: (): Event => {
    return {
      name: 'vama_sm_start',
    }
  },
  vama_sso_cookie_received: (received: boolean): Event => {
    return {
      name: 'vama_sso_cookie_received',
      params: {
        p1: received,
      },
    }
  },
  vama_toggle: (toggle_name: string, status: boolean, screen_name: string): Event => {
    return {
      name: 'vama_toggle',
      params: {
        p1: toggle_name,
        p2: status,
        screen_name,
      },
    }
  },
  vama_update_dir_dep: (): Event => {
    return {
      name: 'vama_update_dir_dep',
    }
  },
  vama_user_call: (status_code: number): Event => {
    return {
      name: 'vama_user_call',
      params: {
        p1: status_code,
      },
    }
  },
  vama_vaccine_details: (groupName: string): Event => {
    return {
      name: 'vama_vaccine_details',
      params: {
        p1: groupName,
      },
    }
  },
  vama_vet_status_nStatus: (): Event => {
    return {
      name: 'vama_vet_status_nStatus',
    }
  },
  vama_vet_status_yStatus: (): Event => {
    return {
      name: 'vama_vet_status_yStatus',
    }
  },
  vama_vet_status_zStatus: (charOfDis: string): Event => {
    return {
      name: 'vama_vet_status_zStatus',
      params: {
        p1: charOfDis,
      },
    }
  },
  vama_vsc_error_shown: (errorType?: string): Event => {
    return {
      name: 'vama_vsc_error_shown',
      params: {
        errorType,
      },
    }
  },
  vama_webview: (url: string, id?: string): Event => {
    return {
      name: 'vama_webview',
      params: {
        url,
        p1: id,
      },
    }
  },
  vama_webview_fail: (error: string): Event => {
    return {
      name: 'vama_webview_fail',
      params: {
        error,
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
  vama_whatsnew_dont_show: (skippedFeatures?: string[]): Event => {
    return {
      name: 'vama_whatsnew_dont_show',
      params: {
        q1: skippedFeatures,
      },
    }
  },
  vama_whatsnew_more: (): Event => {
    return {
      name: 'vama_whatsnew_more',
    }
  },
  // ObfuscatedTextView
  vama_obf_textview: (cardName: string, revealed: boolean): Event => {
    return {
      name: 'vama_obf_textview',
      params: {
        card_name: cardName,
        p1: revealed,
      },
    }
  },
  // payment breakdown modal - see details
  vama_payment_bd_details: (): Event => {
    return {
      name: 'vama_payment_bd_details',
    }
  },
  vama_goto_payment_hist: (): Event => {
    return {
      name: 'vama_goto_payment_hist',
    }
  },
  vama_smoc_time_taken: (totalTime: number): Event => {
    return {
      name: 'vama_smoc_time_taken',
      params: {
        totalTime,
      },
    }
  },
  vama_smoc_error: (error: string): Event => {
    return {
      name: 'vama_smoc_error',
      params: {
        error,
      },
    }
  },
  vama_travel_pay_doc_dl: (
    claim_id: string,
    claim_status: string,
    document_type: string,
    document_filename: string,
  ): Event => {
    return {
      name: 'vama_travel_pay_doc_dl',
      params: {
        p1: claim_id,
        p2: claim_status,
        p3: document_type,
        p4: document_filename,
      },
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
  vama_cerner_transition: (value: boolean): UserAnalytic => {
    return {
      name: 'vama_cerner_transition',
      value: value.toString(),
    }
  },
  vama_environment: (value: string): UserAnalytic => {
    return {
      name: 'vama_environment',
      value: value,
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
  vama_uses_notifications: (value: boolean): UserAnalytic => {
    return {
      name: 'vama_uses_notifications',
      value: value.toString(),
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
