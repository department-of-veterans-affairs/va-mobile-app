import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { AlertWithHaptics, Box, ClickToCallPhoneNumber, LinkWithAnalytics, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

const { LINK_URL_HOW_TO_APPLY_FOR_HEALTH_CARE } = getEnv()

interface CopayErrorStatesProps {
  httpStatus: number | undefined
}

function CopayErrorStates({ httpStatus }: CopayErrorStatesProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const HealthCareApplicationLink = () => {
    return (
      <LinkWithAnalytics
        type="url"
        url={LINK_URL_HOW_TO_APPLY_FOR_HEALTH_CARE}
        text={t('copays.noHealthCare.message.link')}
        a11yLabel={a11yLabelVA(t('copays.noHealthCare.message.link'))}
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
            link: <HealthCareApplicationLink />,
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
