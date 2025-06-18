import React from 'react'
import { useTranslation } from 'react-i18next'

import { LinkWithAnalytics } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'

const { LINK_URL_TRAVEL_PAY_SET_UP_DIRECT_DEPOSIT } = getEnv()

export default function SetUpDirectDepositWebLink() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  return (
    <LinkWithAnalytics
      type="url"
      url={LINK_URL_TRAVEL_PAY_SET_UP_DIRECT_DEPOSIT}
      text={t('travelPay.setUpDirectDeposit.link')}
      a11yLabel={a11yLabelVA(t('travelPay.setUpDirectDeposit.link'))}
      testID="setUpDirectDepositLinkID"
    />
  )
}
