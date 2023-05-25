import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextArea, TextView, TextViewProps, VABulletList, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useExternalLink } from 'utils/hooks'
import { useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_UPGRADE_MY_HEALTHEVET_PREMIUM_ACCOUNT } = getEnv()

const NotEnrolledSM: FC = () => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const launchExternalLink = useExternalLink()
  const theme = useTheme()

  const bulletOne = {
    text: t('notEnrolledSM.youAreEnrolled'),
    boldedText: ' ' + tc('and'),
    a11yLabel: t('notEnrolledSM.youAreEnrolled.a11yLabel'),
  }
  const bulletTwo = {
    text: t('notEnrolledSM.youAreRegistered'),
    boldedText: ' ' + tc('and'),
    a11yLabel: t('notEnrolledSM.youAreRegistered.a11yLabel'),
  }
  const bulletThree = { text: t('notEnrolledSM.bothYouAndYour'), a11yLabel: t('notEnrolledSM.bothYouAndYour.a11yLabel') }

  const redirectLink = (): void => {
    launchExternalLink(LINK_URL_UPGRADE_MY_HEALTHEVET_PREMIUM_ACCOUNT)
  }

  const textViewProps: TextViewProps = {
    variant: 'MobileBody',
    textDecoration: 'underline',
    textDecorationColor: 'link',
    color: 'link',
    onPress: redirectLink,
    accessibilityRole: 'link',
    ...testIdProps(t('notEnrolledSM.learnHowTo.a11yLabel')),
    ...a11yHintProp(t('notEnrolledSM.learnHowTo.a11yHint')),
  }

  return (
    <VAScrollView>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <Box {...testIdProps(t('notEnrolledSM.title'))} accessibilityRole="header" accessible={true} mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
          <TextView variant="BitterBoldHeading">{t('notEnrolledSM.title')}</TextView>
        </Box>
        <Box>
          <TextArea>
            <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
              {t('notEnrolledSM.youMust')}
            </TextView>
            <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween} accessibilityLabel={t('notEnrolledSM.withSM.a11yLabel')}>
              {t('notEnrolledSM.withSM')}
            </TextView>
            <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
              {t('notEnrolledSM.toUpgrade')}
            </TextView>
            <Box mb={theme.dimensions.standardMarginBetween}>
              <VABulletList listOfText={[bulletOne]} />
            </Box>
            <Box mb={theme.dimensions.standardMarginBetween}>
              <VABulletList listOfText={[bulletTwo]} />
            </Box>
            <Box mb={theme.dimensions.standardMarginBetween}>
              <VABulletList listOfText={[bulletThree]} />
            </Box>
            <Box mb={theme.dimensions.standardMarginBetween}>
              <TextView {...textViewProps}>{t('notEnrolledSM.learnHowTo')}</TextView>
            </Box>
            <Box mb={theme.dimensions.standardMarginBetween}>
              <TextView>
                <TextView variant="MobileBodyBold">{tc('note') + ' '}</TextView>
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
