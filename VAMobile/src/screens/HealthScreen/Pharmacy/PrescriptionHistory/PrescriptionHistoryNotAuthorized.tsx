import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { LinkProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Link/Link'

import {
  AlertWithHaptics,
  Box,
  BoxProps,
  ClickToCallPhoneNumber,
  LinkWithAnalytics,
  TextArea,
  TextView,
  VABulletList,
  VAScrollView,
} from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

const { LINK_URL_UPGRADE_MY_HEALTHEVET_PREMIUM_ACCOUNT } = getEnv()

function PrescriptionHistoryNotAuthorized() {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { standardMarginBetween } = theme.dimensions

  useEffect(() => {
    logAnalyticsEvent(Events.vama_rx_noauth())
  }, [])

  const alertWrapperProps: BoxProps = {
    mb: standardMarginBetween,
  }

  const bulletOne = {
    text: t('prescriptions.notAuthorized.enrolled'),
    boldedText: ' ' + t('and'),
    a11yLabel: a11yLabelVA(t('prescriptions.notAuthorized.enrolled')) + ' ' + t('and'),
  }

  const bulletTwo = {
    text: t('prescriptions.notAuthorized.registered'),
    a11yLabel: a11yLabelVA(t('prescriptions.notAuthorized.registered')),
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
      <Box {...alertWrapperProps}>
        <AlertWithHaptics
          variant="warning"
          header={t('prescriptions.notAuthorized.warning')}
          headerA11yLabel={a11yLabelVA(t('prescriptions.notAuthorized.warning'))}
        />
      </Box>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView paragraphSpacing={true}>{t('prescriptions.notAuthorized.toAccess')}</TextView>
          <TextView paragraphSpacing={true}>{t('prescriptions.notAuthorized.toUpgrade')}</TextView>
          <VABulletList listOfText={[bulletOne, bulletTwo]} paragraphSpacing={true} />
          <LinkWithAnalytics {...linkProps} />
          <TextView mt={standardMarginBetween} accessibilityLabel={t('prescriptions.notAuthorized.pleaseCall.a11y')}>
            {t('prescriptions.notAuthorized.pleaseCall')}
          </TextView>
          <ClickToCallPhoneNumber displayedText={displayedTextPhoneNumber(t('8773270022'))} phone={t('8773270022')} />
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionHistoryNotAuthorized
