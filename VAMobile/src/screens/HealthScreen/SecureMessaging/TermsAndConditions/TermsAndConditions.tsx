import React, { FC } from 'react'

import { Box, ClickForActionLink, LinkTypeOptionsConstants, LinkUrlIconType, TextArea, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_GO_TO_MY_HEALTHEVET } = getEnv()
const TermsAndConditions: FC = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const tc = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { contentMarginBottom, contentMarginTop, gutter, standardMarginBetween } = theme.dimensions

  return (
    <VAScrollView>
      <Box mt={contentMarginTop} mb={contentMarginBottom}>
        <Box {...testIdProps(t('termsAndConditions.title'))} accessibilityRole="header" accessible={true} mx={gutter} mb={standardMarginBetween}>
          <TextView variant="BitterBoldHeading">{t('termsAndConditions.title')}</TextView>
        </Box>
        <TextArea>
          <TextView color="primary" variant="MobileBody" mb={standardMarginBetween} {...testIdProps(t('termsAndConditions.toAccept.a11yLabel'))}>
            {t('termsAndConditions.toAccept')}
          </TextView>
          <Box mb={standardMarginBetween}>
            <ClickForActionLink
              displayedText={t('termsAndConditions.goTo')}
              linkType={LinkTypeOptionsConstants.url}
              numberOrUrlLink={LINK_URL_GO_TO_MY_HEALTHEVET}
              linkUrlIconType={LinkUrlIconType.Arrow}
              testID={t('termsAndConditions.goTo.a11yLabel')}
              {...a11yHintProp(t('termsAndConditions.goTo.a11yHint'))}
            />
          </Box>
          <TextView>
            <TextView variant="MobileBodyBold" color={'primaryTitle'}>
              {tc('note') + ' '}
            </TextView>
            <TextView variant="MobileBody">{t('secureMessaging.doNotUseSM')}</TextView>
          </TextView>
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default TermsAndConditions
