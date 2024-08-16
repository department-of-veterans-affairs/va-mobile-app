import React from 'react'
import { useTranslation } from 'react-i18next'

import { LinkProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Link/Link'

import { Box, LinkWithAnalytics, TextArea, TextView, VABulletList, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { testIdProps } from 'utils/accessibility'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

const { LINK_URL_UPGRADE_MY_HEALTHEVET_PREMIUM_ACCOUNT } = getEnv()

function NotEnrolledSM() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { contentMarginBottom, standardMarginBetween } = theme.dimensions

  const bulletOne = {
    text: t('notEnrolledSM.youAreEnrolled'),
    boldedText: ' ' + t('and'),
    a11yLabel: a11yLabelVA(t('notEnrolledSM.youAreEnrolled')) + ' ' + t('and'),
  }
  const bulletTwo = {
    text: t('notEnrolledSM.youAreRegistered'),
    boldedText: ' ' + t('and'),
    a11yLabel: a11yLabelVA(t('notEnrolledSM.youAreRegistered')) + ' ' + t('and'),
  }
  const bulletThree = {
    text: t('notEnrolledSM.bothYouAndYour'),
    a11yLabel: a11yLabelVA(t('notEnrolledSM.bothYouAndYour')),
  }

  const linkProps: LinkProps = {
    type: 'url',
    url: LINK_URL_UPGRADE_MY_HEALTHEVET_PREMIUM_ACCOUNT,
    text: t('notEnrolledSM.learnHowTo'),
    a11yLabel: t('notEnrolledSM.learnHowTo'),
    a11yHint: t('notEnrolledSM.learnHowTo.a11yHint'),
  }

  return (
    <VAScrollView>
      <Box mb={contentMarginBottom}>
        <Box
          {...testIdProps(t('notEnrolledSM.title'))}
          accessibilityRole="header"
          accessible={true}
          mx={theme.dimensions.gutter}
          mb={standardMarginBetween}>
          <TextView variant="BitterBoldHeading">{t('notEnrolledSM.title')}</TextView>
        </Box>
        <Box>
          <TextArea>
            <TextView variant="MobileBody" paragraphSpacing={true}>
              {t('notEnrolledSM.youMust')}
            </TextView>
            <TextView
              variant="MobileBody"
              paragraphSpacing={true}
              accessibilityLabel={a11yLabelVA(t('notEnrolledSM.withSM'))}>
              {t('notEnrolledSM.withSM')}
            </TextView>
            <TextView variant="MobileBody" paragraphSpacing={true}>
              {t('notEnrolledSM.toUpgrade')}
            </TextView>
            <VABulletList listOfText={[bulletOne, bulletTwo, bulletThree]} paragraphSpacing={true} />
            <Box mb={standardMarginBetween}>
              <LinkWithAnalytics {...linkProps} />
            </Box>
            <Box>
              <TextView>
                <TextView variant="MobileBodyBold">{t('note') + ' '}</TextView>
                <TextView variant="MobileBody">{t('secureMessaging.doNotUseSM')}</TextView>
              </TextView>
            </Box>
          </TextArea>
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default NotEnrolledSM
