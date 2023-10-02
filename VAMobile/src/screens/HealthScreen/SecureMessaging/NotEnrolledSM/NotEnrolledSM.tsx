import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextArea, TextView, TextViewProps, VABulletList, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useExternalLink, useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_UPGRADE_MY_HEALTHEVET_PREMIUM_ACCOUNT } = getEnv()

const NotEnrolledSM: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const launchExternalLink = useExternalLink()
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
  const bulletThree = { text: t('notEnrolledSM.bothYouAndYour'), a11yLabel: a11yLabelVA(t('notEnrolledSM.bothYouAndYour')) }

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
    ...testIdProps(t('notEnrolledSM.learnHowTo')),
    ...a11yHintProp(t('notEnrolledSM.learnHowTo.a11yHint')),
  }

  return (
    <VAScrollView>
      <Box mb={contentMarginBottom}>
        <Box {...testIdProps(t('notEnrolledSM.title'))} accessibilityRole="header" accessible={true} mx={theme.dimensions.gutter} mb={standardMarginBetween}>
          <TextView variant="BitterBoldHeading">{t('notEnrolledSM.title')}</TextView>
        </Box>
        <Box>
          <TextArea>
            <TextView variant="MobileBody" paragraphSpacing={true}>
              {t('notEnrolledSM.youMust')}
            </TextView>
            <TextView variant="MobileBody" paragraphSpacing={true} accessibilityLabel={a11yLabelVA(t('notEnrolledSM.withSM'))}>
              {t('notEnrolledSM.withSM')}
            </TextView>
            <TextView variant="MobileBody" paragraphSpacing={true}>
              {t('notEnrolledSM.toUpgrade')}
            </TextView>
            <VABulletList listOfText={[bulletOne, bulletTwo, bulletThree]} paragraphSpacing={true} />
            <TextView {...textViewProps} paragraphSpacing={true}>
              {t('notEnrolledSM.learnHowTo')}
            </TextView>
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
