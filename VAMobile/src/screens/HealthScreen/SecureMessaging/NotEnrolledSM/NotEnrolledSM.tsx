import React, { FC } from 'react'

import { Box, TextArea, TextView, TextViewProps, VABulletList, VAScrollView } from 'components'
import { Linking } from 'react-native'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_UPGRADE_MY_HEALTHEVET_PREMIUM_ACCOUNT } = getEnv()

const NotEnrolledSM: FC = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const tc = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { contentMarginBottom, contentMarginTop, standardMarginBetween } = theme.dimensions

  const bulletOne = {
    text: t('notEnrolledSM.youAreEnrolled'),
    boldedText: ' ' + tc('and'),
  }
  const bulletTwo = {
    text: t('notEnrolledSM.youAreRegistered'),
    boldedText: ' ' + tc('and'),
  }
  const bulletThree = { text: t('notEnrolledSM.bothYouAndYour') }

  const redirectLink = (): void => {
    Linking.openURL(LINK_URL_UPGRADE_MY_HEALTHEVET_PREMIUM_ACCOUNT)
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
      <Box mt={contentMarginTop} mb={contentMarginBottom}>
        <Box {...testIdProps(t('notEnrolledSM.title'))} accessibilityRole="header" accessible={true} mx={theme.dimensions.gutter} mb={standardMarginBetween}>
          <TextView variant="BitterBoldHeading">{t('notEnrolledSM.title')}</TextView>
        </Box>
        <Box>
          <TextArea>
            <TextView color="primary" variant="MobileBody" mb={standardMarginBetween}>
              {t('notEnrolledSM.youMust')}
            </TextView>
            <TextView color="primary" variant="MobileBody" mb={standardMarginBetween}>
              {t('notEnrolledSM.withSM')}
            </TextView>
            <TextView color="primary" variant="MobileBody" mb={standardMarginBetween}>
              {t('notEnrolledSM.toUpgrade')}
            </TextView>
            <Box mb={standardMarginBetween}>
              <VABulletList listOfText={[bulletOne]} />
            </Box>
            <Box mb={standardMarginBetween}>
              <VABulletList listOfText={[bulletTwo]} />
            </Box>
            <Box mb={standardMarginBetween}>
              <VABulletList listOfText={[bulletThree]} />
            </Box>
            <Box mb={standardMarginBetween}>
              <TextView {...textViewProps}>{t('notEnrolledSM.learnHowTo')}</TextView>
            </Box>
            <Box mb={standardMarginBetween}>
              <TextView>
                <TextView variant="MobileBodyBold">{tc('note') + ' '}</TextView>
                <TextView variant="MobileBody">{t('notEnrolledSM.doNotUseSM')}</TextView>
              </TextView>
            </Box>
          </TextArea>
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default NotEnrolledSM
