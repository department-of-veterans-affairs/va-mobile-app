import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, LinkWithAnalytics, TextArea, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

const { LINK_URL_GO_TO_MY_HEALTHEVET } = getEnv()
function TermsAndConditions() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { contentMarginBottom, gutter, standardMarginBetween } = theme.dimensions

  return (
    <VAScrollView>
      <Box mb={contentMarginBottom}>
        <TextView
          variant="MobileBodyBold"
          accessibilityRole="header"
          accessible={true}
          mx={gutter}
          mb={standardMarginBetween}>
          {t('termsAndConditions.title')}
        </TextView>
        <TextArea>
          <TextView
            variant="MobileBody"
            paragraphSpacing={true}
            accessibilityLabel={t('termsAndConditions.toAccept.a11yLabel')}>
            {t('termsAndConditions.toAccept')}
          </TextView>
          <Box mb={theme.paragraphSpacing.spacing20FontSize}>
            <LinkWithAnalytics
              type="url"
              url={LINK_URL_GO_TO_MY_HEALTHEVET}
              text={t('termsAndConditions.goTo')}
              a11yLabel={t('termsAndConditions.goTo.a11yLabel')}
              a11yHint={t('termsAndConditions.goTo.a11yHint')}
            />
          </Box>
          <TextView>
            <TextView variant="MobileBodyBold">{t('note') + ' '}</TextView>
            <TextView variant="MobileBody">{t('secureMessaging.doNotUseSM')}</TextView>
          </TextView>
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default TermsAndConditions
