import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box, BoxProps, ClickToCallPhoneNumber, TextArea, TextView, TextViewProps, VABulletList, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useExternalLink, useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_UPGRADE_MY_HEALTHEVET_PREMIUM_ACCOUNT } = getEnv()

const PrescriptionHistoryNotAuthorized: FC = () => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const { standardMarginBetween } = theme.dimensions
  const launchExternalLink = useExternalLink()

  const alertWrapperProps: BoxProps = {
    mx: theme.dimensions.gutter,
    my: standardMarginBetween,
  }

  const bulletOne = {
    text: t('prescriptions.notAuthorized.enrolled'),
    boldedText: ' ' + tc('and'),
    a11yLabel: t('prescriptions.notAuthorized.enrolled.a11y'),
  }

  const bulletTwo = {
    text: t('prescriptions.notAuthorized.registered'),
    a11yLabel: t('prescriptions.notAuthorized.registered.a11y'),
  }

  const redirectLink = (): void => {
    launchExternalLink(LINK_URL_UPGRADE_MY_HEALTHEVET_PREMIUM_ACCOUNT)
  }

  const linkProps: TextViewProps = {
    variant: 'MobileBodyLink',
    onPress: redirectLink,
    accessibilityRole: 'link',
    accessibilityLabel: t('notEnrolledSM.learnHowTo.a11yLabel'),
    accessibilityHint: t('notEnrolledSM.learnHowTo.a11yHint'),
  }

  return (
    <VAScrollView>
      <Box {...alertWrapperProps}>
        <AlertBox border={'warning'} title={t('prescriptions.notAuthorized.warning')} titleA11yLabel={t('prescriptions.notAuthorized.warning.a11y')} />
      </Box>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView>{t('prescriptions.notAuthorized.toAccess')}</TextView>
          <TextView pt={standardMarginBetween}>{t('prescriptions.notAuthorized.toUpgrade')}</TextView>
          <Box my={standardMarginBetween}>
            <VABulletList listOfText={[bulletOne]} />
            <VABulletList listOfText={[bulletTwo]} />
          </Box>
          <Box mt={standardMarginBetween}>
            <TextView {...linkProps}>{t('notEnrolledSM.learnHowTo')}</TextView>
          </Box>
          <TextView mt={standardMarginBetween} accessibilityLabel={t('secureMessaging.sendError.ifTheAppStill.a11y')}>
            {t('prescriptions.notAuthorized.pleaseCall')}
          </TextView>
          <ClickToCallPhoneNumber displayedText={tc('8773270022.displayText')} phone={tc('8773270022')} />
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionHistoryNotAuthorized
