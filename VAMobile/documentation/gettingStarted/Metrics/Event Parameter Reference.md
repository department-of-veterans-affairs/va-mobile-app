---
title: Event Parameter Reference
sidebar_position: 4
---

## Overview

Event parameters provide additional context about the actions captured in our events. While Google Analytics automatically collects some [standard dimensions and metrics](https://support.google.com/analytics/table/13948007?visit_id=639035750951446578-1775905048&rd=2), analyzing data not available through these built-in dimensions requires adding a custom parameter to the event and defining a corresponding custom dimension in Firebase.

Because the number of available custom dimensions is limited, we recommend using the `generic parameter names (p1, p2, …, p9)` whenever possible.

For quick reference, the table below shows the value that each generic parameter corresponds to for the events that include them. The full list of event definitions can be found in our [analytics constants file](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/dbce4aeaac76b2a49d56b9fc46f4be5cd15bce23/VAMobile/src/constants/analytics.ts).

## Parameter Reference Table

<div style={{ overflowX: 'scroll' }} markdown="block">

Event Name | p1 | p2 | p3 | p4 | p5 | p6 | p7
-- | -- | -- | -- | -- | -- | -- | --
vama_af_shown | af_status | firebase_screen |  |  |  |  | 
vama_appt_cancel | apt_id | apt_status | apt_type | days_to_apt |  | |
vama_appt_deep_link_fail | vetext_id |  |  |  |  |  | 
vama_appt_time_frame | timeFrame |  |  |  |  |  | 
vama_appt_view_details | apt_id | apt_status | apt_type | days_to_apt | |  | 
vama_apt_add_cal | apt_id | apt_status | apt_type | days_to_apt |  |  | 
vama_apt_cancel_clicks | apt_id | apt_status | apt_type | days_to_apt | step |  | 
vama_claim_details_exp | claim_id | claim_type | claim_step | step_expanded | claim_submitted_date | claim_submitted_date | claim_current_step
vama_claim_details_open | claim_id | claim_type | claim_step | claim_step_change | claim_type_code | claim_type_code | is_disability_comp_claim
vama_claim_details_tab | claim_id | claim_type | claim_step | claim_submitted_date |  |  | 
vama_claim_details_ttv | claim_id | claim_type | claim_step | claim_step_change | ttv_claim_details | ttv_claim_details | 
vama_claim_disag | claim_id | claim_type | claim_step |  |  |  | 
vama_claim_eval | claim_id | claim_type | claim_step | num_requests |  |  | 
vama_claim_eval_cancel | claim_id | claim_type | claim_step | num_requests |  |  | 
vama_claim_eval_check | claim_id | claim_type | claim_step | num_requests |  |  | 
vama_claim_eval_conf | claim_id | claim_type | claim_step | num_requests |  |  | 
vama_claim_eval_submit | claim_id | claim_type | claim_step | num_requests |  |  | 
vama_claim_file_request | claim_id |  |  |  |  |  | 
vama_claim_review | claim_id | claim_type | num_requests |  |  |  | 
vama_claim_status_tab | claim_id | claim_type | claim_step | claim_submitted_date |  |  | 
vama_claim_submit_ev | claim_id |  |  |  |  |  | 
vama_claim_submit_tap | claim_id | claim_type |  |  |  |  | 
vama_claim_upload_compl | claim_id | claim_request_id | claim_request_type | evidence_method |  |  | 
vama_claim_upload_start | claim_id | claim_request_id | claim_request_type | evidence_method |  |  | 
vama_claim_why_combine | claim_id | claim_type | claim_step |  |  |  | 
vama_click | text_clicked | additional_details |  |  |  |  |
vama_copay_stmt_download | id |  |  |  |  |  | 
vama_error | errorName | callStack | statusCode | endpoint |  |  |
vama_error_json_resp | statusCode | endpoint |  |  |  |  | 
vama_evidence_cancel_1 | claim_id | claim_request_id | claim_request_type | evidence_method |  |  | 
vama_evidence_cancel_2 | claim_id | claim_request_id | claim_request_type | evidence_method |  |  | 
vama_evidence_conf | claim_id | claim_request_id | claim_request_type | evidence_method |  |  | 
vama_evidence_cont_1 | claim_id | claim_request_id | claim_request_type | evidence_method |  |  | 
vama_evidence_cont_2 | claim_id | claim_request_id | claim_request_type | evidence_method | upload_size | num_photos | 
vama_evidence_cont_3 | claim_id | claim_request_id | claim_request_type | evidence_method |  |  | 
vama_evidence_start | claim_id | claim_request_id | claim_request_type | evidence_method |  |  | 
vama_evidence_type | claim_id | claim_request_id | claim_request_type | evidence_method | evidence_type |  | 
vama_givefb_close | screenName |  |  |  |  |  | 
vama_givefb_open | linkType |  |  |  |  |  | 
vama_hs_appts_load_time | loadTime |  |  |  |  |  | 
vama_hs_load_time | loadTime |  |  |  |  |  | 
vama_hs_rx_load_time | loadTime |  |  |  |  |  | 
vama_hs_sm_load_time | loadTime |  |  |  |  |  | 
vama_lab_or_test_details | labType |  |  |  |  |  | 
vama_lab_or_test_list | timeFrame | count |  |  |  |  | 
vama_login_start | isBiometric |  |  |  |  |  |
vama_login_token_store | success |  |  |  |  |  | 
vama_obf_textview | revealed |  |  |  |  |  |
vama_pagination | pages | to_page | tab |  |  |  | 
vama_request_details | claim_id | claim_request_id | claim_request_type |  |  |  | 
vama_rx_details | rx_id |  |  |  |  |  | 
vama_rx_filter_sel | filter | sort |  |  |  |  | 
vama_rx_refill_fail | rx_ids |  |  |  |  |  | 
vama_rx_refill_retry | rx_ids |  |  |  |  |  | 
vama_rx_refill_success | rx_ids |  |  |  |  |  | 
vama_rx_request_cancel | rx_ids |  |  |  |  |  | 
vama_rx_request_confirm | rx_ids |  |  |  |  |  | 
vama_rx_request_start | rx_ids |  |  |  |  |  | 
vama_rx_status | status | ttv |  |  |  |  | 
vama_rx_trackdet | rx_id |  |  |  |  |  | 
vama_rx_trackdet_close | rx_id |  |  |  |  |  | 
vama_sm_attach | type |  |  |  |  |  | 
vama_sm_attach_outcome | attached |  |  |  |  |  | 
vama_sm_change_category | messageCategory | previousCategory |  |  |  |  | 
vama_sm_folder_open | folder |  |  |  |  |  | 
vama_sm_folders | draft_count |  |  |  |  |  | 
vama_sm_move_outcome | outcome |  |  |  |  |  | 
vama_sm_open | sm_id | location | status |  |  |  | 
vama_sm_save_draft | messageCategory |  |  |  |  |  | 
vama_sm_send_message | messageCategory | replyToID |  |  |  |  | 
vama_sso_cookie_received | received |  |  |  |  |  | 
vama_toggle | toggle_name | status |  |  |  |  | 
vama_travel_pay_doc_dl | claim_id | claim_status | document_type | document_filename |  |  | 
vama_user_call | status_code |  |  |  |  |  | 
vama_vaccine_details | groupName |  |  |  |  |  | 
vama_vet_status_zStatus | charOfDis |  |  |  |  |  | 
vama_webview | id |  |  |  |  |  |

</div>