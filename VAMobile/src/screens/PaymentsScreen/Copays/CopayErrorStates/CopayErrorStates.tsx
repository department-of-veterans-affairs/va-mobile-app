import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { AlertWithHaptics, Box, ClickToCallPhoneNumber, LinkWithAnalytics, TextArea, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'

const { LINK_URL_HOW_TO_APPLY_FOR_HEALTH_CARE } = getEnv()

interface CopayErrorStatesProps {
  httpStatus: number | undefined
}

function CopayErrorStates({ httpStatus }: CopayErrorStatesProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const HealthCareApplicationLink = () => {
    return (
      <LinkWithAnalytics
        type="custom"
        onPress={() => {
          logAnalyticsEvent(Events.vama_webview(LINK_URL_HOW_TO_APPLY_FOR_HEALTH_CARE))
          navigateTo('Webview', {
            url: LINK_URL_HOW_TO_APPLY_FOR_HEALTH_CARE,
            displayTitle: t('webview.vagov'),
            loadingMessage: t('loading.vaWebsite'),
            useSSO: true,
          })
        }}
        text={t('copays.noHealthCare.message.webview')}
        a11yLabel={a11yLabelVA(t('copays.noHealthCare.message.webview'))}
        testID="healthCareApplicationLinkID"
      />
    )
  }

  const renderEnrolledError = () => (
    <AlertWithHaptics variant="error" header={t('copays.error.header')} description={t('copays.error.description')}>
      <ClickToCallPhoneNumber phone={t('8664001238')} displayedText={displayedTextPhoneNumber(t('8664001238'))} />
    </AlertWithHaptics>
  )

  const renderNotEnrolledError = () => (
    <TextArea testID="copayErrorStatesTestID">
      <Box accessibilityRole="header" accessible={true}>
        <TextView variant="MobileBodyBold">{t('copays.noHealthCare.header')}</TextView>
      </Box>
      <TextView my={theme.dimensions.standardMarginBetween} variant="MobileBody">
        <Trans
          i18nKey="copays.noHealthCare.message"
          components={{
            webview: <HealthCareApplicationLink />,
          }}
        />
      </TextView>
      <ClickToCallPhoneNumber
        phone={t('8772228387')}
        displayedText={displayedTextPhoneNumber(t('8772228387'))}
        ttyBypass
      />
    </TextArea>
  )

  const serviceErrorAlert = () => {
    const isEnrolledInHealthCare = httpStatus !== 403
    return isEnrolledInHealthCare ? renderEnrolledError() : renderNotEnrolledError()
  }

  return serviceErrorAlert()
}

export default CopayErrorStates
