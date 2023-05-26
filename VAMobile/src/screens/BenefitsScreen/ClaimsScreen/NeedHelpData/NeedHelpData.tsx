import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement } from 'react'

import { Box, ClickForActionLink, LinkButtonProps, LinkTypeOptionsConstants, LinkUrlIconType, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks/useTheme'
import getEnv from 'utils/env'

const { LINK_URL_CLAIM_APPEAL_STATUS } = getEnv()

type NeedHelpDataProps = {
  isAppeal?: boolean
}

const NeedHelpData: FC<NeedHelpDataProps> = ({ isAppeal }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const AppealData = (): ReactElement => {
    if (!isAppeal) {
      return <></>
    }

    const clickToRedirectProps: LinkButtonProps = {
      displayedText: t('appealDetails.visitVAGov'),
      numberOrUrlLink: LINK_URL_CLAIM_APPEAL_STATUS,
      linkType: LinkTypeOptionsConstants.url,
      linkUrlIconType: LinkUrlIconType.Arrow,
      a11yLabel: t('appealDetails.visitVAGovA11yLabel'),
    }

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBody" {...testIdProps(t('appealDetails.viewMoreDetailsA11yLabel'))}>
          {t('appealDetails.viewMoreDetails')}
        </TextView>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <ClickForActionLink {...clickToRedirectProps} {...a11yHintProp(t('appealDetails.visitVAGovA11yHint'))} />
        </Box>
      </Box>
    )
  }

  const clickToCallProps: LinkButtonProps = {
    displayedText: t('8008271000.displayText'),
    a11yLabel: t('8008271000.displayText.a11yLabel'),
    numberOrUrlLink: t('8008271000'),
    linkType: LinkTypeOptionsConstants.call,
  }

  return (
    <TextArea>
      <Box {...testIdProps(t('claimDetails.needHelp'))} accessible={true}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('claimDetails.needHelp')}
        </TextView>
      </Box>
      <Box {...testIdProps(t('claimDetails.callVA.a11yLabel'))} accessible={true}>
        <TextView variant="MobileBody">{t('claimDetails.callVA')}</TextView>
      </Box>
      <Box mt={theme.dimensions.standardMarginBetween}>
        <ClickForActionLink {...clickToCallProps} {...a11yHintProp(t('claimDetails.VANumberA11yHint'))} />
      </Box>
      <AppealData />
    </TextArea>
  )
}

export default NeedHelpData
