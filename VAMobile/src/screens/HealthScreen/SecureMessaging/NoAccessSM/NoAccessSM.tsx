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

const { LINK_URL_HOW_TO_APPLY_FOR_HEALTH_CARE } = getEnv()

function NoAccessSM() {
  useEffect(() => {
    logAnalyticsEvent(Events.vama_sm_notenrolled())
  }, [])
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { contentMarginBottom, standardMarginBetween } = theme.dimensions

  const alertWrapperProps: BoxProps = {
    mb: standardMarginBetween,
  }

  const bulletOne = {
    text: t('noAccessSM.youAreEnrolled'),
    boldedText: ' ' + t('and'),
    a11yLabel: a11yLabelVA(t('noAccessSM.youAreEnrolled')) + ' ' + t('and'),
  }
  const bulletTwo = {
    text: t('noAccessSM.youAreRegistered'),
    a11yLabel: a11yLabelVA(t('noAccessSM.youAreRegistered')),
  }

  const linkProps: LinkProps = {
    type: 'url',
    url: LINK_URL_HOW_TO_APPLY_FOR_HEALTH_CARE,
    text: t('noAccessSM.findVACare'),
    a11yLabel: t('noAccessSM.findVACare'),
    a11yHint: t('noAccessSM.findVACare.a11yHint'),
  }

  return (
    <VAScrollView>
      <Box mb={contentMarginBottom}>
        <Box {...alertWrapperProps}>
          <AlertWithHaptics
            variant="warning"
            header={t('noAccessSM.cantAccess')}
            headerA11yLabel={a11yLabelVA(t('noAccessSM.cantAccess'))}
          />
        </Box>
        <Box>
          <TextArea>
            <TextView variant="MobileBody" paragraphSpacing={true}>
              {t('noAccessSM.systemProblem')}
            </TextView>
            <TextView variant="MobileBody" paragraphSpacing={true}>
              {t('noAccessSM.toAccess')}
            </TextView>
            <VABulletList listOfText={[bulletOne, bulletTwo]} paragraphSpacing={true} />
            <TextView variant="MobileBody" my={theme.dimensions.contentMarginTop}>
              {t('noAccessSM.pleaseCall')}
            </TextView>
            <ClickToCallPhoneNumber displayedText={displayedTextPhoneNumber(t('8773270022'))} phone={t('8773270022')} />
            <TextView variant="MobileBody" my={theme.dimensions.contentMarginTop}>
              {t('noAccessSM.notEnrolled')}
            </TextView>
            <LinkWithAnalytics {...linkProps} />
          </TextArea>
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default NoAccessSM
