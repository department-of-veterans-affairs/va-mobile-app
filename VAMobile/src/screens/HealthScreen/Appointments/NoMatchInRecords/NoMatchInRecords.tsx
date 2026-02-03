import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, PressableProps } from 'react-native-gesture-handler'

import { AccordionCollapsible, AlertWithHaptics, Box, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { getTranslation } from 'utils/formattingUtils'
import { useExternalLink, useTheme } from 'utils/hooks'

function NoMatchInRecords() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const launchExternalLink = useExternalLink()

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

  function getNoMatchAlert() {
    const pressableProps: PressableProps = {
      accessibilityRole: 'link',
      accessibilityLabel: a11yLabelVA(
        t('noMatch.alert.text.4') + t('noMatch.alert.text.5') + t('noMatch.alert.text.6'),
      ),
      onPress: (): void => {
        launchExternalLink(`tel:${t('8006982411')}`)
      },
    }

    return (
      <Box mb={theme.dimensions.standardMarginBetween}>
        <AlertWithHaptics
          variant="error"
          expandable={true}
          header={t('noMatch.alert.title')}
          headerA11yLabel={a11yLabelVA(t('noMatch.alert.title'))}
          description={t('noMatch.alert.text.1')}>
          {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
          <TextView
            accessible
            variant="MobileBody"
            paragraphSpacing={true}
            accessibilityLabel={a11yLabelVA(t('noMatch.alert.text.2'))}>
            {t('noMatch.alert.text.2')}
          </TextView>
          {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
          <TextView
            accessible
            variant="MobileBody"
            paragraphSpacing={true}
            accessibilityLabel={a11yLabelVA(t('noMatch.alert.text.3'))}>
            {t('noMatch.alert.text.3')}
          </TextView>
          <Pressable {...pressableProps}>
            <TextView paragraphSpacing={true}>
              <TextView variant="MobileBody">{t('noMatch.alert.text.4')}</TextView>
              <TextView variant="MobileBodyLink">{t('noMatch.alert.text.5')}</TextView>
              <TextView variant="MobileBody">{t('noMatch.alert.text.6')}</TextView>
            </TextView>
          </Pressable>
        </AlertWithHaptics>
      </Box>
    )
  }

  return (
    <VAScrollView>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <Box mx={theme.dimensions.gutter}>
          {getNoMatchAlert()}
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
