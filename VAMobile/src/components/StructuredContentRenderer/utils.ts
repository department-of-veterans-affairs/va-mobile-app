import { EnvironmentTypesConstants } from 'constants/common'
import getEnv from 'utils/env'

const { ENVIRONMENT, IS_TEST } = getEnv()
const isProduction = ENVIRONMENT === EnvironmentTypesConstants.Production

/** Resolves relative paths to full VA.gov URLs by environment; leaves absolute URLs unchanged. */
export const getLinkUrl = (href: string): string => {
  if (href.startsWith('https://') || href.startsWith('http://')) return href

  const path = href.startsWith('/') ? href.slice(1) : href
  if (IS_TEST) return `https://test.va.gov/${path}`
  if (isProduction) return `https://www.va.gov/${path}`
  return `https://staging.va.gov/${path}`
}
