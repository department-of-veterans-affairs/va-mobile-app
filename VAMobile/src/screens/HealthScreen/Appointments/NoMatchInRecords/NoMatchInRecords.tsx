import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { AccordionCollapsible, Box, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { getTranslation } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

function NoMatchInRecords() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  useEffect(() => {
    logAnalyticsEvent(Events.vama_appt_noauth())
  }, [])

  function accordionContent(textID: string) {
    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
        <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(getTranslation(`noMatch.${textID}`, t))}>
          {getTranslation(`noMatch.${textID}`, t)}
        </TextView>
        <ClickToCallPhoneNumber phone={t('8006982411')} displayedText={t('noMatch.phoneNumberDisplayed')} />
      </Box>
    )
  }

  function accordionHeader(textID: string) {
    return (
      // eslint-disable-next-line react-native-a11y/has-accessibility-hint
      <TextView variant="MobileBodyBold" accessibilityLabel={a11yLabelVA(getTranslation(`noMatch.${textID}`, t))}>
        {getTranslation(`noMatch.${textID}`, t)}
      </TextView>
    )
  }

  return (
    <VAScrollView>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <Box mx={theme.dimensions.gutter}>
          {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
          <TextView
            variant="MobileBodyBold"
            accessibilityLabel={a11yLabelVA(t('noMatch.title'))}
            accessibilityRole="header"
            accessible={true}>
            {t('noMatch.title')}
          </TextView>
          {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
          <TextView
            variant="MobileBody"
            accessibilityLabel={a11yLabelVA(t('noMatch.noMatch'))}
            mt={theme.dimensions.standardMarginBetween}
            paragraphSpacing={true}>
            {t('noMatch.noMatch')}
          </TextView>
          <TextView variant="MobileBodyBold" accessibilityRole="header" accessible={true}>
            {t('noMatch.whatYouCanDo')}
          </TextView>
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <AccordionCollapsible
            header={accordionHeader('currentlyRegisteredPatient')}
            expandedContent={accordionContent('currentlyRegisteredPatientContent')}
            testID={a11yLabelVA(t('noMatch.currentlyRegisteredPatient'))}
          />
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <AccordionCollapsible
            header={accordionHeader('enrolledInHealthCare')}
            expandedContent={accordionContent('enrolledInHealthCareContent')}
            testID={a11yLabelVA(t('noMatch.enrolledInHealthCare'))}
          />
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <AccordionCollapsible
            header={accordionHeader('notEnrolled')}
            expandedContent={accordionContent('notEnrolledContent')}
            testID={a11yLabelVA(t('noMatch.notEnrolled'))}
          />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default NoMatchInRecords
