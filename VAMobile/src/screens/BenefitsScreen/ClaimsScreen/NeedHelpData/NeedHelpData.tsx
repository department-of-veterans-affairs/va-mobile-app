import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement } from 'react'

import { Box, ClickForActionLink, LinkButtonProps, LinkTypeOptionsConstants, LinkUrlIconType, TextArea, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { a11yLabelID, a11yLabelVA } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { logAnalyticsEvent } from 'utils/analytics'
import { useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_CLAIM_APPEAL_STATUS } = getEnv()

type NeedHelpDataProps = {
  isAppeal?: boolean
  claimId?: string
  claimType?: string
  claimPhase?: number
}

const NeedHelpData: FC<NeedHelpDataProps> = ({ isAppeal, claimId, claimType, claimPhase }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const renderAppealData = (): ReactElement => {
    if (!isAppeal) {
      return <></>
    }

    const clickToRedirectProps: LinkButtonProps = {
      displayedText: t('appealDetails.visitVAGov'),
      numberOrUrlLink: LINK_URL_CLAIM_APPEAL_STATUS,
      linkType: LinkTypeOptionsConstants.url,
      linkUrlIconType: LinkUrlIconType.Arrow,
      a11yLabel: a11yLabelVA(t('appealDetails.visitVAGov')),
    }

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(t('appealDetails.viewMoreDetails'))}>
          {t('appealDetails.viewMoreDetails')}
        </TextView>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <ClickForActionLink {...clickToRedirectProps} {...a11yHintProp(t('appealDetails.visitVAGovA11yHint'))} />
        </Box>
      </Box>
    )
  }

  const clickToCallProps: LinkButtonProps = {
    displayedText: displayedTextPhoneNumber(t('8008271000')),
    a11yLabel: a11yLabelID(t('8008271000')),
    numberOrUrlLink: t('8008271000'),
    linkType: LinkTypeOptionsConstants.call,
    fireAnalytic: () => {
      if (claimId && claimType && claimPhase) {
        logAnalyticsEvent(Events.vama_claim_call(claimId, claimType, claimPhase))
      }
    },
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
      <Box>
        <ClickForActionLink {...clickToCallProps} testID="ClaimsVANumberTestID" />
      </Box>
      {renderAppealData()}
    </TextArea>
  )
}

export default NeedHelpData
