// @ts-nocheck - this is provided and we don't want to have to redeclare it in several places
import {
  API_ROOT,
  APPLE_STORE_LINK,
  AUTH_ALLOW_NON_BIOMETRIC_SAVE,
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  AUTH_ENDPOINT,
  AUTH_REDIRECT_URL,
  AUTH_REVOKE_URL,
  AUTH_SCOPES,
  AUTH_TOKEN_EXCHANGE_URL,
  DEMO_PASSWORD,
  ENVIRONMENT,
  GOOGLE_PLAY_LINK,
  IS_TEST,
  LINK_URL_ABOUT_DISABILITY_RATINGS,
  LINK_URL_CLAIM_APPEAL_STATUS,
  LINK_URL_COMPENSATION_CLAIM_EXAM,
  LINK_URL_DECISION_REVIEWS,
  LINK_URL_GO_TO_MY_HEALTHEVET,
  LINK_URL_GO_TO_PATIENT_PORTAL,
  LINK_URL_GO_TO_VA_GOV,
  LINK_URL_IRIS_CUSTOMER_HELP,
  LINK_URL_PRIVACY_POLICY,
  LINK_URL_SCHEDULE_APPOINTMENTS,
  LINK_URL_UPGRADE_MY_HEALTHEVET_PREMIUM_ACCOUNT,
  LINK_URL_VETERANS_CRISIS_LINE,
  LINK_URL_VETERANS_CRISIS_LINE_GET_HELP,
  LINK_URL_YOUR_CLAIMS,
  SHOW_DEBUG_MENU,
  WEBVIEW_URL_CORONA_FAQ,
  WEBVIEW_URL_FACILITY_LOCATOR,
} from '@env'

export type EnvVars = {
  API_ROOT: string
  AUTH_CLIENT_ID: string
  AUTH_CLIENT_SECRET: string
  AUTH_ENDPOINT: string
  AUTH_REDIRECT_URL: string
  AUTH_REVOKE_URL: string
  AUTH_SCOPES: string
  AUTH_TOKEN_EXCHANGE_URL: string
  AUTH_ALLOW_NON_BIOMETRIC_SAVE: string
  SHOW_DEBUG_MENU: boolean
  IS_TEST: boolean
  WEBVIEW_URL_CORONA_FAQ: string
  WEBVIEW_URL_FACILITY_LOCATOR: string
  LINK_URL_VETERANS_CRISIS_LINE: string
  LINK_URL_VETERANS_CRISIS_LINE_GET_HELP: string
  LINK_URL_IRIS_CUSTOMER_HELP: string
  LINK_URL_SCHEDULE_APPOINTMENTS: string
  LINK_URL_PRIVACY_POLICY: string
  LINK_URL_DECISION_REVIEWS: string
  LINK_URL_ABOUT_DISABILITY_RATINGS: string
  LINK_URL_COMPENSATION_CLAIM_EXAM: string
  LINK_URL_YOUR_CLAIMS: string
  LINK_URL_CLAIM_APPEAL_STATUS: string
  LINK_URL_UPGRADE_MY_HEALTHEVET_PREMIUM_ACCOUNT: string
  LINK_URL_GO_TO_MY_HEALTHEVET: string
  LINK_URL_GO_TO_PATIENT_PORTAL: string
  LINK_URL_GO_TO_VA_GOV: string
  APPLE_STORE_LINK: string
  GOOGLE_PLAY_LINK: string
  ENVIRONMENT: string
  DEMO_PASSWORD: string
}

// need to wrap @env for testing purposes
export default (): EnvVars => ({
  API_ROOT,
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  AUTH_ENDPOINT,
  AUTH_REDIRECT_URL,
  AUTH_REVOKE_URL,
  AUTH_SCOPES,
  AUTH_TOKEN_EXCHANGE_URL,
  AUTH_ALLOW_NON_BIOMETRIC_SAVE,
  SHOW_DEBUG_MENU: SHOW_DEBUG_MENU === 'true',
  IS_TEST: IS_TEST === 'true',
  WEBVIEW_URL_CORONA_FAQ,
  WEBVIEW_URL_FACILITY_LOCATOR,
  LINK_URL_VETERANS_CRISIS_LINE,
  LINK_URL_VETERANS_CRISIS_LINE_GET_HELP,
  LINK_URL_IRIS_CUSTOMER_HELP,
  LINK_URL_SCHEDULE_APPOINTMENTS,
  LINK_URL_PRIVACY_POLICY,
  LINK_URL_DECISION_REVIEWS,
  LINK_URL_ABOUT_DISABILITY_RATINGS,
  LINK_URL_COMPENSATION_CLAIM_EXAM,
  LINK_URL_YOUR_CLAIMS,
  LINK_URL_CLAIM_APPEAL_STATUS,
  APPLE_STORE_LINK,
  GOOGLE_PLAY_LINK,
  LINK_URL_UPGRADE_MY_HEALTHEVET_PREMIUM_ACCOUNT,
  LINK_URL_GO_TO_MY_HEALTHEVET,
  ENVIRONMENT,
  DEMO_PASSWORD,
  LINK_URL_GO_TO_PATIENT_PORTAL,
  LINK_URL_GO_TO_VA_GOV,
})
