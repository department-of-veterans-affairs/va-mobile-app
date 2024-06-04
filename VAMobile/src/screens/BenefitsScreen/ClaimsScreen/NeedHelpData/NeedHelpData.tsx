import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, ClickToCallPhoneNumber, LinkWithAnalytics, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { testIdProps } from 'utils/accessibility'
import getEnv from 'utils/env'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

const { LINK_URL_CLAIM_APPEAL_STATUS } = getEnv()

type NeedHelpDataProps = {
  isAppeal?: boolean
}

function NeedHelpData({ isAppeal }: NeedHelpDataProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  function renderAppealData() {
    if (!isAppeal) {
      return <></>
    }

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(t('appealDetails.viewMoreDetails'))}>
          {t('appealDetails.viewMoreDetails')}
        </TextView>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <LinkWithAnalytics
            type="url"
            url={LINK_URL_CLAIM_APPEAL_STATUS}
            text={t('goToVAGov')}
            a11yLabel={a11yLabelVA(t('goToVAGov'))}
            a11yHint={t('appealDetails.goToVAGovA11yHint')}
          />
        </Box>
      </Box>
    )
  }

  return (
    <TextArea>
      <Box {...testIdProps(t('claimDetails.needHelp'))} accessible={true}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('claimDetails.needHelp')}
        </TextView>
      </Box>
      <Box {...testIdProps(t('claimDetails.callVA.a11yLabel'))} accessible={true}>
        <TextView variant="MobileBody" paragraphSpacing={true}>
          {t('claimDetails.callVA')}
        </TextView>
      </Box>
      <ClickToCallPhoneNumber phone={displayedTextPhoneNumber(t('8008271000'))} />
      {renderAppealData()}
    </TextArea>
  )
}

export default NeedHelpData
